-- ============================================================================
-- CRAZY TOURS & TRAVELS — FULLY RELATIONAL PRODUCTION SUPABASE SCHEMA & SEED
-- Database Engine: PostgreSQL 15 / 16 / 17 (Supabase Compatible)
-- Features: Relational Foreign Keys, Cascades, Indexes, and Validated Seed Data
-- ============================================================================

-- 0. CLEAN RESET
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS road_trips CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS stays CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLE DEFINITIONS
CREATE TABLE destinations (
  slug VARCHAR(120) PRIMARY KEY,
  city VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  region VARCHAR(64) DEFAULT 'North India',
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
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  google_maps_url TEXT,
  google_rating NUMERIC(2,1) DEFAULT 4.9,
  google_reviews_count INTEGER DEFAULT 1250,
  nearest_airport VARCHAR(255),
  nearest_railway VARCHAR(255),
  recommended_stay_days VARCHAR(64) DEFAULT '4 Nights / 5 Days',
  peak_season VARCHAR(128),
  avg_temp VARCHAR(64),
  permit_required BOOLEAN DEFAULT FALSE,
  permit_details TEXT,
  clothing_advice TEXT,
  cultural_notes TEXT,
  must_try_food JSONB DEFAULT '[]'::jsonb,
  key_attractions JSONB DEFAULT '[]'::jsonb,
  network_coverage VARCHAR(128) DEFAULT 'Jio, Airtel 5G Available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE packages (
  id VARCHAR(120) PRIMARY KEY,
  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,
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
  google_maps_url TEXT,
  google_rating NUMERIC(2,1) DEFAULT 4.9,
  google_reviews_count INTEGER DEFAULT 1200,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stays (
  id VARCHAR(120) PRIMARY KEY,
  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,
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
  google_maps_url TEXT,
  google_rating NUMERIC(2,1) DEFAULT 4.9,
  google_reviews_count INTEGER DEFAULT 850,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bookings (
  booking_id VARCHAR(60) PRIMARY KEY,
  package_id VARCHAR(120) REFERENCES packages(id) ON UPDATE CASCADE ON DELETE RESTRICT,
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

CREATE TABLE inquiries (
  id VARCHAR(60) PRIMARY KEY,
  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,
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

CREATE TABLE media_assets (
  id VARCHAR(64) PRIMARY KEY,
  destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(64) NOT NULL,
  size_bytes BIGINT NOT NULL,
  relative_path VARCHAR(500) NOT NULL,
  module VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reviews (
  id VARCHAR(120) PRIMARY KEY,
  package_id VARCHAR(120) REFERENCES packages(id) ON UPDATE CASCADE ON DELETE SET NULL,
  quote TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  trip VARCHAR(120) NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar TEXT
);

CREATE TABLE road_trips (
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

CREATE TABLE stories (
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

CREATE TABLE offers (
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

CREATE TABLE hero_slides (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  eyebrow VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  copy TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  action_route VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(120) DEFAULT 'General'
);

-- 3. INDEXES
CREATE INDEX idx_packages_destination ON packages(destination_slug);
CREATE INDEX idx_stays_destination ON stays(destination_slug);
CREATE INDEX idx_bookings_package ON bookings(package_id);
CREATE INDEX idx_inquiries_destination ON inquiries(destination_slug);
CREATE INDEX idx_media_destination ON media_assets(destination_slug);
CREATE INDEX idx_reviews_package ON reviews(package_id);

CREATE INDEX idx_destinations_trending ON destinations(is_trending, display_order);
CREATE INDEX idx_packages_theme ON packages(theme, featured);
CREATE INDEX idx_bookings_status ON bookings(status, submitted_at DESC);
CREATE INDEX idx_inquiries_status ON inquiries(status, created_at DESC);

-- 4. SEED DATA
-- Data for destinations (6 rows)
INSERT INTO destinations (slug, city, country, state, price, price_num, image, season, duration, tagline, description, highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order, created_at, region, latitude, longitude, google_maps_url, google_rating, google_reviews_count, nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp, permit_required, permit_details, clothing_advice, cultural_notes, must_try_food, key_attractions, network_coverage)
VALUES ('udaipur', 'Udaipur', 'Rajasthan', 'Rajasthan', '₹32,500', 32500, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88', 'October to March', '5 days', 'Lake light and living royal history', 'Slow mornings by the water, intimate heritage stays, and the quiet romance of Rajasthan’s white city.', '["Private old-city artisan walk","Sunset boat cruise on Lake Pichola","Haveli lunch & vintage car museum"]'::jsonb, '["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=85","https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=85","https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=85"]'::jsonb, 'September to March (cool breezes and clear skies)', 'Couples, Architecture Lovers & Photography Enthusiasts', TRUE, 1, '2026-11-22T15:56:59.963Z', 'North India', NULL, NULL, 'https://maps.google.com/?q=Udaipur+Rajasthan', '4.9', 1250, 'Maharana Pratap Airport (UDR, 22 km)', 'Udaipur City Railway Station (UDZ, 3 km)', '4 Nights / 5 Days', NULL, NULL, FALSE, 'No special permit required for Indian & international tourists.', 'Breathable cottons for daytime, light jacket for desert evenings; modest shoulders for palaces/temples.', NULL, '["Dal Baati Churma","Gatte ki Sabzi","Laal Maas","Pyaaz Kachori","Ghevar"]'::jsonb, '[{"name":"City Palace Complex","type":"Heritage"},{"name":"Sunset Lake Pichola Cruise","type":"Scenic"},{"name":"Jag Mandir Island","type":"Luxury"},{"name":"Saheliyon-ki-Bari","type":"Culture"}]'::jsonb, 'Jio, Airtel 5G Available')
ON CONFLICT (slug) DO NOTHING;
INSERT INTO destinations (slug, city, country, state, price, price_num, image, season, duration, tagline, description, highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order, created_at, region, latitude, longitude, google_maps_url, google_rating, google_reviews_count, nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp, permit_required, permit_details, clothing_advice, cultural_notes, must_try_food, key_attractions, network_coverage)
VALUES ('munnar', 'Munnar', 'Kerala', 'Kerala', '₹28,900', 28900, 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88', 'September to May', '5 days', 'Tea gardens above the clouds', 'Wake to rolling emerald hills, walk with local naturalists, taste freshly plucked tea, and experience Kerala at its purest.', '["Private tea estate & factory heritage walk","Eravikulam National Park with a naturalist","Supper at a 100-year colonial plantation"]'::jsonb, '["https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=85","https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85","https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85"]'::jsonb, 'August to May (misty mornings, waterfalls in full flow)', 'Honeymooners, Nature Lovers & Slow Travelers', TRUE, 2, '2026-11-22T15:56:59.968Z', 'North India', NULL, NULL, 'https://maps.google.com/?q=Munnar+Kerala', '4.9', 1250, 'Cochin International Airport (COK, 110 km)', 'Aluva Railway Station (AWY, 108 km)', '4 Nights / 5 Days', NULL, NULL, FALSE, 'No special permit required for Indian & international tourists.', 'Light woolens for misty evenings, comfortable walking shoes for tea plantations, light rainwear.', NULL, '["Kerala Parotta with Beef/Veg Roast","Appam with Ishtu","Fresh Cardamom Chai","Karimeen Pollichathu"]'::jsonb, '[{"name":"Kolukkumalai Tea Estate","type":"Nature"},{"name":"Eravikulam National Park","type":"Wildlife"},{"name":"Mattupetty Dam & Lake","type":"Scenic"},{"name":"Attukad Waterfalls","type":"Adventure"}]'::jsonb, 'Jio, Airtel 5G Available')
ON CONFLICT (slug) DO NOTHING;
INSERT INTO destinations (slug, city, country, state, price, price_num, image, season, duration, tagline, description, highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order, created_at, region, latitude, longitude, google_maps_url, google_rating, google_reviews_count, nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp, permit_required, permit_details, clothing_advice, cultural_notes, must_try_food, key_attractions, network_coverage)
VALUES ('hampi', 'Hampi', 'Karnataka', 'Karnataka', '₹24,400', 24400, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=88', 'October to February', '4 days', 'Ruins, boulders and golden twilight', 'Explore the ancient Vijayanagara capital at an unhurried human pace, from riverside temples to sunset atop granite boulder ridges.', '["Expert archaeological heritage storyteller","Traditional coracle river crossing across Tungabhadra","Sunrise viewpoint climb over Matanga Hill"]'::jsonb, '["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=85","https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=85"]'::jsonb, 'October to March (pleasant walking climate)', 'History Buffs, Explorers & Solo Wanderers', TRUE, 3, '2026-11-22T15:56:59.969Z', 'North India', NULL, NULL, 'https://maps.google.com/?q=Hampi+Karnataka', '4.9', 1250, 'Jindal Vijaynagar Airport (VDY, 35 km) or Hubli (145 km)', 'Hosapete Junction (HPT, 13 km)', '4 Nights / 5 Days', NULL, NULL, FALSE, 'No special permit required for Indian & international tourists.', 'Comfortable casual wear and modest clothing for spiritual sites.', NULL, '["Banana Flower Curry","Jowar Roti with Ennegai","South Indian Filter Coffee","Woodfired Italian Pizza"]'::jsonb, '[{"name":"Virupaksha Temple","type":"Spiritual"},{"name":"Stone Chariot at Vijaya Vittala","type":"Heritage"},{"name":"Sunset at Matanga Hill","type":"Scenic"},{"name":"Coracle Boat Ride on Tungabhadra","type":"Adventure"}]'::jsonb, 'Jio, Airtel 5G Available')
ON CONFLICT (slug) DO NOTHING;
INSERT INTO destinations (slug, city, country, state, price, price_num, image, season, duration, tagline, description, highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order, created_at, region, latitude, longitude, google_maps_url, google_rating, google_reviews_count, nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp, permit_required, permit_details, clothing_advice, cultural_notes, must_try_food, key_attractions, network_coverage)
VALUES ('srinagar', 'Srinagar', 'Kashmir', 'Jammu & Kashmir', '₹36,800', 36800, 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88', 'March to October', '6 days', 'A valley bathed in full floral colour', 'Mughal gardens, crisp Himalayan breezes, cedar-wood houseboats and tranquil shikara evenings woven into an unforgettable escape.', '["Cedar boutique houseboat stay on Nigeen Lake","VIP morning access to Tulip Garden","Day journey into Gulmarg alpine meadows"]'::jsonb, '["https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=85","https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85"]'::jsonb, 'March to October (Tulip blooms in spring, apple harvests in autumn)', 'Families, Couples & Mountain Wanderers', TRUE, 4, '2026-11-22T15:56:59.969Z', 'North India', NULL, NULL, 'https://maps.google.com/?q=Srinagar+Jammu & Kashmir', '4.9', 1250, 'Sheikh ul-Alam International Airport (SXR, 12 km)', 'Jammu Tawi (JAT, 260 km) & Srinagar Station', '4 Nights / 5 Days', NULL, NULL, TRUE, 'Standard photo ID check; Border permits arranged on arrival for Gurez / forward frontier valleys.', 'Thermal base layers, heavy down jacket, waterproof boots, woolen gloves and caps.', NULL, '["Authentic Wazwan (Rogan Josh, Gustaba)","Kahwa Tea with Saffron & Almonds","Modur Pulao","Nadru Yakhni"]'::jsonb, '[{"name":"Private Shikara Ride on Nigeen Lake","type":"Scenic"},{"name":"Mughal Gardens (Nishat & Shalimar)","type":"Heritage"},{"name":"Old City Copper Bazaar","type":"Culture"},{"name":"Dachigam National Park","type":"Wildlife"}]'::jsonb, 'Jio, Airtel 5G Available')
ON CONFLICT (slug) DO NOTHING;
INSERT INTO destinations (slug, city, country, state, price, price_num, image, season, duration, tagline, description, highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order, created_at, region, latitude, longitude, google_maps_url, google_rating, google_reviews_count, nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp, permit_required, permit_details, clothing_advice, cultural_notes, must_try_food, key_attractions, network_coverage)
VALUES ('gangtok', 'Gangtok', 'Sikkim', 'Sikkim', '₹31,500', 31500, 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=88', 'March to June', '6 days', 'Monasteries beneath snowy Himalayan peaks', 'A mindful Himalayan haven of winding pine forest roads, chanting monasteries, organic tea valleys, and welcoming local kitchens.', '["Exclusive Rumtek & Enchey monastery morning trail","Glacial excursion to turquoise Tsomgo Lake","Homestyle Sikkimese lunch in a rural farmhouse"]'::jsonb, '["https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=800&q=85","https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=85"]'::jsonb, 'March to June & October to December', 'Culture Seekers, Trekkers & Spiritual Travellers', TRUE, 5, '2026-11-22T15:56:59.970Z', 'North India', NULL, NULL, 'https://maps.google.com/?q=Gangtok+Sikkim', '4.9', 1250, 'Pakyong Airport (PYG, 30 km) or Bagdogra (IXB, 125 km)', 'New Jalpaiguri Junction (NJP, 120 km)', '4 Nights / 5 Days', NULL, NULL, TRUE, 'Protected Area Permit (PAP) / Restricted Area Permit (RAP) required for Nathula Pass & North Sikkim (arranged by our concierge).', 'Thermal base layers, heavy down jacket, waterproof boots, woolen gloves and caps.', NULL, '["Steamed Momos","Thukpa & Gyathuk","Chhurpi Soup","Gundruk","Organic Temi Tea"]'::jsonb, '[{"name":"Rumtek Monastery","type":"Spiritual"},{"name":"Tsomgo Lake & Baba Mandir","type":"Scenic"},{"name":"Nathula Pass Border","type":"Adventure"},{"name":"MG Marg Evening Promenade","type":"Culture"}]'::jsonb, 'Jio, Airtel 5G Available')
ON CONFLICT (slug) DO NOTHING;
INSERT INTO destinations (slug, city, country, state, price, price_num, image, season, duration, tagline, description, highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order, created_at, region, latitude, longitude, google_maps_url, google_rating, google_reviews_count, nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp, permit_required, permit_details, clothing_advice, cultural_notes, must_try_food, key_attractions, network_coverage)
VALUES ('andaman', 'Andaman', 'Bay of Bengal', 'Andaman & Nicobar Islands', '₹42,000', 42000, 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88', 'October to May', '6 days', 'Turquoise island lagoons and pristine coral atolls', 'Glass-clear warm ocean waters, virgin rainforest fringes, bioluminescent night kayak trips, and unhurried luxury barefoot living.', '["Guided coral reef snorkelling in Havelock","Radhanagar beach sunset picnic setup","Baratang mangrove boat safari"]'::jsonb, '["https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=85"]'::jsonb, 'October to May (calm sea conditions and high visibility)', 'Beach Enthusiasts, Scuba Divers & Honeymoon Couples', TRUE, 6, '2026-11-22T15:56:59.971Z', 'North India', NULL, NULL, 'https://maps.google.com/?q=Andaman+Andaman & Nicobar Islands', '4.9', 1250, 'Major State Domestic Airport', 'Central District Railway Junction', '4 Nights / 5 Days', NULL, NULL, FALSE, 'No special permit required for Indian & international tourists.', 'Comfortable casual wear and modest clothing for spiritual sites.', NULL, '["Authentic Regional Thali","Local Street Specialities"]'::jsonb, '[{"name":"City Heritage Center","type":"Culture"}]'::jsonb, 'Jio, Airtel 5G Available')
ON CONFLICT (slug) DO NOTHING;

-- Data for packages (5 rows)
INSERT INTO packages (id, slug, title, place, state, duration, days_count, price, price_num, original_price, discount, rating, review_count, image, gallery, overview, highlights, inclusions, exclusions, itinerary, theme, featured, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('kerala-backwaters', 'kerala-backwaters', 'Tea Trails, Mist & Backwater Serenity', 'Kerala', 'Kerala', '7 Days / 6 Nights', 7, '₹42,900', 42900, '₹51,000', '15% OFF', '4.95', 34, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=88', '[]'::jsonb, 'From misty high-altitude tea plantations in Munnar to peaceful canals on a private luxury houseboat.', '["Private plantation bungalow stay in Munnar","Overnight cruise on Alleppey backwaters","Ayurvedic wellness rejuvenation treatment"]'::jsonb, '["6 Nights Accommodation","Daily Gourmet Breakfast & Chef house meals","Private Air-Conditioned SUV throughout","Houseboat full-board stay"]'::jsonb, '["Airfare to Kochi","Alcoholic beverages","Personal expenses"]'::jsonb, '[{"day":1,"title":"Arrival in Kochi","description":"Fort Kochi heritage walk and Kathakali performance."},{"day":2,"title":"Ascent to Munnar Hills","description":"Drive through rubber and cardamom plantations."},{"day":3,"title":"Tea Estate Trail & National Park","description":"Tea factory museum and Nilgiri Tahr safari."},{"day":4,"title":"Thekkady Periyar Wildlife Sanctuary","description":"Spice garden walk and evening lake boat safari."},{"day":5,"title":"Boarding the Alleppey Houseboat","description":"Private kettuvalam houseboat with chef prepared Karimeen."},{"day":6,"title":"Marari Beach Relaxation","description":"Boutique coconut grove beachfront hideaway."},{"day":7,"title":"Departure from Kochi","description":"Souvenir shopping and airport transfer."}]'::jsonb, 'Family', TRUE, '2026-11-22T15:56:59.975Z', NULL, '4.9', 1200, 'munnar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO packages (id, slug, title, place, state, duration, days_count, price, price_num, original_price, discount, rating, review_count, image, gallery, overview, highlights, inclusions, exclusions, itinerary, theme, featured, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('andaman-paradise', 'andaman-paradise', 'Azure Waters & Coral Reefs', 'Andaman Islands', 'Andaman & Nicobar', '6 Days / 5 Nights', 6, '₹42,000', 42000, '₹49,000', '14% OFF', '4.88', 19, 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88', '[]'::jsonb, 'Pristine white sand beaches, bioluminescent night kayaking, and world-class scuba diving.', '["Radhanagar Beach rated Asia’s best","Elephant Beach guided snorkelling session","Luxury beachfront eco-villa in Havelock"]'::jsonb, '["5 Nights Beach Villa Accommodation","Daily Buffet Breakfast","High-Speed Catamaran Ferry Tickets","Airport & Jetty Pickups"]'::jsonb, '["Flights to Port Blair","Scuba diving certification courses","Water sports insurance"]'::jsonb, '[{"day":1,"title":"Arrival in Port Blair & Cellular Jail","description":"Historical light and sound show."},{"day":2,"title":"High-Speed Ferry to Havelock Island","description":"Check-in to luxury beachfront villa."},{"day":3,"title":"Radhanagar Sunset & Elephant Beach","description":"Snorkelling over live coral gardens."},{"day":4,"title":"Neil Island Tranquility","description":"Natural bridge rock formations and Bharatpur beach."},{"day":5,"title":"Return to Port Blair & Chidiya Tapu","description":"Sunset bird-watching point."},{"day":6,"title":"Departure","description":"Morning breakfast and flight back home."}]'::jsonb, 'Adventure', TRUE, '2026-11-22T15:56:59.977Z', NULL, '4.9', 1200, 'andaman')
ON CONFLICT (id) DO NOTHING;
INSERT INTO packages (id, slug, title, place, state, duration, days_count, price, price_num, original_price, discount, rating, review_count, image, gallery, overview, highlights, inclusions, exclusions, itinerary, theme, featured, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('kashmir-tulips', 'kashmir-tulips', 'Tulips, Houseboats & High Meadows', 'Kashmir', 'Jammu & Kashmir', '6 Days / 5 Nights', 6, '₹36,800', 36800, '₹44,000', '16% OFF', '4.90', 28, 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88', '[]'::jsonb, 'Experience the magic of spring as millions of tulips bloom against the snow-capped Zabarwan range.', '["Private cedar houseboat stay on Nigeen Lake","VIP morning entry to Asia’s largest Tulip Garden","Day trip to Gulmarg with Phase-1 Gondola tickets"]'::jsonb, '["5 Nights Premium Accommodation","Daily Breakfast & 4-Course Dinner","All Sightseeing via Private Innova Crysta","1-Hour Sunset Shikara Ride"]'::jsonb, '["Airfare to/from Srinagar","Phase-2 Gondola / Pony rides","Personal tips"]'::jsonb, '[{"day":1,"title":"Arrival in Srinagar & Nigeen Lake Houseboat","description":"Warm Kashmiri welcome with spiced Kehwa."},{"day":2,"title":"Tulip Garden & Mughal Terraces","description":"Wander amidst 1.5 million tulips at the Indira Gandhi Memorial Garden."},{"day":3,"title":"Alpine Splendour of Gulmarg","description":"Scenic drive to Gulmarg with panoramic views of Mount Apharwat."},{"day":4,"title":"Pahalgam Valley of Shepherds","description":"Drive along the saffron fields of Pampore to the pristine Lidder river."},{"day":5,"title":"Old City Artisans & Saffron Trail","description":"Private heritage walk visiting walnut carvers and Pashmina weavers."},{"day":6,"title":"Farewell Kashmir","description":"Morning lakeside breakfast and private transfer to Srinagar airport."}]'::jsonb, 'Honeymoon', TRUE, '2026-11-22T15:56:59.972Z', NULL, '4.9', 1200, 'srinagar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO packages (id, slug, title, place, state, duration, days_count, price, price_num, original_price, discount, rating, review_count, image, gallery, overview, highlights, inclusions, exclusions, itinerary, theme, featured, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('rajasthan-royals', 'rajasthan-royals', 'Palaces, Dunes & Desert Stars', 'Rajasthan', 'Rajasthan', '8 Days / 7 Nights', 8, '₹48,500', 48500, '₹58,000', '16% OFF', '4.90', 42, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88', '[]'::jsonb, 'Live like royalty through the grand forts of Jaipur, blue alleyways of Jodhpur, and golden lakes of Udaipur.', '["Curated boutique haveli stays","Private sunset desert camel safari in Sam dunes","Lake Pichola royal cruise in Udaipur"]'::jsonb, '["7 Nights Heritage Stay","Breakfast & Royal Welcome Dinners","All Transfers via Luxury SUV","All Monument Entry Tickets"]'::jsonb, '["Domestic flights","Camera fees at monuments","Tips"]'::jsonb, '[{"day":1,"title":"Royal Welcome in Jaipur","description":"Check in to a restored 18th-century heritage haveli."},{"day":2,"title":"Amer Fort & City Palace","description":"Elephant-view drive, Sheesh Mahal and Hawa Mahal."},{"day":3,"title":"Blue City of Jodhpur","description":"Mehrangarh Fort and sunset view from stepwell terrace."},{"day":4,"title":"Thar Desert Glamping in Jaisalmer","description":"Luxury tents under the desert starlight."},{"day":5,"title":"Golden City Exploration","description":"Living fort architecture and intricate Jain temples."},{"day":6,"title":"Drive to Lake City Udaipur","description":"Visit Ranakpur marble temples en route."},{"day":7,"title":"Lake Pichola & Jagmandir Island","description":"Private boat excursion and sunset dinner."},{"day":8,"title":"Farewell Rajasthan","description":"Morning stroll around Saheliyon-ki-Bari and departure."}]'::jsonb, 'Heritage', TRUE, '2026-11-22T15:56:59.976Z', NULL, '4.9', 1200, 'udaipur')
ON CONFLICT (id) DO NOTHING;
INSERT INTO packages (id, slug, title, place, state, duration, days_count, price, price_num, original_price, discount, rating, review_count, image, gallery, overview, highlights, inclusions, exclusions, itinerary, theme, featured, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('sikkim-himalaya', 'sikkim-himalaya', 'Himalayan Monasteries & Glacial Lakes', 'Sikkim & Darjeeling', 'Sikkim', '6 Days / 5 Nights', 6, '₹31,500', 31500, '₹37,000', '15% OFF', '4.85', 22, 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=88', '[]'::jsonb, 'Panoramic views of Mount Kanchenjunga, ancient Buddhist monasteries, and high-altitude glacial lakes.', '["Sunrise over Kanchenjunga from Tiger Hill","Excursion to turquoise Tsomgo Lake at 12,310 ft","Private monastery blessing session in Rumtek"]'::jsonb, '["5 Nights Deluxe Stay","Daily Breakfast & Dinner","Private 4x4 SUV with Mountain Driver","All Permits & Entry Passes"]'::jsonb, '["Toy train joyride tickets","Personal laundry & phone calls","Tips"]'::jsonb, '[{"day":1,"title":"Arrival in Bagdogra & Drive to Gangtok","description":"Scenic drive along Teesta river."},{"day":2,"title":"Tsomgo Lake & Baba Mandir","description":"High mountain pass near Indo-China border."},{"day":3,"title":"Rumtek Monastery & Flower Show","description":"Tibetan spiritual traditions and Himalayan fauna."},{"day":4,"title":"Scenic Drive to Darjeeling","description":"Through fragrant pine and tea estates."},{"day":5,"title":"Tiger Hill Sunrise & Tea Gardens","description":"Golden dawn illumination on Kanchenjunga."},{"day":6,"title":"Farewell Hills","description":"Transfer to Bagdogra airport for return journey."}]'::jsonb, 'Scenic', TRUE, '2026-11-22T15:56:59.978Z', NULL, '4.9', 1200, 'gangtok')
ON CONFLICT (id) DO NOTHING;

-- Data for stays (8 rows)
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('taj-lake-palace', 'Udaipur', 'Rajasthan', 'Heritage Palace', 'Taj Lake Palace, Lake Pichola', '₹48,000', 48000, '4.95', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=88', '["Private Boat Transfers","Butler Service","Royal Spa","Lakefront Dining"]'::jsonb, 'Floating on the peaceful waters of Lake Pichola, an 18th-century marble marvel of majestic Rajput architecture.', '2026-11-22T15:56:59.990Z', NULL, '4.9', 850, 'udaipur')
ON CONFLICT (id) DO NOTHING;
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('munnar-tea-bungalow', 'Munnar', 'Kerala', 'Tea Plantation Estate', 'Windermere Estate Hilltop Retreat', '₹18,500', 18500, '4.88', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88', '["Private Plantation Walks","Fireside Dining","Bird Watching Trails","Organic Orchard"]'::jsonb, 'Perched high in the Western Ghats surrounded by tea gardens and cardamom trees.', '2026-11-22T15:56:59.993Z', NULL, '4.9', 850, 'munnar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('kashmir-cedar-houseboat', 'Srinagar', 'Jammu & Kashmir', 'Luxury Cedar Houseboat', 'Sukoon Luxury Houseboat, Nigeen Lake', '₹22,000', 22000, '4.92', 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88', '["Sun Deck with Zabarwan Views","Traditional Wazwan Cuisine","Private Shikara","Wood Fire Heating"]'::jsonb, 'Handcrafted fragrant cedar-wood houseboat offering serenity on the quiet waters of Nigeen Lake.', '2026-11-22T15:56:59.994Z', NULL, '4.9', 850, 'srinagar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('stay-jaipur', 'Jaipur', 'Rajasthan', 'Heritage Stays', 'Alsisar Haveli & Royal Courtyards', '₹9,800', 9800, '4.90', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88', '["Heritage Architecture","Swimming Pool","Courtyard Dining","Spa & Wellness","Free Wi-Fi"]'::jsonb, 'A restored 18th-century Rajput mansion with frescoed ceilings, peaceful interior courtyards, and warm aristocratic hospitality.', '2026-11-22T16:03:01.241Z', NULL, '4.9', 850, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('stay-goa', 'Goa', 'Goa', 'Beach Retreats', 'Ahilya by the Sea, Dolphin Bay', '₹14,500', 14500, '4.90', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=88', '["Direct Sea View","Infinity Pools","Private Beach Access","Chef’s Table","Lush Tropical Gardens"]'::jsonb, 'An intimate boutique escape perched right on the bay where dolphins play at dawn, blending Portuguese coastal charm with slow luxury.', '2026-11-22T16:03:01.243Z', NULL, '4.9', 850, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('stay-srinagar', 'Srinagar', 'Jammu & Kashmir', 'Houseboat Stays', 'Mascot Cedar Luxury Houseboat', '₹8,200', 8200, '4.80', 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88', '["Hand-carved Cedar Wood","Private Veranda","Dedicated Cook & Butler","Shikara Pickup","Fireplace"]'::jsonb, 'Floating heritage moored on quiet Nigeen Lake, offering warm Kashmiri hospitality, home-cooked Wazwan meals, and tranquil mornings.', '2026-11-22T16:03:01.243Z', NULL, '4.9', 850, 'srinagar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('stay-munnar', 'Munnar', 'Kerala', 'Plantation Retreats', 'Windermere Colonial Estate', '₹11,000', 11000, '4.90', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88', '["60-Acre Coffee & Tea Estate","Valley Mist Balconies","Naturalist Trails","Fireplace Lounge","Organic Farm Dining"]'::jsonb, 'A serene mountain sanctuary situated high up among cardamom and tea hills, where the clouds drift across your room window.', '2026-11-22T16:03:01.244Z', NULL, '4.9', 850, 'munnar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description, created_at, google_maps_url, google_rating, google_reviews_count, destination_slug)
VALUES ('stay-udaipur', 'Udaipur', 'Rajasthan', 'Palace Stays', 'Fateh Garh Heritage Sanctuary', '₹12,400', 12400, '4.80', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88', '["Rooftop Infinity Pool","Vintage Car Museum","Lake Pichola Panoramic Vistas","Heritage Spa"]'::jsonb, 'Perched on a ridge overlooking the entire Udaipur basin, Fateh Garh was rebuilt stone by stone using eco-conservation principles.', '2026-11-22T16:03:01.244Z', NULL, '4.9', 850, 'udaipur')
ON CONFLICT (id) DO NOTHING;

-- Data for bookings (4 rows)
INSERT INTO bookings (booking_id, package_name, travel_date, adults, children, hotel_type, customer_name, customer_email, customer_phone, special_requests, total_price, status, payment_status, submitted_at, package_id)
VALUES ('CT-849201', 'Tulips, Houseboats & High Meadows', '2026-04-12', 2, 0, 'Luxury 5-Star', 'Aditya & Priya Sharma', 'aditya.sharma@example.com', '+91 98201 44521', 'Nigeen Lake Cedar houseboat balcony facing sunrise, anniversary champagne setup.', 88320, 'Confirmed', 'Fully Paid', '2026-11-22T15:56:59.980Z', 'kashmir-tulips')
ON CONFLICT (booking_id) DO NOTHING;
INSERT INTO bookings (booking_id, package_name, travel_date, adults, children, hotel_type, customer_name, customer_email, customer_phone, special_requests, total_price, status, payment_status, submitted_at, package_id)
VALUES ('CT-773194', 'Palaces, Dunes & Desert Stars', '2026-03-05', 4, 2, 'Deluxe', 'Vikramaditya Rathore', 'rathore.v@example.com', '+91 94140 88290', 'Private vintage car transfer from Udaipur airport, inter-connecting haveli suites.', 156000, 'Voucher Issued', 'Fully Paid', '2026-11-22T15:56:59.984Z', 'rajasthan-royals')
ON CONFLICT (booking_id) DO NOTHING;
INSERT INTO bookings (booking_id, package_name, travel_date, adults, children, hotel_type, customer_name, customer_email, customer_phone, special_requests, total_price, status, payment_status, submitted_at, package_id)
VALUES ('CT-621809', 'Tea Trails, Mist & Backwater Serenity', '2026-05-18', 2, 1, 'Standard', 'Deepak & Sneha Kulkarni', 'deepak.kulkarni@example.com', '+91 98902 11983', 'Ground floor cottage, organic vegan Kerala meal requests on day 3.', 66470, 'Pending', 'Deposit Paid', '2026-11-22T15:56:59.984Z', 'kerala-backwaters')
ON CONFLICT (booking_id) DO NOTHING;
INSERT INTO bookings (booking_id, package_name, travel_date, adults, children, hotel_type, customer_name, customer_email, customer_phone, special_requests, total_price, status, payment_status, submitted_at, package_id)
VALUES ('CT-550182', 'Azure Waters & Coral Reefs', '2026-02-14', 2, 0, 'Luxury 5-Star', 'Rohan Mehra & Tanya Sen', 'tanya.sen@example.com', '+91 97110 33901', 'Candlelight dinner on Radhanagar beach, scuba diving briefing in Havelock.', 100800, 'Confirmed', 'Fully Paid', '2026-11-22T15:56:59.985Z', 'rajasthan-royals')
ON CONFLICT (booking_id) DO NOTHING;

-- Data for inquiries (3 rows)
INSERT INTO inquiries (id, full_name, email, phone, preferred_destination, travel_month, travelers_count, budget_per_person, trip_type, notes, status, assigned_agent, created_at, destination_slug)
VALUES ('INQ-9012', 'Dr. Siddharth Varma', 'siddharth.v@gmail.com', '+91 98450 12890', 'Kashmir & Ladakh High Passes', 'June 2026', 'Family of 4', '₹60,000 - ₹80,000', 'Family Vacation', 'Looking for high-comfort private SUV transport with oxygen backup for elderly parents.', 'New', 'Kavita Iyer (Senior Specialist)', '2026-11-22T15:56:59.985Z', 'srinagar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO inquiries (id, full_name, email, phone, preferred_destination, travel_month, travelers_count, budget_per_person, trip_type, notes, status, assigned_agent, created_at, destination_slug)
VALUES ('INQ-8841', 'Ananya & Kabir Roy', 'ananya.roy@deloitte.com', '+91 99302 77102', 'Udaipur & Jodhpur Luxury Havelis', 'October 2026', 'Couple (Honeymoon)', '₹1,00,000+', 'Honeymoon', 'Require private palace terrace dinners and heritage photographer for 1 half-day.', 'Quoted', 'Rahul Deshmukh (Heritage Lead)', '2026-11-22T15:56:59.989Z', 'udaipur')
ON CONFLICT (id) DO NOTHING;
INSERT INTO inquiries (id, full_name, email, phone, preferred_destination, travel_month, travelers_count, budget_per_person, trip_type, notes, status, assigned_agent, created_at, destination_slug)
VALUES ('INQ-7630', 'Aarav Singhania', 'aarav.singhania@corp.in', '+91 98100 44928', 'Andaman Scuba & Private Yacht', 'December 2026', 'Group of 6', '₹75,000 - ₹1,00,000', 'Adventure Group', 'All travelers are certified PADI divers. Looking for deep reef excursions.', 'Contacted', 'Sameer Sen (Coastal Specialist)', '2026-11-22T15:56:59.989Z', 'andaman')
ON CONFLICT (id) DO NOTHING;

-- Data for reviews (3 rows)
INSERT INTO reviews (id, quote, name, trip, rating, avatar, package_id)
VALUES ('rev-1', 'Our Kashmir journey with Crazy Tours Travels felt completely personal. The quiet houseboat on Nigeen Lake and family orchard lunch were moments we would never have found ourselves.', 'Anika & Rohan Sengupta', 'Kashmir Spring Tour, April 2025', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'kashmir-tulips')
ON CONFLICT (id) DO NOTHING;
INSERT INTO reviews (id, quote, name, trip, rating, avatar, package_id)
VALUES ('rev-2', 'Everything was calm, considered, and impeccably organized—from the first planning call with their travel designer to our drive through Kerala’s tea country. 24/7 on-trip support was outstanding.', 'Meera & Rajesh Shah', 'Kerala Backwaters & Tea Trails, June 2025', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 'kerala-backwaters')
ON CONFLICT (id) DO NOTHING;
INSERT INTO reviews (id, quote, name, trip, rating, avatar, package_id)
VALUES ('rev-3', 'The Rajasthan road trip balanced royal haveli stays with true local discoveries. Even our teenagers said it was the best vacation our family has ever taken. Crazy Tours Travels is now our go-to!', 'The Iyer Family', 'Royal Rajasthan Circuit, January 2026', 5, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 'rajasthan-royals')
ON CONFLICT (id) DO NOTHING;

-- Data for road_trips (3 rows)
INSERT INTO road_trips (id, name, route, days, distance, difficulty, image, highlights, description, stops)
VALUES ('konkan-coast', 'The Konkan Coastal Highway', 'Mumbai to Goa via Alibaug, Ganpatipule & Malvan', '6 Days', '580 km', 'Easy', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=88', '["Vehicle ferry across Dharamtar Creek","Uncrowded white sand beaches of Guhagar & Ganpatipule","Authentic Malvani seafood dining & sea fort walks"]'::jsonb, 'A dream coastal road trip with the Arabian Sea by your side, crossing estuaries by vehicle ferry, coconut groves, and sea forts.', '["Mumbai","Alibaug","Murud Janjira","Ganpatipule","Tarkarli / Malvan","North Goa"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO road_trips (id, name, route, days, distance, difficulty, image, highlights, description, stops)
VALUES ('high-roads-ladakh', 'High Roads of Ladakh', 'Manali to Leh via Atal Tunnel, Jispa & Baralacha La', '9 Days', '490 km (High Altitude)', 'Challenging', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=88', '["Traverse high mountain passes over 16,500 ft","Camp by the sapphire blue waters of Pangong Tso","World’s highest motorable roads at Khardung La"]'::jsonb, 'The crown jewel of Indian road expeditions. From green Kullu valley through deep rock canyons, moonscapes, and high-altitude Buddhist gompas.', '["Manali","Jispa","Sarchu","Leh","Nubra Valley","Pangong Lake","Leh"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO road_trips (id, name, route, days, distance, difficulty, image, highlights, description, stops)
VALUES ('tea-country-trails', 'Nilgiri & Western Ghats Trail', 'Kochi to Munnar, Valparai & Ooty', '5 Days', '380 km', 'Moderate', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88', '["40 hairpin bends with views over Anamalai Tiger Reserve","Cool cloud-covered rainforest tracks and waterfalls","Heritage British bungalows and fresh high-grown Nilgiri tea"]'::jsonb, 'Climb from coastal coconut lowlands into pine forests and emerald carpeted hills with crisp mountain air.', '["Kochi","Thattekad Bird Haven","Munnar","Valparai","Pollachi","Ooty"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Data for stories (3 rows)
INSERT INTO stories (id, title, category, author, date, read_time, image, snippet, content)
VALUES ('story-kashmir-spring', 'A Houseboat Morning on Nigeen Lake', 'Slow Travel', 'Aamir Mir & Priya Sharma', 'April 2026', '6 min read', 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88', 'Long before the first shikara ripples the mirror water, the smell of woodsmoke and saffron tea drifts across the cedar deck.', '["In Kashmir, spring arrives not with a calendar date, but with a sudden, quiet shift in the mountain air. On Nigeen Lake, tucked away from the busier waters of Dal, dawn breaks with an ethereal stillness.","Our houseboat, handcrafted from aromatic Himalayan deodar cedar over six decades ago, creaks gently against its mooring rope. Nazir, our host whose grandfather originally laid the vessel’s cedar keel, brings out steaming brass cups of Kahwa.","By 7:30 AM, our shikara glides silently into the blooming tulip fields at Siraj Bagh. Walking through red, yellow, and pastel purple ribbons beneath the Zabarwan range, you realize that true luxury in Kashmir is simply having time to pause."]'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO stories (id, title, category, author, date, read_time, image, snippet, content)
VALUES ('story-kerala-tea', 'What the Cardamom Hills Taught Us About Time', 'Field Notes', 'Devika Menon', 'February 2026', '5 min read', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88', 'High in the Western Ghats, life is measured not in hours, but in the arrival of the afternoon mist.', '["We left the humid plains of Cochin behind at dawn. By midday, as the road curled upwards past spice gardens and banana trees, the temperature dropped ten degrees.","At Windermere Estate, there are no televisions and no blaring alarms. Instead, naturalists guide you along trails through pepper vines, coffee bushes, and tea shrubs.","In the evening, over a home-style supper of appams and coconut stew, the local planter told us stories of early tea pioneers who walked these hills with compass and walking stick."]'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO stories (id, title, category, author, date, read_time, image, snippet, content)
VALUES ('story-rajasthan-road', 'Across the Thar: A Sandstone Diary', 'Road Journals', 'Rohan Mehra', 'January 2026', '7 min read', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88', 'Driving through Rajasthan reveals that the desert is never empty—it is full of songs, textiles, and courtyards that outlast empires.', '["There is a particular hour on the Jodhpur-Jaisalmer highway when the landscape turns from scrubland to shimmering gold.","Stopping at a roadside dhabha for hot ginger chai and bajre ki roti, we watched a herd of chinkara deer leap across the horizon. At Sam Sand Dunes, the night air was biting cold, but the bonfire and soulful Manganiyar melodies made the Thar feel like the center of the universe."]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Data for offers (3 rows)
INSERT INTO offers (id, code, title, discount_text, tag, valid_till, description, min_booking, image)
VALUES ('offer-early-summer', 'CRAZY15', 'Early Bird Summer Holiday Offer', 'Flat 15% OFF', 'Limited Seats', 'Valid until 30th April 2026', 'Book your summer getaway to Kashmir, Ladakh, or Himachal 45 days in advance and enjoy guaranteed luxury room upgrades.', 'Min. booking ₹50,000', 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88')
ON CONFLICT (id) DO NOTHING;
INSERT INTO offers (id, code, title, discount_text, tag, valid_till, description, min_booking, image)
VALUES ('offer-honeymoon-perks', 'ROMANCE', 'Honeymoon Special Inclusions', 'Complimentary Perks', 'Couples Only', 'Year-Round', 'Enjoy free candle-lit dinner, flower bed decoration, private shikara ride, and couple spa credits on all Kerala and Kashmir honeymoon packages.', 'Applicable on 5+ days trips', 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88')
ON CONFLICT (id) DO NOTHING;
INSERT INTO offers (id, code, title, discount_text, tag, valid_till, description, min_booking, image)
VALUES ('offer-family-escape', 'FAMILYFUN', 'Family Explorer Discount', 'Free Child Package', 'Best for Families', 'Valid till 31st May 2026', 'Children under 10 travel free (hotel stay & meals) on all Andaman, Rajasthan, and Golden Triangle family group bookings.', 'Min. 2 paying adults', 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88')
ON CONFLICT (id) DO NOTHING;

-- Data for hero_slides (3 rows)
INSERT INTO hero_slides (id, image, eyebrow, title, copy, location, action_route, display_order)
VALUES (1, 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1800&q=88', 'Spring in the valley', 'See India with new eyes.', 'Thoughtfully planned journeys across the places we call home. Handcrafted departures, verified heritage stays, and local hosts.', 'Tulip season in Kashmir', 'destination/srinagar', 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO hero_slides (id, image, eyebrow, title, copy, location, action_route, display_order)
VALUES (2, 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1800&q=88', 'Mist over the tea gardens', 'Find a slower rhythm in Kerala.', 'Hill-country walks, spice-scented kitchens, boutique plantation hideaways and quiet backwater mornings.', 'Monsoon light in Munnar', 'destination/munnar', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO hero_slides (id, image, eyebrow, title, copy, location, action_route, display_order)
VALUES (3, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1800&q=88', 'Stories written in sandstone', 'Royal Rajasthan, beautifully unhurried.', 'Courtyard havelis, desert drives, private stepwell dining and evenings under an endless canopy of stars.', 'Old-city mornings in Jaipur & Udaipur', 'destination/udaipur', 3)
ON CONFLICT (id) DO NOTHING;

-- Data for faqs (4 rows)
INSERT INTO faqs (id, question, answer, category)
VALUES (1, 'What makes Crazy Tours Travels different from regular booking websites?', 'We do not sell cookie-cutter packages. Every journey is curated by travel designers who have personally visited the destinations, stayed in the properties, and verified local drivers and guides. You get human travel design with transparent pricing and 24/7 on-trip concierge assistance.', 'About Us')
ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (id, question, answer, category)
VALUES (2, 'Can I customise any tour package on the website?', 'Yes, 100%! All our itineraries are flexible starting points. You can add days, upgrade hotels to 5-star heritage properties, swap experiences, or request custom private transport. Click "Plan This Journey" or use our Custom Trip Builder.', 'Customization')
ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (id, question, answer, category)
VALUES (3, 'How do bookings and payments work?', 'Once you choose or customize your journey, our travel designer confirms availability. You confirm with a standard 25% deposit via secure payment link (Credit Card, Net Banking, UPI, EMI). The remaining balance is payable prior to departure.', 'Booking & Payment')
ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (id, question, answer, category)
VALUES (4, 'What is your cancellation and refund policy?', 'We offer traveler-friendly policies: cancellations made 30+ days before travel receive a full refund minus minimal non-refundable hotel/airline retainers. In case of unexpected weather or flight disruptions, our 24/7 team arranges seamless rescheduling.', 'Policies')
ON CONFLICT (id) DO NOTHING;

