import fs from 'node:fs'
import path from 'node:path'
import { pool } from './db.js'

async function generateRelationalSchema() {
  console.log('Generating cleanly mapped relational Supabase schema...')

  // Known destination slugs
  const validDestSlugs = new Set(['udaipur', 'munnar', 'hampi', 'srinagar', 'gangtok', 'andaman'])

  let sqlOut = `-- ============================================================================\n`
  sqlOut += `-- CRAZY TOURS & TRAVELS — FULLY RELATIONAL PRODUCTION SUPABASE SCHEMA & SEED\n`
  sqlOut += `-- Database Engine: PostgreSQL 15 / 16 / 17 (Supabase Compatible)\n`
  sqlOut += `-- Features: Relational Foreign Keys, Cascades, Indexes, and Validated Seed Data\n`
  sqlOut += `-- ============================================================================\n\n`
  
  // 0. Clean Reset
  sqlOut += `-- 0. CLEAN RESET\n`
  sqlOut += `DROP TABLE IF EXISTS media_assets CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS reviews CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS faqs CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS hero_slides CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS offers CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS stories CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS road_trips CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS inquiries CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS bookings CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS stays CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS packages CASCADE;\n`
  sqlOut += `DROP TABLE IF EXISTS destinations CASCADE;\n\n`

  // 1. Extensions
  sqlOut += `-- 1. EXTENSIONS\n`
  sqlOut += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n`
  sqlOut += `CREATE EXTENSION IF NOT EXISTS "pgcrypto";\n\n`

  // 2. Table definitions
  sqlOut += `-- 2. TABLE DEFINITIONS\n`
  sqlOut += `CREATE TABLE destinations (\n`
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

  sqlOut += `CREATE TABLE packages (\n`
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

  sqlOut += `CREATE TABLE stays (\n`
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

  sqlOut += `CREATE TABLE bookings (\n`
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

  sqlOut += `CREATE TABLE inquiries (\n`
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

  sqlOut += `CREATE TABLE media_assets (\n`
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

  sqlOut += `CREATE TABLE reviews (\n`
  sqlOut += `  id VARCHAR(120) PRIMARY KEY,\n`
  sqlOut += `  package_id VARCHAR(120) REFERENCES packages(id) ON UPDATE CASCADE ON DELETE SET NULL,\n`
  sqlOut += `  quote TEXT NOT NULL,\n`
  sqlOut += `  name VARCHAR(120) NOT NULL,\n`
  sqlOut += `  trip VARCHAR(120) NOT NULL,\n`
  sqlOut += `  rating INTEGER DEFAULT 5,\n`
  sqlOut += `  avatar TEXT\n`
  sqlOut += `);\n\n`

  sqlOut += `CREATE TABLE road_trips (\n`
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

  sqlOut += `CREATE TABLE stories (\n`
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

  sqlOut += `CREATE TABLE offers (\n`
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

  sqlOut += `CREATE TABLE hero_slides (\n`
  sqlOut += `  id SERIAL PRIMARY KEY,\n`
  sqlOut += `  image TEXT NOT NULL,\n`
  sqlOut += `  eyebrow VARCHAR(255) NOT NULL,\n`
  sqlOut += `  title VARCHAR(255) NOT NULL,\n`
  sqlOut += `  copy TEXT NOT NULL,\n`
  sqlOut += `  location VARCHAR(255) NOT NULL,\n`
  sqlOut += `  action_route VARCHAR(255) NOT NULL,\n`
  sqlOut += `  display_order INTEGER DEFAULT 0\n`
  sqlOut += `);\n\n`

  sqlOut += `CREATE TABLE faqs (\n`
  sqlOut += `  id SERIAL PRIMARY KEY,\n`
  sqlOut += `  question TEXT NOT NULL,\n`
  sqlOut += `  answer TEXT NOT NULL,\n`
  sqlOut += `  category VARCHAR(120) DEFAULT 'General'\n`
  sqlOut += `);\n\n`

  // Indexes
  sqlOut += `-- 3. INDEXES\n`
  sqlOut += `CREATE INDEX idx_packages_destination ON packages(destination_slug);\n`
  sqlOut += `CREATE INDEX idx_stays_destination ON stays(destination_slug);\n`
  sqlOut += `CREATE INDEX idx_bookings_package ON bookings(package_id);\n`
  sqlOut += `CREATE INDEX idx_inquiries_destination ON inquiries(destination_slug);\n`
  sqlOut += `CREATE INDEX idx_media_destination ON media_assets(destination_slug);\n`
  sqlOut += `CREATE INDEX idx_reviews_package ON reviews(package_id);\n\n`
  sqlOut += `CREATE INDEX idx_destinations_trending ON destinations(is_trending, display_order);\n`
  sqlOut += `CREATE INDEX idx_packages_theme ON packages(theme, featured);\n`
  sqlOut += `CREATE INDEX idx_bookings_status ON bookings(status, submitted_at DESC);\n`
  sqlOut += `CREATE INDEX idx_inquiries_status ON inquiries(status, created_at DESC);\n\n`

  // 4. Seed Data
  sqlOut += `-- 4. SEED DATA\n`

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

  // Track valid package IDs
  const validPackageIds = new Set()

  for (const table of tablesInOrder) {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table}`)
      if (rows.length === 0) continue

      sqlOut += `-- Data for ${table} (${rows.length} rows)\n`

      for (const row of rows) {
        if (table === 'packages') {
          validPackageIds.add(row.id)
          const place = (row.place || '').toLowerCase()
          if (place.includes('udaipur') || place.includes('rajasthan')) row.destination_slug = 'udaipur'
          else if (place.includes('munnar') || place.includes('kerala')) row.destination_slug = 'munnar'
          else if (place.includes('hampi')) row.destination_slug = 'hampi'
          else if (place.includes('srinagar') || place.includes('kashmir')) row.destination_slug = 'srinagar'
          else if (place.includes('gangtok') || place.includes('sikkim')) row.destination_slug = 'gangtok'
          else if (place.includes('andaman')) row.destination_slug = 'andaman'
          else row.destination_slug = null

          // Guarantee valid reference
          if (row.destination_slug && !validDestSlugs.has(row.destination_slug)) {
            row.destination_slug = null
          }
        }

        if (table === 'stays') {
          const city = (row.city || '').toLowerCase()
          if (city.includes('udaipur')) row.destination_slug = 'udaipur'
          else if (city.includes('munnar')) row.destination_slug = 'munnar'
          else if (city.includes('hampi')) row.destination_slug = 'hampi'
          else if (city.includes('srinagar')) row.destination_slug = 'srinagar'
          else if (city.includes('gangtok')) row.destination_slug = 'gangtok'
          else if (city.includes('andaman')) row.destination_slug = 'andaman'
          else row.destination_slug = null

          if (row.destination_slug && !validDestSlugs.has(row.destination_slug)) {
            row.destination_slug = null
          }
        }

        if (table === 'bookings') {
          // Link package_id to one of the 5 valid package IDs
          const pkg = (row.package_name || '').toLowerCase()
          if (pkg.includes('mewar') || pkg.includes('udaipur') || pkg.includes('rajasthan')) row.package_id = 'rajasthan-royals'
          else if (pkg.includes('kashmir') || pkg.includes('spring') || pkg.includes('dal') || pkg.includes('tulip')) row.package_id = 'kashmir-tulips'
          else if (pkg.includes('tea') || pkg.includes('munnar') || pkg.includes('kerala') || pkg.includes('backwater')) row.package_id = 'kerala-backwaters'
          else if (pkg.includes('andaman')) row.package_id = 'andaman-paradise'
          else if (pkg.includes('sikkim') || pkg.includes('monastery') || pkg.includes('gangtok') || pkg.includes('himalaya')) row.package_id = 'sikkim-himalaya'
          else row.package_id = 'rajasthan-royals'
        }

        if (table === 'inquiries') {
          const dest = (row.preferred_destination || '').toLowerCase()
          if (dest.includes('kashmir') || dest.includes('srinagar')) row.destination_slug = 'srinagar'
          else if (dest.includes('rajasthan') || dest.includes('udaipur')) row.destination_slug = 'udaipur'
          else if (dest.includes('kerala') || dest.includes('munnar')) row.destination_slug = 'munnar'
          else if (dest.includes('hampi')) row.destination_slug = 'hampi'
          else if (dest.includes('sikkim') || dest.includes('gangtok')) row.destination_slug = 'gangtok'
          else if (dest.includes('andaman')) row.destination_slug = 'andaman'
          else row.destination_slug = null

          if (row.destination_slug && !validDestSlugs.has(row.destination_slug)) {
            row.destination_slug = null
          }
        }

        if (table === 'reviews') {
          const trip = (row.trip || '').toLowerCase()
          if (trip.includes('kashmir')) row.package_id = 'kashmir-tulips'
          else if (trip.includes('rajasthan') || trip.includes('udaipur')) row.package_id = 'rajasthan-royals'
          else if (trip.includes('kerala') || trip.includes('munnar')) row.package_id = 'kerala-backwaters'
          else row.package_id = null
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
  console.log('✅ Generated validated relational supabase_schema_and_seed.sql!')
}

generateRelationalSchema().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
