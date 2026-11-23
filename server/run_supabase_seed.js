import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg
const connectionString = 'postgresql://postgres.fduntharvybghpwiecep:Koushik.git@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'

console.log('Seeding initial production data into Supabase...')
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

await client.connect()

// Read server/supabase_schema_and_seed.sql
const fullSql = fs.readFileSync(path.resolve(import.meta.dirname, './supabase_schema_and_seed.sql'), 'utf8')

// Run the full SQL
try {
  await client.query(fullSql)
  console.log('✅ Successfully applied schema and seeded Supabase!')
} catch (e) {
  console.error('Seed error:', e.message)
}

// Check row counts again
const tables = ['destinations', 'packages', 'stays', 'bookings', 'inquiries', 'road_trips', 'stories', 'offers', 'hero_slides', 'reviews', 'faqs']
for (const t of tables) {
  const res = await client.query(`SELECT COUNT(*) FROM ${t}`)
  console.log(`- ${t}: ${res.rows[0].count} rows`)
}

await client.end()
process.exit(0)
