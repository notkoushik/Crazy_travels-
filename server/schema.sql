-- Crazy Tours Travel: PostgreSQL Database Schema
-- Database: crazy_tours_db

CREATE TABLE IF NOT EXISTS catalog_images (
  id UUID PRIMARY KEY,
  content_type TEXT NOT NULL,
  content BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE catalog_images ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'catalog_images' AND policyname = 'Public can view catalog images'
  ) THEN
    CREATE POLICY "Public can view catalog images" ON catalog_images FOR SELECT USING (true);
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS destinations (
  slug VARCHAR(120) PRIMARY KEY,
  city VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  region VARCHAR(64),
  price VARCHAR(60) NOT NULL,
  price_num INTEGER NOT NULL,
  image TEXT NOT NULL,
  season VARCHAR(120),
  duration VARCHAR(60),
  tagline TEXT,
  description TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  best_time_to_visit TEXT,
  ideal_for TEXT,
  is_trending BOOLEAN DEFAULT TRUE,
  adventure_enabled BOOLEAN DEFAULT FALSE,
  customization_options JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  google_maps_url TEXT,
  google_rating NUMERIC(2,1),
  google_reviews_count INTEGER,
  nearest_airport VARCHAR(255),
  nearest_railway VARCHAR(255),
  recommended_stay_days VARCHAR(64),
  peak_season VARCHAR(128),
  avg_temp VARCHAR(64),
  permit_required BOOLEAN DEFAULT FALSE,
  permit_details TEXT,
  clothing_advice TEXT,
  cultural_notes TEXT,
  must_try_food JSONB DEFAULT '[]'::jsonb,
  key_attractions JSONB DEFAULT '[]'::jsonb,
  network_coverage VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR(120) PRIMARY KEY,
  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,
  traveller_group TEXT CHECK (traveller_group IN ('Couples', 'Families', 'Friends & bachelors')),
  slug VARCHAR(120),
  title VARCHAR(255) NOT NULL,
  place VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  duration VARCHAR(120) NOT NULL,
  days_count INTEGER NOT NULL DEFAULT 5,
  nights_count INTEGER,
  category VARCHAR(60),
  route_summary TEXT,
  summary TEXT,
  brochure_pdf_url TEXT,
  pricing_tiers JSONB,
  things_to_carry JSONB DEFAULT '[]'::jsonb,
  cancellation_policy JSONB DEFAULT '[]'::jsonb,
  price VARCHAR(60) NOT NULL,
  price_num INTEGER NOT NULL,
  original_price VARCHAR(60),
  discount VARCHAR(60),
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  overview TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  theme VARCHAR(60) DEFAULT 'Heritage',
  featured BOOLEAN DEFAULT TRUE,
  google_maps_url TEXT,
  google_rating NUMERIC(2,1),
  google_reviews_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stays (
  id VARCHAR(120) PRIMARY KEY,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  type VARCHAR(120) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(60) NOT NULL,
  price_num INTEGER NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0,
  image TEXT NOT NULL,
  amenities JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  google_maps_url TEXT,
  google_rating NUMERIC(2,1),
  google_reviews_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS road_trips (
  id VARCHAR(120) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  route VARCHAR(255) NOT NULL,
  days VARCHAR(60) NOT NULL,
  distance VARCHAR(60) NOT NULL,
  difficulty VARCHAR(60) NOT NULL,
  image TEXT NOT NULL,
  highlights JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  stops JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS stories (
  id VARCHAR(120) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(120) NOT NULL,
  author VARCHAR(120) NOT NULL,
  date VARCHAR(60) NOT NULL,
  read_time VARCHAR(60) NOT NULL,
  image TEXT NOT NULL,
  snippet TEXT NOT NULL,
  content JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS offers (
  id VARCHAR(120) PRIMARY KEY,
  code VARCHAR(60) NOT NULL,
  title VARCHAR(255) NOT NULL,
  discount_text VARCHAR(120) NOT NULL,
  tag VARCHAR(60) NOT NULL,
  valid_till VARCHAR(60) NOT NULL,
  description TEXT NOT NULL,
  min_booking VARCHAR(60) NOT NULL,
  image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id VARCHAR(60) PRIMARY KEY,
  package_name VARCHAR(255) NOT NULL,
  travel_date VARCHAR(60) NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  hotel_type VARCHAR(120) NOT NULL DEFAULT 'Standard',
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(60) NOT NULL,
  special_requests TEXT,
  total_price INTEGER NOT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'Pending',
  payment_status VARCHAR(60) NOT NULL DEFAULT 'Unpaid',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(60) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(60) NOT NULL,
  preferred_destination VARCHAR(255) NOT NULL,
  travel_month VARCHAR(120) NOT NULL,
  travel_details JSONB,
  travelers_count VARCHAR(120) NOT NULL,
  budget_per_person VARCHAR(120) NOT NULL,
  trip_type VARCHAR(120) NOT NULL,
  notes TEXT,
  status VARCHAR(60) NOT NULL DEFAULT 'New',
  assigned_agent VARCHAR(120),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS travel_details JSONB;

CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  eyebrow VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  copy TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  action_route VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(120) PRIMARY KEY,
  quote TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  trip VARCHAR(120) NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(120) DEFAULT 'General'
);

CREATE TABLE IF NOT EXISTS instagram_reels (
  id VARCHAR(60) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  place VARCHAR(120) NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_quote TEXT NOT NULL,
  video_url TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  instagram_url TEXT,
  duration VARCHAR(30) DEFAULT '0:45',
  display_order INTEGER DEFAULT 0,
  category VARCHAR(60),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Safe idempotent column migrations for existing databases
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS adventure_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS customization_options JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug VARCHAR(120);
ALTER TABLE packages ADD COLUMN IF NOT EXISTS nights_count INTEGER;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS category VARCHAR(60);
ALTER TABLE packages ADD COLUMN IF NOT EXISTS destination_slug VARCHAR(120);
ALTER TABLE packages ADD COLUMN IF NOT EXISTS route_summary TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS brochure_pdf_url TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS pricing_tiers JSONB;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS things_to_carry JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS cancellation_policy JSONB DEFAULT '[]'::jsonb;
ALTER TABLE instagram_reels ADD COLUMN IF NOT EXISTS category VARCHAR(60);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_destinations_trending ON destinations(is_trending, display_order);
CREATE INDEX IF NOT EXISTS idx_packages_theme ON packages(theme, featured);
CREATE INDEX IF NOT EXISTS idx_packages_destination_category ON packages(destination_slug, category);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reels_order ON instagram_reels(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_reels_category ON instagram_reels(category, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_catalog_images_created ON catalog_images(created_at DESC);
