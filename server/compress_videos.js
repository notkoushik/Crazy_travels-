import { execSync } from 'child_process'
import ffmpegPath from 'ffmpeg-static'
import fs from 'fs'
import path from 'path'

const inDir = 'public/Instagram_videos'
const outDir = 'public/Instagram_videos/compressed'

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const files = fs.readdirSync(inDir).filter(f => f.endsWith('.mp4'))

console.log('Compressing', files.length, 'videos for high-performance web streaming...')

files.forEach((f, idx) => {
  const inPath = path.join(inDir, f)
  const num = String(idx + 1).padStart(2, '0')
  const outPath = path.join(outDir, `reel_${num}.mp4`)

  const beforeSize = (fs.statSync(inPath).size / 1024 / 1024).toFixed(2)
  console.log(`[${idx + 1}/10] Compressing ${f.slice(0, 15)}... (${beforeSize} MB) -> reel_${num}.mp4`)

  const t0 = Date.now()
  execSync(`"${ffmpegPath}" -y -i "${inPath}" -c:v libx264 -crf 27 -preset veryfast -movflags +faststart -c:a aac -b:a 96k "${outPath}" 2>&1`)
  const afterSize = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2)
  const durationSec = ((Date.now() - t0) / 1000).toFixed(1)

  console.log(`   Done in ${durationSec}s: ${beforeSize} MB -> ${afterSize} MB (${Math.round((1 - afterSize / beforeSize) * 100)}% reduction)`)
})

console.log('All videos compressed successfully!')
