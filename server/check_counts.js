import pg from 'pg'

const { Client } = pg
const connectionString = 'postgresql://postgres.fduntharvybghpwiecep:Koushik.git@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

await client.connect()

const tables = [
  'destinations',
  'packages',
  'stays',
  'bookings',
  'inquiries',
  'road_trips',
  'stories',
  'offers',
  'hero_slides',
  'reviews',
  'faqs',
  'media_assets'
]

console.log('Row counts in Supabase:')
for (const t of tables) {
  try {
    const res = await client.query(`SELECT COUNT(*) FROM ${t}`)
    console.log(`- ${t}: ${res.rows[0].count} rows`)
  } catch (e) {
    console.log(`- ${t}: ERROR - ${e.message}`)
  }
}

await client.end()
process.exit(0)
