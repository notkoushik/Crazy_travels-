import { pool } from './db.js'

const specials = [
  [1, 'ROMANTIC ESCAPES', 'Romantic Escapes', 'Handpicked destinations for two.', 12999, '/catalog-photos/groups/couple.jpg', 'Romantic / Honeymoon', 'Customize Romantic Trip'],
  [2, 'FAMILY HOLIDAYS', 'Family Holidays', 'Comfort and memories for every age.', 11999, '/catalog-photos/groups/Family_2.jpg', 'Family with Kids', 'Customize Family Trip'],
  [3, "BACHELORS' TRIPS", 'Bachelors’ Trips', 'Scenic escapes for friends.', 6999, '/catalog-photos/groups/Friends_3.jpg', 'Friends & Bachelors Group', 'Customize Group Trip'],
  [4, 'ADVENTURE PICKS', 'Adventure Picks', 'Thrilling destinations and high passes.', 9999, '/catalog-photos/tsomgo-lake.jpg', 'Adventure & Mountain Trails', 'Customize Adventure Trip'],
]

const headers = [
  ['hero', 'Travel with a local touch', 'Crazy Tours Travel', 'Handcrafted journeys across India and beyond'],
  ['hero_video', '/Video/optimized/destination_kedarnath.mp4', '/Video/optimized/destination_kedarnath_poster.jpg', 'Kedarnath Temple & Snow Peaks (16:9 HD)'],
  ['customization', 'CURATED CUSTOMIZATION', 'We offer customization', 'Crazy Tours offers curated, tailor-made journeys for couples, families, friends, and adventure seekers.'],
  ['packages', 'Handcrafted itineraries', 'Holiday packages', ''],
  ['recommended', 'Top picks', 'Recommended packages', ''],
]

async function run() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const [slot, badge, title, desc, price, img, route, label] of specials) {
      await client.query(
        'UPDATE homepage_specials SET badge=$1, title=$2, description=$3, price_num=$4, image=$5, action_route=$6, action_label=$7, updated_at=NOW() WHERE slot_index=$8',
        [badge, title, desc, price, img, route, label, slot]
      )
    }
    for (const [key, kicker, title, subtitle] of headers) {
      await client.query(
        'INSERT INTO homepage_section_headers (section_key, kicker, title, subtitle, updated_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (section_key) DO UPDATE SET kicker=EXCLUDED.kicker, title=EXCLUDED.title, subtitle=EXCLUDED.subtitle, updated_at=NOW()',
        [key, kicker, title, subtitle]
      )
    }
    await client.query('COMMIT')
    console.log('Synced homepage_specials (4 slots) and homepage_section_headers (5 keys) in Supabase!')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error(e)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

run()
