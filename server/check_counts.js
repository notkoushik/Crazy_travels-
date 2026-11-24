import pg from 'pg'

const { Client } = pg
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:0907@localhost:5432/crazy_tours_db'

const client = new Client({
  connectionString,
  ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
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
