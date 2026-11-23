import { pool } from './db.js'

const initialReels = [
  {
    id: 'reel-1',
    title: 'Floating in Kashmir Shikara Waters',
    place: 'Dal Lake & Gulmarg, Kashmir',
    customerName: 'Anika & Rohan Sengupta',
    rating: 5.0,
    reviewQuote: 'Waking up to misty waters in a heritage cedar houseboat was pure magic. Crazy Tours planned every single detail to perfection.',
    videoUrl: '/Instagram_videos/compressed/reel_01.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_01_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:56',
    displayOrder: 1,
  },
  {
    id: 'reel-2',
    title: 'Tea Garden Mornings & Mist',
    place: 'Munnar & Kochi, Kerala',
    customerName: 'Meera & Rajesh Shah',
    rating: 5.0,
    reviewQuote: 'Unbelievable serenity walking through private plantation trails. The vehicle and private chauffeur made the mountain roads effortless.',
    videoUrl: '/Instagram_videos/compressed/reel_02.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_02_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:10',
    displayOrder: 2,
  },
  {
    id: 'reel-3',
    title: 'Living Royal History in Desert Forts',
    place: 'Jaisalmer Citadel, Rajasthan',
    customerName: 'The Kapoor Family',
    rating: 5.0,
    reviewQuote: 'Our children were mesmerized by the golden havelis and camel desert camp. Best holiday we have ever booked!',
    videoUrl: '/Instagram_videos/compressed/reel_03.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_03_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:18',
    displayOrder: 3,
  },
  {
    id: 'reel-4',
    title: 'High Mountain Passes & Monasteries',
    place: 'Nubra Valley & Pangong, Ladakh',
    customerName: 'Vikram & Friends',
    rating: 5.0,
    reviewQuote: 'Crazy Tours secured our inner line permits and high-altitude stays seamlessly. Pure adrenaline and breathtaking vistas.',
    videoUrl: '/Instagram_videos/compressed/reel_04.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_04_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:46',
    displayOrder: 4,
  },
  {
    id: 'reel-5',
    title: 'Sacred Valley Walks & Pine Forests',
    place: 'Manali & Solang Valley, Himachal',
    customerName: 'Pooja & Siddharth',
    rating: 5.0,
    reviewQuote: 'Quiet pine forest hideaway away from tourist crowds. Thank you Crazy Tours for handpicking the boutique riverside stay!',
    videoUrl: '/Instagram_videos/compressed/reel_05.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_05_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:44',
    displayOrder: 5,
  },
  {
    id: 'reel-6',
    title: 'Ganga Aarti by Twilight',
    place: 'Varanasi Ghats, Uttar Pradesh',
    customerName: 'Arun & Sunita Verma',
    rating: 5.0,
    reviewQuote: 'Private sunrise boat ride and privileged access to the evening prayers. Truly a spiritually transformative journey.',
    videoUrl: '/Instagram_videos/compressed/reel_06.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_06_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:17',
    displayOrder: 6,
  },
  {
    id: 'reel-7',
    title: 'Golden Sunset & Secret Coves',
    place: 'South Goa Coastal Retreat',
    customerName: 'Kavya & Arjun',
    rating: 5.0,
    reviewQuote: 'Clean private beaches, heritage Portuguese villa, and authentic coastal dining. We did not want to leave!',
    videoUrl: '/Instagram_videos/compressed/reel_07.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_07_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:47',
    displayOrder: 7,
  },
  {
    id: 'reel-8',
    title: 'Houseboat Living on Palm Backwaters',
    place: 'Alleppey & Kumarakom, Kerala',
    customerName: 'Divya & Nikhil',
    rating: 5.0,
    reviewQuote: 'Traditional spice meals cooked fresh on the boat as we drifted past paddy fields. 10/10 hospitality!',
    videoUrl: '/Instagram_videos/compressed/reel_08.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_08_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:14',
    displayOrder: 8,
  },
  {
    id: 'reel-9',
    title: 'Ancient Stone Temples & Sunlit Boulders',
    place: 'Hampi Ruins, Karnataka',
    customerName: 'Tanvi S.',
    rating: 5.0,
    reviewQuote: 'Cycling through UNESCO ruins with an exceptional storyteller guide arranged by Crazy Tours.',
    videoUrl: '/Instagram_videos/compressed/reel_09.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_09_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:52',
    displayOrder: 9,
  },
  {
    id: 'reel-10',
    title: 'Snow Peaks & Houseboats on Dal Lake',
    place: 'Gulmarg & Srinagar, Kashmir',
    customerName: 'Sameer & Preeti',
    rating: 5.0,
    reviewQuote: 'The gondola ride up to Phase 2 and cozy cedar houseboat made this our favorite anniversary trip ever.',
    videoUrl: '/Instagram_videos/compressed/reel_10.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_10_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:05',
    displayOrder: 10,
  },
]

async function migrate() {
  console.log('Creating instagram_reels table in PostgreSQL...')
  try {
    await pool.query(`
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
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    for (const r of initialReels) {
      await pool.query(
        `INSERT INTO instagram_reels (id, title, place, customer_name, rating, review_quote, video_url, poster_url, instagram_url, duration, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           place = EXCLUDED.place,
           customer_name = EXCLUDED.customer_name,
           rating = EXCLUDED.rating,
           review_quote = EXCLUDED.review_quote,
           video_url = EXCLUDED.video_url,
           poster_url = EXCLUDED.poster_url,
           instagram_url = COALESCE(instagram_reels.instagram_url, EXCLUDED.instagram_url),
           duration = EXCLUDED.duration,
           display_order = EXCLUDED.display_order`,
        [r.id, r.title, r.place, r.customerName, r.rating, r.reviewQuote, r.videoUrl, r.posterUrl, r.instagramUrl, r.duration, r.displayOrder]
      )
    }

    console.log('Successfully seeded 10 customer review Instagram reels!')
  } catch (err) {
    console.error('Migration error:', err.message)
  } finally {
    await pool.end()
  }
}

migrate()
