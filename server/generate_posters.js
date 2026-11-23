import { execSync } from 'child_process'
import ffmpegPath from 'ffmpeg-static'
import fs from 'fs'
import path from 'path'

const inDir = 'public/Instagram_videos'
const thumbDir = 'public/Instagram_videos/thumbnails'

if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true })
}

const files = fs.readdirSync(inDir).filter(f => f.endsWith('.mp4'))

console.log('Generating posters for', files.length, 'videos...')

files.forEach((f, idx) => {
  const inPath = path.join(inDir, f)
  const num = String(idx + 1).padStart(2, '0')
  const outThumb = path.join(thumbDir, `reel_${num}_poster.jpg`)

  try {
    execSync(`"${ffmpegPath}" -y -ss 00:00:03 -i "${inPath}" -vframes 1 -q:v 2 "${outThumb}" 2>&1`)
    console.log(`Poster ${num} generated: reel_${num}_poster.jpg`)
  } catch (err) {
    console.error(`Failed poster ${num}:`, err.message)
  }
})
