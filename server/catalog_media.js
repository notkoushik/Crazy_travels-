import { randomUUID } from 'node:crypto'
import multer from 'multer'

const maxUploadBytes = 4 * 1024 * 1024
const imageTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadBytes + 1, files: 10, fields: 0 },
})

const collectImages = (middleware) => (req, res, next) => {
  middleware(req, res, (error) => {
    if (!error) return next()
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'The uploaded photo must be 4 MB or smaller.' })
    }
    res.status(400).json({ error: 'Choose a photo and try uploading it again.' })
  })
}

function contentType(buffer) {
  if (buffer.length < 12) return undefined
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg'
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return 'image/png'
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP')
    return 'image/webp'
  if (['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) return 'image/gif'
  if (buffer.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(buffer.toString('ascii', 8, 32)))
    return 'image/avif'
}

export function registerCatalogMedia(app, pool, requireAdminAuth) {
  let schemaReady

  // Existing deployments may predate catalog media. Serialize initialization across instances.
  function initializeSchema() {
    schemaReady ??= (async () => {
      const db = await pool.connect()
      try {
        await db.query('BEGIN')
        await db.query('SELECT pg_advisory_xact_lock(18945571)')
        await db.query(`CREATE TABLE IF NOT EXISTS catalog_images (
          id UUID PRIMARY KEY,
          content_type TEXT NOT NULL,
          content BYTEA NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`)
        await db.query('ALTER TABLE catalog_images ENABLE ROW LEVEL SECURITY')
        await db.query('COMMIT')
      } catch (error) {
        await db.query('ROLLBACK')
        throw error
      } finally {
        db.release()
      }
    })().catch((error) => {
      schemaReady = undefined
      throw error
    })
    return schemaReady
  }

  async function storeImages(files) {
    const images = files.map((file) => ({
      id: randomUUID(),
      bytes: file.buffer,
      type: contentType(file.buffer),
    }))
    if (images.some((image) => !image.type)) return null

    const values = images.flatMap(({ id, type, bytes }) => [id, type, bytes])
    const rows = images.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`)
    const query = `INSERT INTO catalog_images (id, content_type, content) VALUES ${rows.join(', ')}`
    try {
      await pool.query(query, values)
    } catch (error) {
      if (error.code !== '42P01') throw error
      await initializeSchema()
      await pool.query(query, values)
    }

    return images.map(({ id, bytes, type }) => ({
      url: `/api/media/${id}`,
      filename: `${id}.${imageTypes[type]}`,
      size: bytes.length,
      mimetype: type,
    }))
  }

  const save = (multiple) => async (req, res) => {
    const files = multiple ? req.files : [req.file].filter(Boolean)
    if (!files?.length) return res.status(400).json({ error: 'Choose a photo to upload.' })
    if (files.reduce((total, file) => total + file.size, 0) > maxUploadBytes) {
      return res.status(413).json({ error: 'Upload these photos in smaller batches.' })
    }
    try {
      const images = await storeImages(files)
      if (!images)
        return res.status(415).json({ error: 'Choose a valid JPEG, PNG, WebP, AVIF, or GIF photo.' })
      res.json(
        multiple
          ? { success: true, urls: images.map(({ url }) => url), files: images }
          : { success: true, ...images[0] }
      )
    } catch (error) {
      console.error('Catalog image upload failed:', error)
      res.status(500).json({ error: 'The photo could not be stored. Try uploading it again.' })
    }
  }

  app.post('/api/upload', requireAdminAuth, collectImages(upload.single('file')), save(false))
  app.post('/api/upload-multiple', requireAdminAuth, collectImages(upload.array('files', 10)), save(true))

  app.get('/api/media/:id', async (req, res) => {
    const { id } = req.params
    if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id)) return res.sendStatus(404)

    try {
      const { rows } = await pool.query('SELECT content_type, content FROM catalog_images WHERE id = $1', [
        id,
      ])
      if (!rows.length || !Object.hasOwn(imageTypes, rows[0].content_type)) return res.sendStatus(404)
      res.set('Cache-Control', 'public, max-age=31536000, immutable')
      res.set('X-Content-Type-Options', 'nosniff')
      res.type(rows[0].content_type).send(Buffer.from(rows[0].content))
    } catch (error) {
      if (error.code === '42P01') return res.sendStatus(404)
      console.error('Catalog image could not be loaded:', error)
      res.sendStatus(503)
    }
  })
}
