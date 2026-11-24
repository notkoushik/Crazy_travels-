import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

const inDir = 'public/Video'
const outDir = 'public/Video/optimized'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

console.log('--- PROCESSING AND OPTIMIZING TRAVEL VIDEOS WITH FFMPEG ---')

const videoMap = [
  {
    key: 'hero_soul_travel',
    source: 'byrawpixel_ssspin.io_1795544767.mp4',
    title: 'Soul of Travel - Alpine Train & Rolling Mountain Meadows',
    speed: 1.25, // 25% slower, dreamy, smooth
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_kerala',
    source: 'milesexpedition_ssspin.io_1795545150.mp4',
    title: 'Kerala & Munnar Emerald Tea Estates Road Trip',
    speed: 1.15,
    mute: true,
  },
  {
    key: 'destination_kerala_backwaters',
    source: 'anilkumarmlg1_ssspin.io_1795545182.mp4',
    title: 'Kerala Backwaters & Coastal Rail',
    speed: 1.0,
    mute: true,
  },
  {
    key: 'destination_ladakh',
    source: 'kailashaurahouse_ssspin.io_1795545691.mp4',
    title: 'Ladakh Cliffside Monastery & Prayer Flags in Sunset Wind',
    speed: 1.1,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_ladakh_pass',
    source: 'harindervirk07_ssspin.io_1795545402.mp4',
    title: 'Ladakh High Himalayan Pass & Snow Ridges',
    speed: 1.2,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_kashmir',
    source: 'hopiieeedopieee_ssspin.io_1795545786.mp4',
    title: 'Kashmir & Himachal Alpine Snow Cottage & Pine Valleys',
    speed: 1.3,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_himachal',
    source: 'ayushirana699_ssspin.io_1795544896.mp4',
    title: 'Himachal Pine Valleys & Fluttering Prayer Flags',
    speed: 1.15,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_sikkim',
    source: 'sant1255sang_ssspin.io_1795544917.mp4',
    title: 'Mount Kanchenjunga Sunrise & Himalayan Alpenglow',
    speed: 1.1,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_kedarnath',
    source: 'arjun_pandit_77_ssspin.io_1795545006.mp4',
    title: 'Sacred Kedarnath Temple & Himalayan Snow Peaks',
    speed: 1.0,
    mute: true,
  },
  {
    key: 'destination_adventure',
    source: 'baicheng6748_ssspin.io_1795544938.mp4',
    title: 'Bachelor & Adventure Squad Gazing at Golden Mountain Peak',
    speed: 1.2,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_golden_peaks',
    source: 'kailashaurahouse_ssspin.io_1795545376.mp4',
    title: 'Sacred Himalayan Mountain Peaks in Golden Sunlight',
    speed: 1.15,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_slow_travel',
    source: 'nupur_tikariha_ssspin.io_1795545844.mp4',
    title: 'Slow Travel Indian Railways Window Journey',
    speed: 1.0,
    width: 1280,
    height: 720,
    mute: true,
  },
  {
    key: 'destination_kinnaur',
    source: 'lensandleaves_ssspin.io_1795544974.mp4',
    title: 'Kinnaur & Kalpa Mountain Hamlet & Snow Valleys',
    speed: 1.1,
    mute: true,
  },
]

const metadata = []

videoMap.forEach((v, idx) => {
  const inPath = path.join(inDir, v.source)
  if (!fs.existsSync(inPath)) {
    console.warn(`File not found: ${inPath}`)
    return
  }

  const outVideo = path.join(outDir, `${v.key}.mp4`)
  const outPoster = path.join(outDir, `${v.key}_poster.jpg`)

  console.log(`[${idx + 1}/${videoMap.length}] Encoding ${v.key} from ${v.source}...`)

  const filters = []
  if (v.speed && v.speed !== 1.0) {
    filters.push(`setpts=${v.speed}*PTS`)
  }
  if (v.width && v.height) {
    filters.push(`scale=${v.width}:${v.height}:force_original_aspect_ratio=decrease,pad=${v.width}:${v.height}:(ow-iw)/2:(oh-ih)/2:black`)
  }

  const filterParam = filters.length > 0 ? `-vf "${filters.join(',')}"` : ''
  const audioParam = v.mute ? '-an' : '-c:a aac -b:a 128k'

  const t0 = Date.now()

  // 1. Generate optimized MP4
  const cmd = `"${ffmpegPath}" -y -i "${inPath}" ${filterParam} -c:v libx264 -preset fast -crf 23 -movflags +faststart ${audioParam} "${outVideo}" 2>&1`
  try {
    execSync(cmd)
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
    const sizeMB = (fs.statSync(outVideo).size / 1024 / 1024).toFixed(2)
    console.log(`   ✓ Video encoded: ${v.key}.mp4 (${sizeMB} MB) in ${elapsed}s`)

    // 2. Generate poster at 2s
    execSync(`"${ffmpegPath}" -y -ss 00:00:02 -i "${outVideo}" -vframes 1 -q:v 2 "${outPoster}" 2>&1`)
    console.log(`   ✓ Poster generated: ${v.key}_poster.jpg`)

    metadata.push({
      key: v.key,
      title: v.title,
      videoUrl: `/Video/optimized/${v.key}.mp4`,
      posterUrl: `/Video/optimized/${v.key}_poster.jpg`,
      sizeMB,
    })
  } catch (err) {
    console.error(`   ✗ Error on ${v.key}:`, err.message)
  }
})

console.log('--- ALL VIDEOS OPTIMIZED SUCCESSFULLY ---')
console.log(JSON.stringify(metadata, null, 2))
