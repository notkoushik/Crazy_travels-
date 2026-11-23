import express from 'express'
import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const chunkSize = 3 * 1024 * 1024
const maxSize = 60 * 1024 * 1024
const validId = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i
const types = ['video/mp4', 'video/webm']

export function registerReelMedia(app, pool, requireAdminAuth) {
  let setup
  async function initialize() {
    setup ??= (async () => {
      const db = await pool.connect()
      try {
        await db.query('BEGIN')
        await db.query('SELECT pg_advisory_xact_lock(18945572)')
        await db.query(`CREATE TABLE IF NOT EXISTS reel_videos (
          id UUID PRIMARY KEY, content_type TEXT NOT NULL, size INTEGER NOT NULL,
          complete BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`)
        await db.query(`CREATE TABLE IF NOT EXISTS reel_video_parts (
          video_id UUID REFERENCES reel_videos(id) ON DELETE CASCADE,
          part INTEGER, content BYTEA NOT NULL, PRIMARY KEY(video_id, part)
        )`)
        await db.query('ALTER TABLE reel_videos ENABLE ROW LEVEL SECURITY')
        await db.query('ALTER TABLE reel_video_parts ENABLE ROW LEVEL SECURITY')
        await db.query('COMMIT')
      } catch (error) {
        await db.query('ROLLBACK')
        throw error
      } finally {
        db.release()
      }
    })().catch((error) => {
      setup = undefined
      throw error
    })
    return setup
  }

  app.param('reelVideoId', (req, res, next, id) => (validId.test(id) ? next() : res.sendStatus(404)))

  app.post('/api/reel-videos', requireAdminAuth, async (req, res) => {
    const { type, size } = req.body ?? {}
    if (!types.includes(type) || !Number.isInteger(size) || size < 1 || size > maxSize) {
      return res.status(400).json({ error: 'Choose an MP4 or WebM video up to 60 MB.' })
    }
    const id = randomUUID()
    const insert = () =>
      pool.query('INSERT INTO reel_videos (id, content_type, size) VALUES ($1,$2,$3)', [id, type, size])
    try {
      await insert()
    } catch (error) {
      if (error.code !== '42P01') throw error
      await initialize()
      await insert()
    }
    res.status(201).json({ id, chunkSize })
  })

  app.put(
    '/api/reel-videos/:reelVideoId/:part',
    requireAdminAuth,
    express.raw({ type: 'application/octet-stream', limit: chunkSize }),
    async (req, res) => {
      const { reelVideoId, part: raw } = req.params
      const part = Number(raw)
      const body = req.body
      if (!/^\d+$/.test(raw) || part >= maxSize / chunkSize || !Buffer.isBuffer(body) || !body.length)
        return res.sendStatus(400)
      const result = await pool.query(
        `INSERT INTO reel_video_parts (video_id, part, content)
      SELECT id, $2, $3 FROM reel_videos
      WHERE id = $1 AND NOT complete AND $2::integer * $4::integer < size
        AND octet_length($3::bytea) = LEAST($4::integer, size - $2::integer * $4::integer)
      ON CONFLICT (video_id, part) DO NOTHING`,
        [reelVideoId, part, body, chunkSize]
      )
      if (!result.rowCount) {
        const existing = await pool.query(
          'SELECT 1 FROM reel_video_parts WHERE video_id = $1 AND part = $2 AND content = $3',
          [reelVideoId, part, body]
        )
        if (!existing.rowCount)
          return res
            .status(409)
            .json({ error: 'This video part could not be stored. Start the upload again.' })
      }
      res.sendStatus(204)
    }
  )

  app.post('/api/reel-videos/:reelVideoId/complete', requireAdminAuth, async (req, res) => {
    const id = req.params.reelVideoId
    const header = (
      await pool.query(
        `SELECT content_type, substring(content FROM 1 FOR 12) AS header
      FROM reel_videos JOIN reel_video_parts ON video_id = id WHERE id = $1 AND part = 0`,
        [id]
      )
    ).rows[0]
    const prefix = Buffer.from(header?.header ?? [])
    const valid =
      header?.content_type === 'video/mp4'
        ? prefix.toString('ascii', 4, 8) === 'ftyp'
        : prefix.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
    if (!valid)
      return res.status(415).json({ error: 'The file could not be recognized as an MP4 or WebM video.' })
    const result = await pool.query(
      `UPDATE reel_videos SET complete = TRUE WHERE id = $1
      AND size = (SELECT SUM(octet_length(content)) FROM reel_video_parts WHERE video_id = $1)`,
      [id]
    )
    if (!result.rowCount) return res.status(409).json({ error: 'Some parts of this video are missing.' })
    res.json({ url: `/api/reel-videos/${id}` })
  })

  app.delete('/api/reel-videos/:reelVideoId', requireAdminAuth, async (req, res) => {
    const id = req.params.reelVideoId
    await pool.query(
      `DELETE FROM reel_videos WHERE id = $1 AND NOT EXISTS
      (SELECT 1 FROM instagram_reels WHERE video_url = $2)`,
      [id, `/api/reel-videos/${id}`]
    )
    res.sendStatus(204)
  })

  app.get('/api/reel-videos/:reelVideoId', async (req, res) => {
    const id = req.params.reelVideoId
    let video
    try {
      video = (
        await pool.query('SELECT size, content_type FROM reel_videos WHERE id = $1 AND complete', [id])
      ).rows[0]
    } catch (error) {
      if (error.code === '42P01') return res.sendStatus(404)
      throw error
    }
    if (!video || !types.includes(video.content_type)) return res.sendStatus(404)
    const size = video.size
    let start = 0
    let end = size - 1
    const range = req.get('range')
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range)
      if (!match || (!match[1] && !match[2]))
        return res.set('Content-Range', `bytes */${size}`).sendStatus(416)
      if (match[1]) {
        start = Number(match[1])
        end = Math.min(match[2] ? Number(match[2]) : size - 1, size - 1)
      } else start = Math.max(0, size - Number(match[2]))
      if (!Number.isSafeInteger(start) || start >= size || start > end)
        return res.set('Content-Range', `bytes */${size}`).sendStatus(416)
      // Keep each range response below the serverless payload limit. Players fetch the next range as needed.
      end = Math.min(end, start + chunkSize - 1)
      res.status(206).set('Content-Range', `bytes ${start}-${end}/${size}`)
    }
    res.set({
      'Content-Type': video.content_type,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    })
    if (req.method === 'HEAD') return res.end()

    async function* readParts() {
      for (let part = Math.floor(start / chunkSize); part <= Math.floor(end / chunkSize); part++) {
        const offset = part * chunkSize
        const from = Math.max(0, start - offset)
        const length = Math.min(chunkSize, end - offset + 1) - from
        const { rows } = await pool.query(
          'SELECT substring(content FROM $3::integer FOR $4::integer) AS content FROM reel_video_parts WHERE video_id = $1 AND part = $2',
          [id, part, from + 1, length]
        )
        if (!rows.length) throw new Error('Stored video part missing')
        yield Buffer.from(rows[0].content)
      }
    }
    await pipeline(Readable.from(readParts()), res).catch((error) => {
      if (error.code !== 'ERR_STREAM_PREMATURE_CLOSE') console.error('Reel stream failed:', error.message)
    })
  })
}
