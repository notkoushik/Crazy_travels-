import { execSync } from 'child_process'
import ffmpegPath from 'ffmpeg-static'
import fs from 'fs'
import path from 'path'

const dir = 'public/Instagram_videos'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'))

console.log(`Analyzing ${files.length} videos with ffmpeg...`)

files.forEach((f, idx) => {
  const fullPath = path.join(dir, f)
  try {
    const output = execSync(`"${ffmpegPath}" -i "${fullPath}" 2>&1`, { encoding: 'utf8' })
  } catch (err) {
    const text = err.stdout || err.stderr || err.message
    const durationMatch = text.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/)
    const videoMatch = text.match(/Video: (.+)/)
    const resMatch = text.match(/, (\d{3,4}x\d{3,4})/)
    console.log(`Video ${idx + 1}: ${f.slice(0, 20)}...`)
    console.log(`  Duration: ${durationMatch ? durationMatch[1] : 'unknown'}`)
    console.log(`  Resolution: ${resMatch ? resMatch[1] : 'unknown'}`)
    console.log(`  Size: ${(fs.statSync(fullPath).size / 1024 / 1024).toFixed(2)} MB`)
  }
})
