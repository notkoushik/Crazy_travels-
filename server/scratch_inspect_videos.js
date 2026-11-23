import fs from 'fs'
import path from 'path'

const dir = 'public/Instagram_videos'
const files = fs.readdirSync(dir)

console.log(`Found ${files.length} files:`)
files.forEach((f, idx) => {
  const stat = fs.statSync(path.join(dir, f))
  console.log(`${idx + 1}. ${f} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`)
})
