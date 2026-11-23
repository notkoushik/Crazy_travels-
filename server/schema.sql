-- Crazy Tours & Travels: PostgreSQL Database Schema
-- Database: crazy_tours_db

CREATE TABLE IF NOT EXISTS destinations (
  slug VARCHAR(120) PRIMARY KEY,
  city VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
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
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR(120) PRIMARY KEY,
  slug VARCHAR(120),
  title VARCHAR(255) NOT NULL,
  place VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  duration VARCHAR(120) NOT NULL,
  days_count INTEGER NOT NULL DEFAULT 5,
  price VARCHAR(60) NOT NULL,
  price_num INTEGER NOT NULL,
  original_price VARCHAR(60),
  discount VARCHAR(60),
  rating NUMERIC(3,2) DEFAULT 4.9,
  review_count INTEGER DEFAULT 12,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  overview TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  theme VARCHAR(60) DEFAULT 'Heritage',
  featured BOOLEAN DEFAULT TRUE,
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
  rating NUMERIC(3,2) DEFAULT 4.8,
  image TEXT NOT NULL,
  amenities JSONB DEFAULT '[]'::jsonb,
  description TEXT,
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
  travelers_count VARCHAR(120) NOT NULL,
  budget_per_person VARCHAR(120) NOT NULL,
  trip_type VARCHAR(120) NOT NULL,
  notes TEXT,
  status VARCHAR(60) NOT NULL DEFAULT 'New',
  assigned_agent VARCHAR(120),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_destinations_trending ON destinations(is_trending, display_order);
CREATE INDEX IF NOT EXISTS idx_packages_theme ON packages(theme, featured);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at DESC);
