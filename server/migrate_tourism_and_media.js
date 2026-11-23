import { pool } from './db.js'

async function runMigration() {
  console.log('🚀 Running Tourism Dimensions, Media Uploads & Google Rating Migration on PostgreSQL 18...')

  try {
    // 1. Media Assets Registry
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id VARCHAR(64) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(64) NOT NULL,
        size_bytes BIGINT NOT NULL,
        relative_path VARCHAR(500) NOT NULL,
        module VARCHAR(64) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)
    console.log('✅ media_assets table verified.')

    // 2. Destinations Expanded Columns
    await pool.query(`
      ALTER TABLE destinations 
        ADD COLUMN IF NOT EXISTS region VARCHAR(64) DEFAULT 'North India',
        ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6),
        ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6),
        ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
        ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1) DEFAULT 4.9,
        ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER DEFAULT 1250,
        ADD COLUMN IF NOT EXISTS nearest_airport VARCHAR(255),
        ADD COLUMN IF NOT EXISTS nearest_railway VARCHAR(255),
        ADD COLUMN IF NOT EXISTS recommended_stay_days VARCHAR(64) DEFAULT '4 Nights / 5 Days',
        ADD COLUMN IF NOT EXISTS peak_season VARCHAR(128),
        ADD COLUMN IF NOT EXISTS avg_temp VARCHAR(64),
        ADD COLUMN IF NOT EXISTS permit_required BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS permit_details TEXT,
        ADD COLUMN IF NOT EXISTS clothing_advice TEXT,
        ADD COLUMN IF NOT EXISTS cultural_notes TEXT,
        ADD COLUMN IF NOT EXISTS must_try_food JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS key_attractions JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS network_coverage VARCHAR(128) DEFAULT 'Jio, Airtel 5G Available';
    `)
    console.log('✅ destinations table tourism dimensions & Google ratings verified.')

    // 3. Stays Expanded Columns
    await pool.query(`
      ALTER TABLE stays
        ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
        ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1) DEFAULT 4.9,
        ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER DEFAULT 850;
    `)
    console.log('✅ stays table Google ratings verified.')

    // 4. Packages Expanded Columns
    await pool.query(`
      ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
        ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1) DEFAULT 4.9,
        ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER DEFAULT 1200;
    `)
    console.log('✅ packages table Google ratings verified.')

    // 5. Populate some realistic default data for existing destinations if null
    await pool.query(`
      UPDATE destinations SET
        region = COALESCE(region, 'North India'),
        google_rating = COALESCE(google_rating, 4.9),
        google_reviews_count = COALESCE(google_reviews_count, 1420),
        google_maps_url = COALESCE(google_maps_url, 'https://maps.google.com/?q=' || city || '+' || state),
        nearest_airport = CASE 
          WHEN city = 'Udaipur' THEN 'Maharana Pratap Airport (UDR, 22 km)'
          WHEN city = 'Munnar' THEN 'Cochin International Airport (COK, 110 km)'
          WHEN city = 'Hampi' THEN 'Jindal Vijaynagar Airport (VDY, 35 km) or Hubli (145 km)'
          WHEN city = 'Srinagar' THEN 'Sheikh ul-Alam International Airport (SXR, 12 km)'
          WHEN city = 'Gangtok' THEN 'Pakyong Airport (PYG, 30 km) or Bagdogra (IXB, 125 km)'
          WHEN city = 'Jaipur' THEN 'Jaipur International Airport (JAI, 12 km)'
          ELSE 'Major State Domestic Airport'
        END,
        nearest_railway = CASE 
          WHEN city = 'Udaipur' THEN 'Udaipur City Railway Station (UDZ, 3 km)'
          WHEN city = 'Munnar' THEN 'Aluva Railway Station (AWY, 108 km)'
          WHEN city = 'Hampi' THEN 'Hosapete Junction (HPT, 13 km)'
          WHEN city = 'Srinagar' THEN 'Jammu Tawi (JAT, 260 km) & Srinagar Station'
          WHEN city = 'Gangtok' THEN 'New Jalpaiguri Junction (NJP, 120 km)'
          WHEN city = 'Jaipur' THEN 'Jaipur Junction (JP, 4 km)'
          ELSE 'Central District Railway Junction'
        END,
        clothing_advice = CASE 
          WHEN city IN ('Srinagar', 'Gangtok') THEN 'Thermal base layers, heavy down jacket, waterproof boots, woolen gloves and caps.'
          WHEN city IN ('Udaipur', 'Jaipur') THEN 'Breathable cottons for daytime, light jacket for desert evenings; modest shoulders for palaces/temples.'
          WHEN city = 'Munnar' THEN 'Light woolens for misty evenings, comfortable walking shoes for tea plantations, light rainwear.'
          ELSE 'Comfortable casual wear and modest clothing for spiritual sites.'
        END,
        permit_required = CASE WHEN city IN ('Gangtok', 'Srinagar') THEN TRUE ELSE FALSE END,
        permit_details = CASE 
          WHEN city = 'Gangtok' THEN 'Protected Area Permit (PAP) / Restricted Area Permit (RAP) required for Nathula Pass & North Sikkim (arranged by our concierge).'
          WHEN city = 'Srinagar' THEN 'Standard photo ID check; Border permits arranged on arrival for Gurez / forward frontier valleys.'
          ELSE 'No special permit required for Indian & international tourists.'
        END,
        must_try_food = CASE 
          WHEN city IN ('Udaipur', 'Jaipur') THEN '["Dal Baati Churma", "Gatte ki Sabzi", "Laal Maas", "Pyaaz Kachori", "Ghevar"]'::jsonb
          WHEN city = 'Munnar' THEN '["Kerala Parotta with Beef/Veg Roast", "Appam with Ishtu", "Fresh Cardamom Chai", "Karimeen Pollichathu"]'::jsonb
          WHEN city = 'Hampi' THEN '["Banana Flower Curry", "Jowar Roti with Ennegai", "South Indian Filter Coffee", "Woodfired Italian Pizza"]'::jsonb
          WHEN city = 'Srinagar' THEN '["Authentic Wazwan (Rogan Josh, Gustaba)", "Kahwa Tea with Saffron & Almonds", "Modur Pulao", "Nadru Yakhni"]'::jsonb
          WHEN city = 'Gangtok' THEN '["Steamed Momos", "Thukpa & Gyathuk", "Chhurpi Soup", "Gundruk", "Organic Temi Tea"]'::jsonb
          ELSE '["Authentic Regional Thali", "Local Street Specialities"]'::jsonb
        END,
        key_attractions = CASE 
          WHEN city = 'Udaipur' THEN '[{"name": "City Palace Complex", "type": "Heritage"}, {"name": "Sunset Lake Pichola Cruise", "type": "Scenic"}, {"name": "Jag Mandir Island", "type": "Luxury"}, {"name": "Saheliyon-ki-Bari", "type": "Culture"}]'::jsonb
          WHEN city = 'Munnar' THEN '[{"name": "Kolukkumalai Tea Estate", "type": "Nature"}, {"name": "Eravikulam National Park", "type": "Wildlife"}, {"name": "Mattupetty Dam & Lake", "type": "Scenic"}, {"name": "Attukad Waterfalls", "type": "Adventure"}]'::jsonb
          WHEN city = 'Hampi' THEN '[{"name": "Virupaksha Temple", "type": "Spiritual"}, {"name": "Stone Chariot at Vijaya Vittala", "type": "Heritage"}, {"name": "Sunset at Matanga Hill", "type": "Scenic"}, {"name": "Coracle Boat Ride on Tungabhadra", "type": "Adventure"}]'::jsonb
          WHEN city = 'Srinagar' THEN '[{"name": "Private Shikara Ride on Nigeen Lake", "type": "Scenic"}, {"name": "Mughal Gardens (Nishat & Shalimar)", "type": "Heritage"}, {"name": "Old City Copper Bazaar", "type": "Culture"}, {"name": "Dachigam National Park", "type": "Wildlife"}]'::jsonb
          WHEN city = 'Gangtok' THEN '[{"name": "Rumtek Monastery", "type": "Spiritual"}, {"name": "Tsomgo Lake & Baba Mandir", "type": "Scenic"}, {"name": "Nathula Pass Border", "type": "Adventure"}, {"name": "MG Marg Evening Promenade", "type": "Culture"}]'::jsonb
          ELSE '[{"name": "City Heritage Center", "type": "Culture"}]'::jsonb
        END
      WHERE region IS NULL OR nearest_airport IS NULL;
    `)
    console.log('✅ Existing destinations seeded with realistic tourism dimensions & Google ratings.')

    console.log('🎉 PostgreSQL 18 Migration completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  }
}

runMigration()
