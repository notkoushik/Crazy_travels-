import pg from 'pg'

const { Client } = pg

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:0907@localhost:5432/crazy_tours_db'

console.log('Testing connection to Supabase database...')
const client = new Client({
  connectionString,
  ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
})

try {
  await client.connect()
  console.log('✅ Successfully connected to Supabase PostgreSQL!')
  
  const res = await client.query('SELECT current_database(), current_user, version();')
  console.log('Database info:', res.rows[0])

  // Check existing tables
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `)
  console.log('Existing tables in public schema:', tablesRes.rows.map(r => r.table_name))

  await client.end()
  process.exit(0)
} catch (err) {
  console.error('❌ Connection failed:', err.message)
  process.exit(1)
}
