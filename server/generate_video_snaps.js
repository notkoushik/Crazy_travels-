import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

const dir = 'public/Video'
const thumbDir = 'public/Video/thumbnails'
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true })

const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'))

files.forEach((f, idx) => {
  const fullPath = path.join(dir, f)
  const prefix = `vid_${String(idx + 1).padStart(2, '0')}`

  // Extract at 2s, 6s, 10s
  try {
    execSync(`"${ffmpegPath}" -y -ss 00:00:02 -i "${fullPath}" -vframes 1 -q:v 2 "${path.join(thumbDir, `${prefix}_1.jpg`)}" 2>&1`)
    execSync(`"${ffmpegPath}" -y -ss 00:00:05 -i "${fullPath}" -vframes 1 -q:v 2 "${path.join(thumbDir, `${prefix}_2.jpg`)}" 2>&1`)
    execSync(`"${ffmpegPath}" -y -ss 00:00:08 -i "${fullPath}" -vframes 1 -q:v 2 "${path.join(thumbDir, `${prefix}_3.jpg`)}" 2>&1`)
    console.log(`Generated snaps for ${prefix} (${f})`)
  } catch (err) {
    console.error(`Error on ${prefix}:`, err.message)
  }
})

console.log('All snapshots generated!')
