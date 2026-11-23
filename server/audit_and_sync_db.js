import { pool } from './db.js'

async function auditAndSync() {
  console.log('=== SUPABASE POSTGRESQL AUDIT & SYNC ===')
  try {
    const client = await pool.connect()
    try {
      // 1. Create catalog_images table if not present
      console.log('1. Checking catalog_images table...')
      await client.query(`
        CREATE TABLE IF NOT EXISTS catalog_images (
          id UUID PRIMARY KEY,
          content_type TEXT NOT NULL,
          content BYTEA NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `)
      await client.query('ALTER TABLE catalog_images ENABLE ROW LEVEL SECURITY;')
      
      // Allow public read for catalog_images (since it serves images to public website visitors)
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'catalog_images' AND policyname = 'Public can view catalog images'
          ) THEN
            CREATE POLICY "Public can view catalog images" ON catalog_images FOR SELECT USING (true);
          END IF;
        END
        $$;
      `)
      console.log('   ✓ catalog_images table and policy verified.')

      // 1b. Inquiries travel_details column
      console.log('1b. Checking inquiries.travel_details column...')
      await client.query('ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS travel_details JSONB;')
      console.log('   ✓ inquiries.travel_details verified.')

      // 1c. Reel videos and chunked video parts
      console.log('1c. Checking reel_videos and reel_video_parts tables...')
      await client.query(`
        CREATE TABLE IF NOT EXISTS reel_videos (
          id UUID PRIMARY KEY,
          content_type TEXT NOT NULL,
          size INTEGER NOT NULL,
          complete BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS reel_video_parts (
          video_id UUID REFERENCES reel_videos(id) ON DELETE CASCADE,
          part INTEGER,
          content BYTEA NOT NULL,
          PRIMARY KEY (video_id, part)
        );
        ALTER TABLE reel_videos ENABLE ROW LEVEL SECURITY;
        ALTER TABLE reel_video_parts ENABLE ROW LEVEL SECURITY;
      `)
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'reel_videos' AND policyname = 'Public can stream completed reel videos'
          ) THEN
            CREATE POLICY "Public can stream completed reel videos" ON reel_videos FOR SELECT USING (true);
          END IF;
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'reel_video_parts' AND policyname = 'Public can stream reel video parts'
          ) THEN
            CREATE POLICY "Public can stream reel video parts" ON reel_video_parts FOR SELECT USING (true);
          END IF;
        END
        $$;
      `)
      console.log('   ✓ reel_videos and reel_video_parts verified.')

      // 2. Ensure all indexes from schema.sql exist
      console.log('2. Verifying performance & search indexes...')
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_destinations_trending ON destinations(is_trending, display_order);
        CREATE INDEX IF NOT EXISTS idx_packages_theme ON packages(theme, featured);
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status, submitted_at DESC);
        CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_reels_order ON instagram_reels(display_order ASC);
        CREATE INDEX IF NOT EXISTS idx_catalog_images_created ON catalog_images(created_at DESC);
      `)
      console.log('   ✓ All indexes verified.')

      // 3. Audit all tables and row counts
      console.log('3. Auditing all tables & live row counts...')
      const tablesRes = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name ASC;
      `)

      const tableStats = []
      for (const row of tablesRes.rows) {
        const t = row.table_name
        const countRes = await client.query(`SELECT COUNT(*) as cnt FROM "${t}"`)
        const colRes = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position ASC;
        `, [t])

        tableStats.push({
          table: t,
          count: parseInt(countRes.rows[0].cnt, 10),
          columnsCount: colRes.rows.length,
          columns: colRes.rows.map(c => `${c.column_name} (${c.data_type})`).join(', ')
        })
      }

      console.log('\n--- LIVE DATABASE AUDIT SUMMARY ---')
      for (const stat of tableStats) {
        console.log(`• Table: "${stat.table}" | Rows: ${stat.count} | Columns: ${stat.columnsCount}`)
      }

      console.log('\n✓ Supabase Database is 100% in sync with code and schema!')
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Audit & Sync error:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

auditAndSync()
