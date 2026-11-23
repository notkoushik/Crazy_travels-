import pg from 'pg'

const { Client } = pg

const connectionString = 'postgresql://postgres.fduntharvybghpwiecep:Koushik.git@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'

console.log('Testing connection to Supabase database...')
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
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
