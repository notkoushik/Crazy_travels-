import { pool } from './db.js'

async function check() {
  try {
    const info = await pool.query('SELECT current_database(), current_user, inet_server_addr()')
    console.log('--- DATABASE CONNECTION ---')
    console.log('Database Name:', info.rows[0].current_database)
    console.log('Database User:', info.rows[0].current_user)
    console.log('Server IP:', info.rows[0].inet_server_addr)

    console.log('\n--- CHECKING TABLES ---')
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name ASC
    `)
    console.log('Existing Public Tables in Supabase:', tables.rows.map(r => r.table_name))

    console.log('\n--- CHECKING INSTAGRAM_REELS TABLE ---')
    const count = await pool.query('SELECT COUNT(*) as total FROM instagram_reels')
    console.log('Total Rows in instagram_reels table:', count.rows[0].total)

    const sample = await pool.query(`
      SELECT id, title, place, customer_name, rating, instagram_url, video_url 
      FROM instagram_reels 
      ORDER BY display_order ASC 
      LIMIT 3
    `)
    console.log('\nSample records in Supabase:')
    console.log(JSON.stringify(sample.rows, null, 2))
  } catch (err) {
    console.error('Error querying Supabase:', err.message)
  } finally {
    await pool.end()
  }
}

check()
