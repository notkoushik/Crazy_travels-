import fs from 'node:fs'
import path from 'node:path'
import { pool } from './db.js'

async function generateRelationalSchema() {
  console.log('Generating fully connected relational Supabase schema with Foreign Keys...')

  let sqlOut = `-- ============================================================================\n`
  sqlOut += `-- CRAZY TOURS & TRAVELS — FULLY RELATIONAL PRODUCTION SUPABASE SCHEMA & SEED\n`
  sqlOut += `-- Database Engine: PostgreSQL 15 / 16 (Supabase Compatible)\n`
  sqlOut += `-- Features: Full Foreign Key constraints, Cascades, Indexes, and Relational Integrity\n`
  sqlOut += `-- ============================================================================\n\n`
  
  // 0. Extensions
  sqlOut += `-- 0. ENABLE USEFUL EXTENSIONS\n`
  sqlOut += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n`
  sqlOut += `CREATE EXTENSION IF NOT EXISTS "pgcrypto";\n\n`

  sqlOut += `-- ============================================================================\n`
  sqlOut += `-- 1. TABLE DEFINITIONS WITH RELATIONAL FOREIGN KEYS\n`
  sqlOut += `-- ============================================================================\n\n`

  // 1. Destinations (Parent Entity)
  sqlOut += `-- PARENT TABLE: Destinations\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS destinations (\n`
  sqlOut += `  slug VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  city VARCHAR(120) NOT NULL,\n`
  sqlOut += `  country VARCHAR(120) NOT NULL,\n`
  sqlOut += `  state VARCHAR(120) NOT NULL,\n`
  sqlOut += `  region VARCHAR(64) DEFAULT 'North India',\n`
  sqlOut += `  price VARCHAR(60) NOT NULL,\n`
  sqlOut += `  price_num INTEGER NOT NULL,\n`
  sqlOut += `  image TEXT NOT NULL,\n`
  sqlOut += `  season VARCHAR(120),\n`
  sqlOut += `  duration VARCHAR(60),\n`
  sqlOut += `  tagline TEXT,\n`
  sqlOut += `  description TEXT,\n`
  sqlOut += `  highlights JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  gallery JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  best_time_to_visit TEXT,\n`
  sqlOut += `  ideal_for TEXT,\n`
  sqlOut += `  is_trending BOOLEAN DEFAULT TRUE,\n`
  sqlOut += `  display_order INTEGER DEFAULT 0,\n`
  sqlOut += `  latitude NUMERIC(9,6),\n`
  sqlOut += `  longitude NUMERIC(9,6),\n`
  sqlOut += `  google_maps_url TEXT,\n`
  sqlOut += `  google_rating NUMERIC(2,1) DEFAULT 4.9,\n`
  sqlOut += `  google_reviews_count INTEGER DEFAULT 1250,\n`
  sqlOut += `  nearest_airport VARCHAR(255),\n`
  sqlOut += `  nearest_railway VARCHAR(255),\n`
  sqlOut += `  recommended_stay_days VARCHAR(64) DEFAULT '4 Nights / 5 Days',\n`
  sqlOut += `  peak_season VARCHAR(128),\n`
  sqlOut += `  avg_temp VARCHAR(64),\n`
  sqlOut += `  permit_required BOOLEAN DEFAULT FALSE,\n`
  sqlOut += `  permit_details TEXT,\n`
  sqlOut += `  clothing_advice TEXT,\n`
  sqlOut += `  cultural_notes TEXT,\n`
  sqlOut += `  must_try_food JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  key_attractions JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  network_coverage VARCHAR(128) DEFAULT 'Jio, Airtel 5G Available',\n`
  sqlOut += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`
  sqlOut += `);\n\n`

  // 2. Packages (Child of Destinations)
  sqlOut += `-- CHILD TABLE: Tour Packages (Relates to Destinations via destination_slug)\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS packages (\n`
  sqlOut += `  id VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,\n`
  sqlOut += `  slug VARCHAR(120),\n`
  sqlOut += `  title VARCHAR(255) NOT NULL,\n`
  sqlOut += `  place VARCHAR(120) NOT NULL,\n`
  sqlOut += `  state VARCHAR(120) NOT NULL,\n`
  sqlOut += `  duration VARCHAR(120) NOT NULL,\n`
  sqlOut += `  days_count INTEGER NOT NULL DEFAULT 5,\n`
  sqlOut += `  price VARCHAR(60) NOT NULL,\n`
  sqlOut += `  price_num INTEGER NOT NULL,\n`
  sqlOut += `  original_price VARCHAR(60),\n`
  sqlOut += `  discount VARCHAR(60),\n`
  sqlOut += `  rating NUMERIC(3,2) DEFAULT 4.9,\n`
  sqlOut += `  review_count INTEGER DEFAULT 12,\n`
  sqlOut += `  image TEXT NOT NULL,\n`
  sqlOut += `  gallery JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  overview TEXT,\n`
  sqlOut += `  highlights JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  inclusions JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  exclusions JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  itinerary JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  theme VARCHAR(60) DEFAULT 'Heritage',\n`
  sqlOut += `  featured BOOLEAN DEFAULT TRUE,\n`
  sqlOut += `  google_maps_url TEXT,\n`
  sqlOut += `  google_rating NUMERIC(2,1) DEFAULT 4.9,\n`
  sqlOut += `  google_reviews_count INTEGER DEFAULT 1200,\n`
  sqlOut += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`
  sqlOut += `);\n\n`

  // 3. Stays (Child of Destinations)
  sqlOut += `-- CHILD TABLE: Stays & Havelis (Relates to Destinations via destination_slug)\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS stays (\n`
  sqlOut += `  id VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,\n`
  sqlOut += `  city VARCHAR(120) NOT NULL,\n`
  sqlOut += `  state VARCHAR(120) NOT NULL,\n`
  sqlOut += `  type VARCHAR(120) NOT NULL,\n`
  sqlOut += `  name VARCHAR(255) NOT NULL,\n`
  sqlOut += `  price VARCHAR(60) NOT NULL,\n`
  sqlOut += `  price_num INTEGER NOT NULL,\n`
  sqlOut += `  rating NUMERIC(3,2) DEFAULT 4.8,\n`
  sqlOut += `  image TEXT NOT NULL,\n`
  sqlOut += `  amenities JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  description TEXT,\n`
  sqlOut += `  google_maps_url TEXT,\n`
  sqlOut += `  google_rating NUMERIC(2,1) DEFAULT 4.9,\n`
  sqlOut += `  google_reviews_count INTEGER DEFAULT 850,\n`
  sqlOut += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`
  sqlOut += `);\n\n`

  // 4. Bookings (Child of Packages)
  sqlOut += `-- CHILD TABLE: Bookings & Vouchers (Relates to Packages via package_id, RESTRICT delete prevents data loss)\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS bookings (\n`
  sqlOut += `  booking_id VARCHAR(60) PRIMARY KEY,\n`
  sqlOut += `  package_id VARCHAR(120) REFERENCES packages(id) ON UPDATE CASCADE ON DELETE RESTRICT,\n`
  sqlOut += `  package_name VARCHAR(255) NOT NULL,\n`
  sqlOut += `  travel_date VARCHAR(60) NOT NULL,\n`
  sqlOut += `  adults INTEGER NOT NULL DEFAULT 1,\n`
  sqlOut += `  children INTEGER NOT NULL DEFAULT 0,\n`
  sqlOut += `  hotel_type VARCHAR(120) NOT NULL DEFAULT 'Standard',\n`
  sqlOut += `  customer_name VARCHAR(255) NOT NULL,\n`
  sqlOut += `  customer_email VARCHAR(255) NOT NULL,\n`
  sqlOut += `  customer_phone VARCHAR(60) NOT NULL,\n`
  sqlOut += `  special_requests TEXT,\n`
  sqlOut += `  total_price INTEGER NOT NULL,\n`
  sqlOut += `  status VARCHAR(60) NOT NULL DEFAULT 'Pending',\n`
  sqlOut += `  payment_status VARCHAR(60) NOT NULL DEFAULT 'Unpaid',\n`
  sqlOut += `  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`
  sqlOut += `);\n\n`

  // 5. Inquiries (Child of Destinations)
  sqlOut += `-- CHILD TABLE: Customer CRM Inquiries (Relates to Destinations via destination_slug)\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS inquiries (\n`
  sqlOut += `  id VARCHAR(60) PRIMARY KEY,\n`
  sqlOut += `  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,\n`
  sqlOut += `  full_name VARCHAR(255) NOT NULL,\n`
  sqlOut += `  email VARCHAR(255) NOT NULL,\n`
  sqlOut += `  phone VARCHAR(60) NOT NULL,\n`
  sqlOut += `  preferred_destination VARCHAR(255) NOT NULL,\n`
  sqlOut += `  travel_month VARCHAR(120) NOT NULL,\n`
  sqlOut += `  travelers_count VARCHAR(120) NOT NULL,\n`
  sqlOut += `  budget_per_person VARCHAR(120) NOT NULL,\n`
  sqlOut += `  trip_type VARCHAR(120) NOT NULL,\n`
  sqlOut += `  notes TEXT,\n`
  sqlOut += `  status VARCHAR(60) NOT NULL DEFAULT 'New',\n`
  sqlOut += `  assigned_agent VARCHAR(120),\n`
  sqlOut += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`
  sqlOut += `);\n\n`

  // 6. Media Assets (Child of Destinations)
  sqlOut += `-- CHILD TABLE: Media Assets (Relates to Destinations via destination_slug)\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS media_assets (\n`
  sqlOut += `  id VARCHAR(64) PRIMARY KEY,\n`
  sqlOut += `  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,\n`
  sqlOut += `  filename VARCHAR(255) NOT NULL,\n`
  sqlOut += `  original_name VARCHAR(255) NOT NULL,\n`
  sqlOut += `  mime_type VARCHAR(64) NOT NULL,\n`
  sqlOut += `  size_bytes BIGINT NOT NULL,\n`
  sqlOut += `  relative_path VARCHAR(500) NOT NULL,\n`
  sqlOut += `  module VARCHAR(64) NOT NULL,\n`
  sqlOut += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`
  sqlOut += `);\n\n`

  // 7. Reviews (Child of Packages)
  sqlOut += `-- CHILD TABLE: Reviews (Relates to Packages via package_id)\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS reviews (\n`
  sqlOut += `  id VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  package_id VARCHAR(120) REFERENCES packages(id) ON UPDATE CASCADE ON DELETE SET NULL,\n`
  sqlOut += `  quote TEXT NOT NULL,\n`
  sqlOut += `  name VARCHAR(120) NOT NULL,\n`
  sqlOut += `  trip VARCHAR(120) NOT NULL,\n`
  sqlOut += `  rating INTEGER DEFAULT 5,\n`
  sqlOut += `  avatar TEXT\n`
  sqlOut += `);\n\n`

  // Independent Tables: Road trips, Stories, Offers, Hero Slides, FAQs
  sqlOut += `-- INDEPENDENT CONTENT & MARKETING TABLES\n`
  sqlOut += `CREATE TABLE IF NOT EXISTS road_trips (\n`
  sqlOut += `  id VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  name VARCHAR(255) NOT NULL,\n`
  sqlOut += `  route VARCHAR(255) NOT NULL,\n`
  sqlOut += `  days VARCHAR(60) NOT NULL,\n`
  sqlOut += `  distance VARCHAR(60) NOT NULL,\n`
  sqlOut += `  difficulty VARCHAR(60) NOT NULL,\n`
  sqlOut += `  image TEXT NOT NULL,\n`
  sqlOut += `  highlights JSONB DEFAULT '[]'::jsonb,\n`
  sqlOut += `  description TEXT,\n`
  sqlOut += `  stops JSONB DEFAULT '[]'::jsonb\n`
  sqlOut += `);\n\n`

  sqlOut += `CREATE TABLE IF NOT EXISTS stories (\n`
  sqlOut += `  id VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  title VARCHAR(255) NOT NULL,\n`
  sqlOut += `  category VARCHAR(120) NOT NULL,\n`
  sqlOut += `  author VARCHAR(120) NOT NULL,\n`
  sqlOut += `  date VARCHAR(60) NOT NULL,\n`
  sqlOut += `  read_time VARCHAR(60) NOT NULL,\n`
  sqlOut += `  image TEXT NOT NULL,\n`
  sqlOut += `  snippet TEXT NOT NULL,\n`
  sqlOut += `  content JSONB DEFAULT '[]'::jsonb\n`
  sqlOut += `);\n\n`

  sqlOut += `CREATE TABLE IF NOT EXISTS offers (\n`
  sqlOut += `  id VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  code VARCHAR(60) NOT NULL,\n`
  sqlOut += `  title VARCHAR(255) NOT NULL,\n`
  sqlOut += `  discount_text VARCHAR(120) NOT NULL,\n`
  sqlOut += `  tag VARCHAR(60) NOT NULL,\n`
  sqlOut += `  valid_till VARCHAR(60) NOT NULL,\n`
  sqlOut += `  description TEXT NOT NULL,\n`
  sqlOut += `  min_booking VARCHAR(60) NOT NULL,\n`
  sqlOut += `  image TEXT NOT NULL\n`
  sqlOut += `);\n\n`

  sqlOut += `CREATE TABLE IF NOT EXISTS hero_slides (\n`
  sqlOut += `  id SERIAL PRIMARY KEY,\n`
  sqlOut += `  image TEXT NOT NULL,\n`
  sqlOut += `  eyebrow VARCHAR(255) NOT NULL,\n`
  sqlOut += `  title VARCHAR(255) NOT NULL,\n`
  sqlOut += `  copy TEXT NOT NULL,\n`
  sqlOut += `  location VARCHAR(255) NOT NULL,\n`
  sqlOut += `  action_route VARCHAR(255) NOT NULL,\n`
  sqlOut += `  display_order INTEGER DEFAULT 0\n`
  sqlOut += `);\n\n`

  sqlOut += `CREATE TABLE IF NOT EXISTS faqs (\n`
  sqlOut += `  id SERIAL PRIMARY KEY,\n`
  sqlOut += `  question TEXT NOT NULL,\n`
  sqlOut += `  answer TEXT NOT NULL,\n`
  sqlOut += `  category VARCHAR(120) DEFAULT 'General'\n`
  sqlOut += `);\n\n`

  // 2. Foreign Key Indexes & Lookup Indexes
  sqlOut += `-- ============================================================================\n`
  sqlOut += `-- 2. FOREIGN KEY INDEXES & HIGH-PERFORMANCE QUERY INDEXES\n`
  sqlOut += `-- ============================================================================\n\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination_slug);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_stays_destination ON stays(destination_slug);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_bookings_package ON bookings(package_id);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_inquiries_destination ON inquiries(destination_slug);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_media_destination ON media_assets(destination_slug);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_reviews_package ON reviews(package_id);\n\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_destinations_trending ON destinations(is_trending, display_order);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_packages_theme ON packages(theme, featured);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status, submitted_at DESC);\n`
  sqlOut += `CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at DESC);\n\n`

  // 3. Populate Seed Data with populated Foreign Keys!
  sqlOut += `-- ============================================================================\n`
  sqlOut += `-- 3. SEED DATA (SAFE RE-RUNNABLE INSERT STATEMENTS WITH FOREIGN KEYS)\n`
  sqlOut += `-- ============================================================================\n\n`

  // Export destinations first (parent)
  const tablesInOrder = [
    'destinations',
    'packages',
    'stays',
    'bookings',
    'inquiries',
    'reviews',
    'road_trips',
    'stories',
    'offers',
    'hero_slides',
    'faqs',
    'media_assets'
  ]

  for (const table of tablesInOrder) {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table}`)
      if (rows.length === 0) continue

      sqlOut += `-- Data for ${table} (${rows.length} rows)\n`

      for (const row of rows) {
        // Automatically inject foreign keys based on business mapping if not yet set
        if (table === 'packages' && !row.destination_slug) {
          const place = (row.place || '').toLowerCase()
          if (place.includes('udaipur')) row.destination_slug = 'udaipur'
          else if (place.includes('munnar') || place.includes('kerala')) row.destination_slug = 'munnar'
          else if (place.includes('hampi')) row.destination_slug = 'hampi'
          else if (place.includes('srinagar') || place.includes('kashmir')) row.destination_slug = 'srinagar'
          else if (place.includes('gangtok') || place.includes('sikkim')) row.destination_slug = 'gangtok'
          else if (place.includes('jaipur') || place.includes('rajasthan')) row.destination_slug = 'jaipur'
        }

        if (table === 'stays' && !row.destination_slug) {
          const city = (row.city || '').toLowerCase()
          if (city.includes('udaipur')) row.destination_slug = 'udaipur'
          else if (city.includes('munnar')) row.destination_slug = 'munnar'
          else if (city.includes('hampi')) row.destination_slug = 'hampi'
          else if (city.includes('srinagar')) row.destination_slug = 'srinagar'
          else if (city.includes('gangtok')) row.destination_slug = 'gangtok'
          else if (city.includes('jaipur')) row.destination_slug = 'jaipur'
        }

        if (table === 'bookings' && !row.package_id) {
          const pkg = (row.package_name || '').toLowerCase()
          if (pkg.includes('mewar') || pkg.includes('udaipur')) row.package_id = 'pkg-udaipur-heritage'
          else if (pkg.includes('kashmir') || pkg.includes('spring') || pkg.includes('dal')) row.package_id = 'pkg-kashmir-spring'
          else if (pkg.includes('tea') || pkg.includes('munnar')) row.package_id = 'pkg-munnar-plantations'
          else if (pkg.includes('hampi') || pkg.includes('vijayanagara')) row.package_id = 'pkg-hampi-ruins'
          else if (pkg.includes('sikkim') || pkg.includes('monastery') || pkg.includes('gangtok')) row.package_id = 'pkg-sikkim-monasteries'
        }

        if (table === 'inquiries' && !row.destination_slug) {
          const dest = (row.preferred_destination || '').toLowerCase()
          if (dest.includes('kashmir') || dest.includes('srinagar')) row.destination_slug = 'srinagar'
          else if (dest.includes('rajasthan') || dest.includes('udaipur') || dest.includes('jaipur')) row.destination_slug = 'udaipur'
          else if (dest.includes('kerala') || dest.includes('munnar')) row.destination_slug = 'munnar'
          else if (dest.includes('hampi') || dest.includes('karnataka')) row.destination_slug = 'hampi'
          else if (dest.includes('sikkim') || dest.includes('gangtok')) row.destination_slug = 'gangtok'
        }

        if (table === 'reviews' && !row.package_id) {
          const trip = (row.trip || '').toLowerCase()
          if (trip.includes('kashmir')) row.package_id = 'pkg-kashmir-spring'
          else if (trip.includes('rajasthan') || trip.includes('udaipur')) row.package_id = 'pkg-udaipur-heritage'
          else if (trip.includes('munnar') || trip.includes('kerala')) row.package_id = 'pkg-munnar-plantations'
        }

        const cols = Object.keys(row)
        const colNames = cols.join(', ')
        const valList = cols.map(col => {
          const val = row[col]
          if (val === null || val === undefined) return 'NULL'
          if (typeof val === 'number') return val
          if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
          if (typeof val === 'object') {
            if (val instanceof Date) return `'${val.toISOString()}'`
            return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`
          }
          return `'${String(val).replace(/'/g, "''")}'`
        }).join(', ')

        let conflictClause = 'DO NOTHING'
        if (table === 'destinations') conflictClause = '(slug) DO NOTHING'
        else if (table === 'packages' || table === 'stays' || table === 'road_trips' || table === 'stories' || table === 'offers' || table === 'inquiries' || table === 'reviews' || table === 'media_assets') conflictClause = '(id) DO NOTHING'
        else if (table === 'bookings') conflictClause = '(booking_id) DO NOTHING'
        else if (table === 'hero_slides' || table === 'faqs') conflictClause = '(id) DO NOTHING'

        sqlOut += `INSERT INTO ${table} (${colNames})\nVALUES (${valList})\nON CONFLICT ${conflictClause};\n`
      }
      sqlOut += `\n`
    } catch (e) {
      console.warn(`Could not export ${table}:`, e.message)
    }
  }

  const outPath = path.resolve(import.meta.dirname, './supabase_schema_and_seed.sql')
  fs.writeFileSync(outPath, sqlOut, 'utf8')
  console.log('✅ Generated relational supabase_schema_and_seed.sql successfully! Total size:', (sqlOut.length / 1024).toFixed(1), 'KB')

  process.exit(0)
}

generateRelationalSchema().catch(e => {
  console.error(e)
  process.exit(1)
})
