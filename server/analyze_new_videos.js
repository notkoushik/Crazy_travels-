import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

const dir = 'public/Video'
const thumbDir = 'public/Video/thumbnails'
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true })

const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'))
console.log(`Analyzing ${files.length} videos in public/Video...`)

const results = []

files.forEach((f, idx) => {
  const fullPath = path.join(dir, f)
  const sizeMB = (fs.statSync(fullPath).size / 1024 / 1024).toFixed(2)
  let duration = 'unknown'
  let resolution = 'unknown'
  let aspect = 'unknown'

  try {
    execSync(`"${ffmpegPath}" -i "${fullPath}" 2>&1`, { encoding: 'utf8' })
  } catch (err) {
    const text = err.stdout || err.stderr || err.message || ''
    const dMatch = text.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/)
    const rMatch = text.match(/, (\d{3,4}x\d{3,4})/)
    if (dMatch) duration = dMatch[1]
    if (rMatch) {
      resolution = rMatch[1]
      const [w, h] = resolution.split('x').map(Number)
      aspect = w > h ? 'Landscape (16:9)' : w < h ? 'Portrait (9:16)' : 'Square'
    }
  }

  // Generate thumbnail at 2 seconds
  const thumbName = `video_${String(idx + 1).padStart(2, '0')}_snap.jpg`
  const thumbPath = path.join(thumbDir, thumbName)
  try {
    execSync(`"${ffmpegPath}" -y -ss 00:00:02 -i "${fullPath}" -vframes 1 -q:v 2 "${thumbPath}" 2>&1`)
  } catch (e) {}

  results.push({ idx: idx + 1, file: f, sizeMB: `${sizeMB} MB`, duration, resolution, aspect, thumb: thumbName })
})

console.log(JSON.stringify(results, null, 2))
