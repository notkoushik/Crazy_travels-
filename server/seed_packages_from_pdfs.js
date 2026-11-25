import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const DEFAULT_PDF_JSON_PATH =
  'C:\\Users\\koushik\\.gemini\\antigravity\\brain\\9adb4f79-cd79-4792-ae57-6a75788a3803\\scratch\\packages_from_pdfs.json'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const raw = fs.readFileSync(filePath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}

loadEnvFile(path.join(rootDir, '.env.local'))
loadEnvFile(path.join(rootDir, '.env'))

const { Pool } = pg
const dbUrl = process.env.DATABASE_URL || ''
const isLocalUrl = !dbUrl || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')

function createPool() {
  if (dbUrl) {
    return new Pool({
      connectionString: dbUrl,
      ssl: isLocalUrl ? false : { rejectUnauthorized: false },
    })
  }
  const pgConfig = {
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: process.env.PGDATABASE || 'crazy_tours_db',
  }
  if (process.env.PGPASSWORD) {
    pgConfig.password = process.env.PGPASSWORD
  }
  return new Pool(pgConfig)
}

const CUSTOMIZATION_OPTIONS = [
  {
    id: 'dharamshala',
    name: 'Dharamshala',
    subtitle: 'McLeod Ganj, Dalai Lama Temple & Kangra tea estates',
    extraDays: 1,
    extraNights: 1,
    priceDelta: 2500,
    highlights: [
      'McLeod Ganj & Tsuglagkhang Dalai Lama Temple',
      'Bhagsu Waterfall & Dharamkot café trail',
      'HPCA Cricket Stadium & Kangra tea gardens',
    ],
    allowedDurations: ['3D/2N', '4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
  },
  {
    id: 'dalhousie',
    name: 'Dalhousie',
    subtitle: 'Khajjiar meadows & deodar pine valleys',
    extraDays: 1,
    extraNights: 1,
    priceDelta: 2800,
    highlights: [
      'Khajjiar Mini Switzerland alpine meadow',
      'Kalatop Wildlife Sanctuary pine drive',
      "Panchpula & St. John's colonial heritage walk",
    ],
    allowedDurations: ['3D/2N', '4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_himachal_poster.jpg',
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    subtitle: 'Sukhna Lake, Rock Garden & transit stopover',
    extraDays: 1,
    extraNights: 0,
    priceDelta: 1500,
    highlights: [
      'Sukhna Lake sunrise or sunset promenade',
      'Nek Chand Rock Garden sculpture park',
      'Zakir Hussain Rose Garden & Sector 17 Plaza',
    ],
    allowedDurations: ['3D/2N', '4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_slow_travel_poster.jpg',
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    subtitle: 'Golden Temple & Attari–Wagah Border ceremony',
    extraDays: 1,
    extraNights: 1,
    priceDelta: 3000,
    highlights: [
      'Sri Harmandir Sahib (Golden Temple) darshan',
      'Attari–Wagah Border Beating Retreat ceremony',
      'Jallianwala Bagh & Amritsari heritage food trail',
    ],
    allowedDurations: ['3D/2N', '4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_golden_peaks_poster.jpg',
  },
  {
    id: 'tosh',
    name: 'Tosh',
    subtitle: 'Parvati Valley glacier hamlet & waterfall hike',
    extraDays: 1,
    extraNights: 1,
    priceDelta: 2200,
    highlights: [
      'Panoramic Tosh Valley glacier viewpoints',
      'Kutla waterfall pine forest walk',
      'Riverside mountain cafés above Barshaini',
    ],
    allowedDurations: ['3D/2N', '4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_adventure_poster.jpg',
  },
  {
    id: 'shangarh',
    name: 'Shangarh',
    subtitle: 'Sainj Valley alpine meadows & wooden temple',
    extraDays: 1,
    extraNights: 1,
    priceDelta: 2600,
    highlights: [
      'Lush Shangarh meadow plateau walks',
      'Historic Shangchul Mahadev wooden temple',
      'Barshangarh twin waterfalls & Great Himalayan fringes',
    ],
    allowedDurations: ['3D/2N', '4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_kedarnath_poster.jpg',
  },
  {
    id: 'baralacha-pass',
    name: 'Baralacha Pass',
    subtitle: 'High-altitude snow pass (16,040 ft) & Suraj Tal',
    extraDays: 1,
    extraNights: 1,
    priceDelta: 3500,
    highlights: [
      'Baralacha La high snow pass drive beyond Sissu',
      'Emerald Suraj Tal glacial lake stopover',
      'Keylong, Deepak Tal & Jispa valley views',
    ],
    allowedDurations: ['4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_ladakh_pass_poster.jpg',
  },
]

const DESTINATIONS_TO_UPSERT = [
  {
    slug: 'manali',
    city: 'Manali & Kullu Valley',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹6,999',
    priceNum: 6999,
    image: '/Video/optimized/destination_himachal_poster.jpg',
    season: 'All Year (Snow Jan–Mar, Meadow Apr–Jul)',
    duration: '3–5 days',
    tagline: 'Kullu valleys, Solang Valley snow slopes & Atal Tunnel passes',
    description:
      'Explore Kullu, Manali, Solang Valley, Atal Tunnel, Sissu/Koksar, Shimla, and Kasol across curated 3D/2N, 4D/3N, and 5D/4N circuits with Delhi transfers, personal cabs, and 24/7 Telugu customer care.',
    highlights: [
      'Manali local sightseeing: Hidimba Temple, Mall Road, Monastery, Club House & Van Vihar',
      'Snow Point excursion to Solang Valley, Atal Tunnel & Sissu / Koksar',
      'Kullu valley tour with Vaishno Devi Temple, Naggar Castle & optional paragliding / rafting',
    ],
    gallery: [
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
      '/Instagram_videos/thumbnails/reel_05_poster.jpg',
    ],
    bestTimeToVisit: 'April to July for crisp alpine weather; December to March for Solang & Atal Tunnel snow',
    idealFor: 'Couples, Families & Bachelors Squads',
    isTrending: true,
    adventureEnabled: false,
    customizationOptions: CUSTOMIZATION_OPTIONS,
    displayOrder: 1,
    nearestAirport: 'Bhuntar Airport (Kullu–Manali) / Chandigarh (IXC)',
    nearestRailway: 'Chandigarh Junction / Kalka Railway Station',
    recommendedStayDays: '3 to 5 days',
    peakSeason: 'Apr 16 – Jul 05 & Dec 16 – Jan 05',
    avgTemp: '-2°C to 22°C',
    permitRequired: false,
    permitDetails: '',
    clothingAdvice: 'Winter jacket, waterproof snow shoes, gloves, winter cap, UV goggles & warm socks',
    culturalNotes:
      'Remove footwear before entering Hidimba Devi and Vaishno Devi temples; Old Manali and Mall Road stay lively through the evening.',
    mustTryFood: ['Himachali Dham', 'Stuffed Siddu', 'Fresh River Trout', 'Tibetan Thukpa & Momos'],
    keyAttractions: [
      { name: 'Solang Valley & Atal Tunnel', type: 'Snow Point' },
      { name: 'Hidimba Devi Temple & Mall Road', type: 'Heritage & Cafés' },
      { name: 'Sissu & Koksar', type: 'Alpine Valley' },
      { name: 'Kullu & Naggar Castle', type: 'Valley & River' },
    ],
    networkCoverage: 'Strong 4G/5G in Manali & Kullu; intermittent past Atal Tunnel toward Sissu/Koksar',
  },
  {
    slug: 'kasol',
    city: 'Kasol & Parvati Valley',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹8,499',
    priceNum: 8499,
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
    season: 'All Year (Peak Apr–Jul & Dec–Jan)',
    duration: '4–5 days',
    tagline: 'Parvati riverside stays, Chalal pine trails & Manikaran hot springs',
    description:
      'Combine Manali and Kullu with Parvati Valley highlights—Kasol riverside stays, Chalal pine forest walks, and Manikaran Sahib medicinal hot springs.',
    highlights: [
      'Kasol riverside stay or camp experience in 4D/3N and 5D/4N Himachal circuits',
      'Manikaran Sahib Gurudwara & natural geothermal hot springs',
      'Chalal pine-lined nature walks & Parvati riverside cafés',
    ],
    gallery: [
      '/Video/optimized/destination_kinnaur_poster.jpg',
      '/Instagram_videos/thumbnails/reel_05_poster.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_slow_travel_poster.jpg',
    ],
    bestTimeToVisit: 'March to July and October to January for cool Parvati Valley weather',
    idealFor: 'Bachelors Squads, Honeymoon Couples & Relaxed Family Trips',
    isTrending: true,
    adventureEnabled: false,
    customizationOptions: CUSTOMIZATION_OPTIONS,
    displayOrder: 2,
    nearestAirport: 'Bhuntar Airport (Kullu–Manali, approx. 31 km)',
    nearestRailway: 'Chandigarh Junction / Pathankot',
    recommendedStayDays: '4 to 5 days (combined with Manali / Shimla)',
    peakSeason: 'Apr 16 – Jul 05 & Dec 16 – Jan 05',
    avgTemp: '2°C to 24°C',
    permitRequired: false,
    permitDetails: '',
    clothingAdvice: 'Warm winter jacket, waterproof walking shoes, gloves & cash in hand for local cafés',
    culturalNotes:
      'Cover heads respectfully inside Manikaran Sahib Gurudwara and help keep Parvati riverside trails plastic-free.',
    mustTryFood: ['Wood-Fired Shakshouka', 'Tibetan Momos', 'Himachali Siddu', 'Gurudwara Langar'],
    keyAttractions: [
      { name: 'Kasol Market & Parvati River', type: 'Riverside Hub' },
      { name: 'Manikaran Sahib Hot Springs', type: 'Sacred Springs' },
      { name: 'Chalal Pine Trail', type: 'Nature Walk' },
      { name: 'Kullu Valley En-Route', type: 'Valley Viewpoint' },
    ],
    networkCoverage: 'Good 4G across Kasol & Manikaran; patchier in deeper Parvati side valleys',
  },
  {
    slug: 'shimla',
    city: 'Shimla & Kufri',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹10,999',
    priceNum: 10999,
    image: '/Video/optimized/destination_golden_peaks_poster.jpg',
    season: 'All Year (Snow Dec–Feb, Pleasant Mar–Jul)',
    duration: '4–5 days',
    tagline: 'The Ridge, Mall Road, Christ Church & snowy Kufri viewpoints',
    description:
      'Explore The Ridge, Mall Road, Christ Church, Scandal Point, Lakkar Bazar, Kali Bari Temple, and Kufri snow ridges on private cab circuits connecting Shimla, Manali, and Kasol from Delhi.',
    highlights: [
      'Shimla heritage walk: The Ridge, Mall Road, Christ Church, Scandal Point, Lakkar Bazar & Kali Bari Temple',
      'Kufri excursion with Kufri Fun World, Green Valley & Himalayan Nature Park',
      'Scenic Manali–Shimla highway drive past Pandoh Dam & Kullu Valley',
    ],
    gallery: [
      '/Video/optimized/destination_golden_peaks_poster.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
      '/Video/optimized/hero_soul_travel_poster.jpg',
    ],
    bestTimeToVisit: 'March to July for pleasant hill weather; December to February for Kufri snow',
    idealFor: 'Families, Honeymoon Couples & Friends Road Trips',
    isTrending: true,
    adventureEnabled: false,
    customizationOptions: CUSTOMIZATION_OPTIONS,
    displayOrder: 3,
    nearestAirport: 'Shimla Airport (Jubbarhatti) / Chandigarh (IXC)',
    nearestRailway: 'Kalka Railway Station / Chandigarh Junction',
    recommendedStayDays: '4 to 5 days (combined Manali–Shimla circuit)',
    peakSeason: 'Apr 16 – Jul 05 & Dec 16 – Jan 05',
    avgTemp: '0°C to 23°C',
    permitRequired: false,
    permitDetails: '',
    clothingAdvice: 'Warm jacket, comfortable walking shoes for pedestrian Mall Road, gloves & winter cap',
    culturalNotes:
      'Mall Road and The Ridge are pedestrian-only heritage zones; private cabs drop guests at designated lift or parking points.',
    mustTryFood: ['Chana Madra', 'Lakkar Bazar Hot Jalebis', 'Mall Road Bakery Coffee', 'Himachali Siddu'],
    keyAttractions: [
      { name: 'The Ridge & Christ Church', type: 'Colonial Heritage' },
      { name: 'Mall Road, Scandal Point & Lakkar Bazar', type: 'Promenade & Crafts' },
      { name: 'Kali Bari Temple', type: 'Heritage Temple' },
      { name: 'Kufri & Green Valley', type: 'Snow & Viewpoints' },
    ],
    networkCoverage: 'Full 4G/5G coverage throughout Shimla, Kufri & highway corridor',
  },
]

const PACKAGE_MEDIA_BY_DEST_AND_CAT = {
  manali: {
    Couple: {
      image: '/catalog-photos/groups/Couple_3.jpg',
      gallery: [
        '/catalog-photos/groups/Couple_3.jpg',
        '/Video/optimized/destination_himachal_poster.jpg',
        '/Instagram_videos/thumbnails/reel_05_poster.jpg',
        '/catalog-photos/groups/couple.jpg',
      ],
    },
    Family: {
      image: '/Video/optimized/destination_himachal_poster.jpg',
      gallery: [
        '/Video/optimized/destination_himachal_poster.jpg',
        '/catalog-photos/groups/Family_2.jpg',
        '/Video/optimized/destination_kinnaur_poster.jpg',
        '/Instagram_videos/thumbnails/reel_05_poster.jpg',
      ],
    },
    Bachelors: {
      image: '/Video/optimized/destination_adventure_poster.jpg',
      gallery: [
        '/Video/optimized/destination_adventure_poster.jpg',
        '/catalog-photos/groups/Friends_3.jpg',
        '/Video/optimized/destination_himachal_poster.jpg',
        '/Instagram_videos/thumbnails/reel_05_poster.jpg',
      ],
    },
  },
  kasol: {
    Couple: {
      image: '/catalog-photos/groups/Couple_4.jpg',
      gallery: [
        '/catalog-photos/groups/Couple_4.jpg',
        '/Video/optimized/destination_kinnaur_poster.jpg',
        '/Instagram_videos/thumbnails/reel_05_poster.jpg',
        '/Video/optimized/destination_slow_travel_poster.jpg',
      ],
    },
    Family: {
      image: '/Video/optimized/destination_kinnaur_poster.jpg',
      gallery: [
        '/Video/optimized/destination_kinnaur_poster.jpg',
        '/catalog-photos/groups/Family.jpg',
        '/Video/optimized/destination_himachal_poster.jpg',
        '/Instagram_videos/thumbnails/reel_05_poster.jpg',
      ],
    },
    Bachelors: {
      image: '/catalog-photos/groups/Friends_4.jpg',
      gallery: [
        '/catalog-photos/groups/Friends_4.jpg',
        '/Video/optimized/destination_kinnaur_poster.jpg',
        '/Instagram_videos/thumbnails/reel_05_poster.jpg',
        '/Video/optimized/destination_adventure_poster.jpg',
      ],
    },
  },
  shimla: {
    Couple: {
      image: '/catalog-photos/groups/Couple_2.jpg',
      gallery: [
        '/catalog-photos/groups/Couple_2.jpg',
        '/Video/optimized/destination_golden_peaks_poster.jpg',
        '/Video/optimized/destination_himachal_poster.jpg',
        '/Video/optimized/hero_soul_travel_poster.jpg',
      ],
    },
    Family: {
      image: '/Video/optimized/destination_golden_peaks_poster.jpg',
      gallery: [
        '/Video/optimized/destination_golden_peaks_poster.jpg',
        '/catalog-photos/groups/Family_4.jpg',
        '/Video/optimized/destination_himachal_poster.jpg',
        '/Video/optimized/destination_kinnaur_poster.jpg',
      ],
    },
    Bachelors: {
      image: '/catalog-photos/groups/Friends_5.jpg',
      gallery: [
        '/catalog-photos/groups/Friends_5.jpg',
        '/Video/optimized/destination_golden_peaks_poster.jpg',
        '/Video/optimized/destination_adventure_poster.jpg',
        '/Video/optimized/destination_himachal_poster.jpg',
      ],
    },
  },
}

const FEATURED_PACKAGE_IDS = new Set([
  'manali-couple-kullu-manali-3d2n',
  'kasol-bachelors-kasol-manali-kasol-stay-4d3n',
  'shimla-family-shimla-manali-5d4n',
  'shimla-couple-shimla-manali-kasol-kasol-stay-5d4n',
])

const INSTAGRAM_REELS_TO_UPSERT = [
  {
    id: 'reel-1',
    title: 'Candlelight Evenings in Manali',
    place: 'Old Manali & Hidimba Pine Trails',
    customerName: 'Anika & Rohan Sengupta',
    rating: 5.0,
    reviewQuote:
      'From Delhi Volvo transfers to our cozy pine-view room and candlelight dinner in Manali, Crazy Tours planned every single detail effortlessly.',
    videoUrl: '/Instagram_videos/compressed/reel_01.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_01_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:56',
    displayOrder: 1,
    category: 'Couple',
  },
  {
    id: 'reel-2',
    title: 'Family Mornings in Shimla & Kufri',
    place: 'The Ridge, Mall Road & Kufri',
    customerName: 'Meera & Rajesh Shah',
    rating: 5.0,
    reviewQuote:
      'Having a dedicated private cab from Delhi made traveling with our parents and kids across Shimla and Manali completely stress-free.',
    videoUrl: '/Instagram_videos/compressed/reel_02.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_02_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:10',
    displayOrder: 2,
    category: 'Family',
  },
  {
    id: 'reel-3',
    title: 'Snow Ridges & Family Memories',
    place: 'Solang Valley & Kufri Snow Point',
    customerName: 'The Kapoor Family',
    rating: 5.0,
    reviewQuote:
      'Our kids loved playing in the snow at Solang Valley and riding through Atal Tunnel. Best family Himachal trip we have booked!',
    videoUrl: '/Instagram_videos/compressed/reel_03.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_03_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:18',
    displayOrder: 3,
    category: 'Family',
  },
  {
    id: 'reel-4',
    title: 'Atal Tunnel & Sissu Squad Ride',
    place: 'Solang, Atal Tunnel & Sissu',
    customerName: 'Vikram & Squad',
    rating: 5.0,
    reviewQuote:
      'Six of us did the 4D/3N Bachelors Manali–Kasol circuit with personal cab and 24/7 Telugu coordinator support. Pure adrenaline!',
    videoUrl: '/Instagram_videos/compressed/reel_04.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_04_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:46',
    displayOrder: 4,
    category: 'Bachelors',
  },
  {
    id: 'reel-5',
    title: 'Parvati Riverside Walks & Pine Cafés',
    place: 'Kasol, Chalal & Manikaran',
    customerName: 'Pooja & Siddharth',
    rating: 5.0,
    reviewQuote:
      'Waking up beside the Parvati River in Kasol and soaking in the Manikaran hot springs was unforgettable. Thank you Crazy Tours!',
    videoUrl: '/Instagram_videos/compressed/reel_05.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_05_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:44',
    displayOrder: 5,
    category: 'Couple',
  },
  {
    id: 'reel-6',
    title: 'Manikaran & Kullu Valley Family Trail',
    place: 'Kullu, Naggar Castle & Manikaran',
    customerName: 'Arun & Sunita Verma',
    rating: 5.0,
    reviewQuote:
      'Warm hospitality, clean mountain hotels, and punctual cab pickups across every temple and viewpoint from Kullu to Kasol.',
    videoUrl: '/Instagram_videos/compressed/reel_06.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_06_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:17',
    displayOrder: 6,
    category: 'Family',
  },
  {
    id: 'reel-7',
    title: 'Kasol Campfires & Squad Nights',
    place: 'Kasol Riverside Stay, Parvati Valley',
    customerName: 'Karthik & Friends',
    rating: 5.0,
    reviewQuote:
      'Bonfire evening by the river in Kasol followed by Kullu paragliding the next morning—10/10 bachelor trip!',
    videoUrl: '/Instagram_videos/compressed/reel_07.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_07_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:47',
    displayOrder: 7,
    category: 'Bachelors',
  },
  {
    id: 'reel-8',
    title: 'Honeymoon Views Over Shimla Ridge',
    place: 'Shimla Mall Road & Christ Church',
    customerName: 'Divya & Nikhil',
    rating: 5.0,
    reviewQuote:
      'Sunset walks on Shimla Ridge, flower-bed decor in Manali, and seamless private cab transfers across all 5 days.',
    videoUrl: '/Instagram_videos/compressed/reel_08.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_08_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:14',
    displayOrder: 8,
    category: 'Couple',
  },
  {
    id: 'reel-9',
    title: 'Kullu Rafting & Shimla Road Trip',
    place: 'Kullu Valley & Shimla Highway',
    customerName: 'Rohith & College Crew',
    rating: 5.0,
    reviewQuote:
      'River rafting in Kullu, snow fun at Solang, and Mall Road chill evenings in Shimla—best 5D/4N trip with zero hassle.',
    videoUrl: '/Instagram_videos/compressed/reel_09.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_09_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:52',
    displayOrder: 9,
    category: 'Bachelors',
  },
  {
    id: 'reel-10',
    title: 'Snowy Honeymoon in Solang & Kufri',
    place: 'Manali, Kasol & Shimla Circuit',
    customerName: 'Sameer & Preeti',
    rating: 5.0,
    reviewQuote:
      'Our 5-day Shimla–Manali–Kasol honeymoon felt completely curated around us—24/7 Telugu support made everything effortless.',
    videoUrl: '/Instagram_videos/compressed/reel_10.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_10_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:05',
    displayOrder: 10,
    category: 'Couple',
  },
]

const HERO_SLIDES_TO_SEED = [
  {
    image: '/Video/optimized/destination_himachal_poster.jpg',
    eyebrow: 'Snow peaks & cedar valleys',
    title: 'Manali, Solang & Atal Tunnel.',
    copy: 'Private cabs from Delhi, boutique mountain stays, and 24/7 Telugu concierge care across Kullu, Manali, and Sissu.',
    location: 'Manali & Kullu Valley, Himachal Pradesh',
    actionRoute: 'destination/manali',
    displayOrder: 1,
  },
  {
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
    eyebrow: 'Parvati riverside escape',
    title: 'Slow mornings in Kasol & Manikaran.',
    copy: 'Pine forest trails, riverside cafés, geothermal hot springs at Manikaran Sahib, and cosy valley stays.',
    location: 'Kasol & Parvati Valley, Himachal Pradesh',
    actionRoute: 'destination/kasol',
    displayOrder: 2,
  },
  {
    image: '/Video/optimized/destination_golden_peaks_poster.jpg',
    eyebrow: 'Heritage ridges & snowy hills',
    title: 'Shimla, Kufri & Grand Circuits.',
    copy: 'Colonial Mall Road walks, The Ridge & Christ Church, Kufri snow points, and seamless 4D/3N and 5D/4N routes.',
    location: 'Shimla & Kufri, Himachal Pradesh',
    actionRoute: 'destination/shimla',
    displayOrder: 3,
  },
]

const OFFERS_TO_UPSERT = [
  {
    id: 'offer-early-summer',
    code: 'CRAZY15',
    title: 'Early Bird Himachal Holiday Offer',
    discountText: 'Off-Season Value Rates',
    tag: 'Limited Seats',
    validTill: 'Off-Season: Jan 06 – Apr 15 & Jul 06 – Dec 15',
    description:
      'Book your Manali, Kasol, or Shimla trip during Off-Season windows and save up to 33% on Standard, Standard Plus, and Premium tiers.',
    minBooking: 'Min. 6 pax for Group / 1 Couple',
    image: '/Video/optimized/destination_himachal_poster.jpg',
  },
  {
    id: 'offer-honeymoon-perks',
    code: 'ROMANCE',
    title: 'Manali & Shimla Honeymoon Perks',
    discountText: 'Complimentary Couple Inclusions',
    tag: 'Couples Only',
    validTill: 'Year-Round on 3D/2N, 4D/3N & 5D/4N',
    description:
      'Enjoy complimentary flower-bed decoration, candlelight dinner, honeymoon cake, and apple wine on Manali, Kasol & Shimla honeymoon packages.',
    minBooking: 'Per Couple Package',
    image: '/catalog-photos/groups/Couple_3.jpg',
  },
  {
    id: 'offer-family-escape',
    code: 'FAMILYFUN',
    title: 'Family & Squad Private Cab Deal',
    discountText: 'Private Taxi Included',
    tag: 'Best for Families & Squads',
    validTill: 'Valid on 4D/3N & 5D/4N Circuits',
    description:
      'Dedicated personal cab across Manali, Solang Valley, Atal Tunnel, Kasol, and Shimla with daily breakfast, dinner & 24/7 Telugu customer care.',
    minBooking: 'Min. 6 travelers',
    image: '/catalog-photos/groups/Family_2.jpg',
  },
]

function deriveDestinationSlug(pdf) {
  const filename = (pdf.filename || '').toLowerCase()
  const routeSummary = (pdf.routeSummary || '').toLowerCase()
  if (routeSummary.includes('shimla')) return 'shimla'
  if (routeSummary.includes('kasol') || filename.includes('with kasol stay')) return 'kasol'
  return 'manali'
}

function buildPackageId(pdf, destinationSlug) {
  const cat = String(pdf.category || '').toLowerCase()
  const dur = String(pdf.durationLabel || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  const kasolStay = String(pdf.filename || '')
    .toLowerCase()
    .includes('with kasol stay')
    ? '-kasol-stay'
    : ''
  const route = String(pdf.place || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${destinationSlug}-${cat}-${route}${kasolStay}-${dur}`
}

function deriveTheme(category) {
  if (category === 'Couple') return 'Honeymoon'
  if (category === 'Family') return 'Family'
  if (category === 'Adventure') return 'Adventure'
  return 'Scenic'
}

function deriveTravellerGroup(category) {
  if (category === 'Couple') return 'Couples'
  if (category === 'Family') return 'Families'
  if (category === 'Bachelors') return 'Friends & bachelors'
  return null
}

function verifyAndTransformPdfPackages(jsonPath) {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Required PDF catalog JSON not found at: ${jsonPath}`)
  }

  const rawList = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  if (!Array.isArray(rawList) || rawList.length !== 18) {
    throw new Error(`Expected 18 PDF packages in ${jsonPath}, found ${Array.isArray(rawList) ? rawList.length : 'non-array'}`)
  }

  const requiredFields = [
    'filename',
    'brochurePdfUrl',
    'category',
    'title',
    'place',
    'state',
    'durationLabel',
    'daysCount',
    'nightsCount',
    'routeSummary',
    'pricingTiers',
    'inclusions',
    'exclusions',
    'thingsToCarry',
    'cancellationPolicy',
    'highlights',
    'summary',
    'itinerary',
  ]

  const seenIds = new Set()

  return rawList.map((pdf, idx) => {
    for (const field of requiredFields) {
      if (pdf[field] === undefined || pdf[field] === null || pdf[field] === '') {
        throw new Error(`PDF #${idx + 1} (${pdf.filename || 'unknown'}) missing required field: ${field}`)
      }
    }

    const pdfDiskPath = path.join(rootDir, 'public', pdf.brochurePdfUrl.replace(/^\/+/, ''))
    if (!fs.existsSync(pdfDiskPath)) {
      throw new Error(`PDF asset missing on disk: ${pdfDiskPath}`)
    }

    if (!Array.isArray(pdf.itinerary) || pdf.itinerary.length !== Number(pdf.daysCount)) {
      throw new Error(
        `PDF ${pdf.filename}: itinerary length (${pdf.itinerary?.length}) does not match daysCount (${pdf.daysCount})`
      )
    }

    for (const day of pdf.itinerary) {
      for (const dayKey of ['day', 'title', 'description', 'transfer', 'meals', 'hotel', 'activities']) {
        if (!day[dayKey] || (Array.isArray(day[dayKey]) && day[dayKey].length === 0)) {
          throw new Error(`PDF ${pdf.filename} Day ${day.day}: missing ${dayKey}`)
        }
      }
    }

    const tiers = pdf.pricingTiers?.tiers
    if (!Array.isArray(tiers) || tiers.length === 0) {
      throw new Error(`PDF ${pdf.filename}: pricingTiers.tiers must be a non-empty array`)
    }

    const stdTier = tiers[0]
    const priceNum = Number(stdTier.offSeasonPrice)
    const seasonPriceNum = Number(stdTier.seasonPrice)
    if (!Number.isFinite(priceNum) || priceNum <= 0 || !Number.isFinite(seasonPriceNum) || seasonPriceNum <= 0) {
      throw new Error(`PDF ${pdf.filename}: invalid Standard tier pricing`)
    }

    const destinationSlug = deriveDestinationSlug(pdf)
    const id = buildPackageId(pdf, destinationSlug)
    if (seenIds.has(id)) {
      throw new Error(`Duplicate generated package id: ${id}`)
    }
    seenIds.add(id)

    const media =
      PACKAGE_MEDIA_BY_DEST_AND_CAT[destinationSlug]?.[pdf.category] ||
      PACKAGE_MEDIA_BY_DEST_AND_CAT.manali.Family

    const discountPct = Math.max(0, Math.round(((seasonPriceNum - priceNum) / seasonPriceNum) * 100))

    return {
      id,
      slug: id,
      title: pdf.title,
      place: pdf.place,
      state: pdf.state,
      duration: `${pdf.daysCount} Days / ${pdf.nightsCount} Nights`,
      daysCount: Number(pdf.daysCount),
      nightsCount: Number(pdf.nightsCount),
      category: pdf.category,
      travellerGroup: deriveTravellerGroup(pdf.category),
      destinationSlug,
      routeSummary: pdf.routeSummary,
      summary: pdf.summary,
      overview: pdf.summary,
      brochurePdfUrl: pdf.brochurePdfUrl,
      pricingTiers: pdf.pricingTiers,
      price: `₹${priceNum.toLocaleString('en-IN')}`,
      priceNum,
      originalPrice: `₹${seasonPriceNum.toLocaleString('en-IN')}`,
      discount: discountPct > 0 ? `${discountPct}% OFF` : '',
      rating: pdf.category === 'Couple' ? 4.9 : 4.8,
      reviewCount: 44 + idx * 3,
      image: media.image,
      gallery: media.gallery,
      highlights: pdf.highlights,
      inclusions: pdf.inclusions,
      exclusions: pdf.exclusions,
      thingsToCarry: pdf.thingsToCarry,
      cancellationPolicy: pdf.cancellationPolicy,
      itinerary: pdf.itinerary,
      theme: deriveTheme(pdf.category),
      featured: FEATURED_PACKAGE_IDS.has(id),
    }
  })
}

async function columnExists(client, tableName, columnName) {
  const { rows } = await client.query(
    `SELECT is_nullable
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = $1
       AND column_name = $2`,
    [tableName, columnName]
  )
  return rows[0] || null
}

async function detachStaleForeignKeys(client, validPackageIds, validDestinationSlugs) {
  // 1. Explicitly detach known FKs referencing packages(id) or destinations(slug)
  // while preserving customer bookings, inquiries, reviews, stays, and media rows.
  const packageRefTargets = [
    { table: 'bookings', column: 'package_id' },
    { table: 'reviews', column: 'package_id' },
  ]
  for (const { table, column } of packageRefTargets) {
    const col = await columnExists(client, table, column)
    if (!col) continue
    if (col.is_nullable === 'NO') {
      await client.query(`ALTER TABLE "${table}" ALTER COLUMN "${column}" DROP NOT NULL`)
    }
    const res = await client.query(
      `UPDATE "${table}"
       SET "${column}" = NULL
       WHERE "${column}" IS NOT NULL
         AND "${column}" <> ALL($1::text[])`,
      [validPackageIds]
    )
    if (res.rowCount > 0) {
      console.log(`Detached ${res.rowCount} stale ${table}.${column} reference(s).`)
    }
  }

  const destinationRefTargets = [
    { table: 'stays', column: 'destination_slug' },
    { table: 'inquiries', column: 'destination_slug' },
    { table: 'media_assets', column: 'destination_slug' },
  ]
  for (const { table, column } of destinationRefTargets) {
    const col = await columnExists(client, table, column)
    if (!col) continue
    if (col.is_nullable === 'NO') {
      await client.query(`ALTER TABLE "${table}" ALTER COLUMN "${column}" DROP NOT NULL`)
    }
    const res = await client.query(
      `UPDATE "${table}"
       SET "${column}" = NULL
       WHERE "${column}" IS NOT NULL
         AND "${column}" <> ALL($1::text[])`,
      [validDestinationSlugs]
    )
    if (res.rowCount > 0) {
      console.log(`Detached ${res.rowCount} stale ${table}.${column} reference(s).`)
    }
  }

  // 2. Safety sweep for any additional single-column FKs referencing packages or destinations
  const fkRes = await client.query(`
    SELECT
      cls.relname AS table_name,
      att.attname AS column_name,
      refcls.relname AS ref_table,
      NOT att.attnotnull AS is_nullable
    FROM pg_constraint con
    JOIN pg_class cls ON cls.oid = con.conrelid
    JOIN pg_namespace ns ON ns.oid = cls.relnamespace
    JOIN pg_class refcls ON refcls.oid = con.confrelid
    JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]
    WHERE con.contype = 'f'
      AND ns.nspname = 'public'
      AND array_length(con.conkey, 1) = 1
      AND refcls.relname IN ('packages', 'destinations')
      AND NOT (cls.relname = 'packages' AND att.attname = 'destination_slug')
  `)

  const safeIdent = /^[a-z_][a-z0-9_]*$/i
  for (const fk of fkRes.rows) {
    if (!safeIdent.test(fk.table_name) || !safeIdent.test(fk.column_name)) continue
    const validSet = fk.ref_table === 'packages' ? validPackageIds : validDestinationSlugs
    if (!fk.is_nullable) {
      await client.query(`ALTER TABLE "${fk.table_name}" ALTER COLUMN "${fk.column_name}" DROP NOT NULL`)
    }
    const res = await client.query(
      `UPDATE "${fk.table_name}"
       SET "${fk.column_name}" = NULL
       WHERE "${fk.column_name}" IS NOT NULL
         AND "${fk.column_name}" <> ALL($1::text[])`,
      [validSet]
    )
    if (res.rowCount > 0) {
      console.log(`Detached ${res.rowCount} stale ${fk.table_name}.${fk.column_name} reference(s).`)
    }
  }
}

async function run() {
  const pool = createPool()
  let client

  try {
    const pdfJsonPath = process.env.PDF_PACKAGES_JSON || DEFAULT_PDF_JSON_PATH
    const verifiedPackages = verifyAndTransformPdfPackages(pdfJsonPath)
    console.log(`Verified ${verifiedPackages.length} PDF packages from ${pdfJsonPath}`)

    client = await pool.connect()

    console.log('Ensuring schema columns for destinations, packages, and instagram_reels...')
    await client.query(`
      ALTER TABLE destinations
        ADD COLUMN IF NOT EXISTS adventure_enabled BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS customization_options JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS slug VARCHAR(120),
        ADD COLUMN IF NOT EXISTS nights_count INTEGER,
        ADD COLUMN IF NOT EXISTS category VARCHAR(60),
        ADD COLUMN IF NOT EXISTS traveller_group TEXT,
        ADD COLUMN IF NOT EXISTS destination_slug VARCHAR(120),
        ADD COLUMN IF NOT EXISTS route_summary TEXT,
        ADD COLUMN IF NOT EXISTS summary TEXT,
        ADD COLUMN IF NOT EXISTS brochure_pdf_url TEXT,
        ADD COLUMN IF NOT EXISTS pricing_tiers JSONB,
        ADD COLUMN IF NOT EXISTS things_to_carry JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS cancellation_policy JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE instagram_reels
        ADD COLUMN IF NOT EXISTS category VARCHAR(60);
      CREATE INDEX IF NOT EXISTS idx_packages_destination_category ON packages(destination_slug, category);
      CREATE INDEX IF NOT EXISTS idx_reels_category ON instagram_reels(category, display_order ASC);
    `)

    await client.query('BEGIN')

    // 1. Upsert the 3 strictly PDF-only destinations (adventure_enabled = false initially)
    for (const d of DESTINATIONS_TO_UPSERT) {
      await client.query(
        `INSERT INTO destinations (
          slug, city, country, state, region, price, price_num, image, season, duration, tagline, description,
          highlights, gallery, best_time_to_visit, ideal_for, is_trending, adventure_enabled, customization_options, display_order,
          nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp,
          permit_required, permit_details, clothing_advice, cultural_notes,
          must_try_food, key_attractions, network_coverage
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25,
          $26, $27, $28, $29,
          $30, $31, $32
        )
        ON CONFLICT (slug) DO UPDATE SET
          city = EXCLUDED.city,
          country = EXCLUDED.country,
          state = EXCLUDED.state,
          region = EXCLUDED.region,
          price = EXCLUDED.price,
          price_num = EXCLUDED.price_num,
          image = EXCLUDED.image,
          season = EXCLUDED.season,
          duration = EXCLUDED.duration,
          tagline = EXCLUDED.tagline,
          description = EXCLUDED.description,
          highlights = EXCLUDED.highlights,
          gallery = EXCLUDED.gallery,
          best_time_to_visit = EXCLUDED.best_time_to_visit,
          ideal_for = EXCLUDED.ideal_for,
          is_trending = EXCLUDED.is_trending,
          adventure_enabled = EXCLUDED.adventure_enabled,
          customization_options = EXCLUDED.customization_options,
          display_order = EXCLUDED.display_order,
          nearest_airport = EXCLUDED.nearest_airport,
          nearest_railway = EXCLUDED.nearest_railway,
          recommended_stay_days = EXCLUDED.recommended_stay_days,
          peak_season = EXCLUDED.peak_season,
          avg_temp = EXCLUDED.avg_temp,
          permit_required = EXCLUDED.permit_required,
          permit_details = EXCLUDED.permit_details,
          clothing_advice = EXCLUDED.clothing_advice,
          cultural_notes = EXCLUDED.cultural_notes,
          must_try_food = EXCLUDED.must_try_food,
          key_attractions = EXCLUDED.key_attractions,
          network_coverage = EXCLUDED.network_coverage`,
        [
          d.slug,
          d.city,
          d.country,
          d.state,
          d.region,
          d.price,
          d.priceNum,
          d.image,
          d.season,
          d.duration,
          d.tagline,
          d.description,
          JSON.stringify(d.highlights),
          JSON.stringify(d.gallery),
          d.bestTimeToVisit,
          d.idealFor,
          d.isTrending,
          d.adventureEnabled,
          JSON.stringify(d.customizationOptions),
          d.displayOrder,
          d.nearestAirport,
          d.nearestRailway,
          d.recommendedStayDays,
          d.peakSeason,
          d.avgTemp,
          d.permitRequired,
          d.permitDetails,
          d.clothingAdvice,
          d.culturalNotes,
          JSON.stringify(d.mustTryFood),
          JSON.stringify(d.keyAttractions),
          d.networkCoverage,
        ]
      )
    }

    // 2. Detach stale foreign keys (e.g. bookings.package_id) & purge ALL non-PDF packages and destinations
    const validPackageIds = verifiedPackages.map((p) => p.id)
    const validDestinationSlugs = DESTINATIONS_TO_UPSERT.map((d) => d.slug)
    await detachStaleForeignKeys(client, validPackageIds, validDestinationSlugs)

    const deletedPackagesRes = await client.query(
      'DELETE FROM packages WHERE id <> ALL($1::text[]) RETURNING id',
      [validPackageIds]
    )
    const deletedDestinationsRes = await client.query(
      'DELETE FROM destinations WHERE slug <> ALL($1::text[]) RETURNING slug',
      [validDestinationSlugs]
    )
    console.log(
      `Purged ${deletedPackagesRes.rowCount} non-PDF packages and ${deletedDestinationsRes.rowCount} non-PDF destinations.`
    )

    // 3. Upsert all 18 verified PDF packages
    for (const p of verifiedPackages) {
      await client.query(
        `INSERT INTO packages (
          id, slug, title, place, state, duration, days_count, nights_count,
          category, traveller_group, destination_slug, route_summary, summary, brochure_pdf_url,
          pricing_tiers, things_to_carry, cancellation_policy,
          price, price_num, original_price, discount,
          rating, review_count, image, gallery, overview,
          highlights, inclusions, exclusions, itinerary, theme, featured
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17,
          $18, $19, $20, $21,
          $22, $23, $24, $25, $26,
          $27, $28, $29, $30, $31, $32
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          place = EXCLUDED.place,
          state = EXCLUDED.state,
          duration = EXCLUDED.duration,
          days_count = EXCLUDED.days_count,
          nights_count = EXCLUDED.nights_count,
          category = EXCLUDED.category,
          traveller_group = EXCLUDED.traveller_group,
          destination_slug = EXCLUDED.destination_slug,
          route_summary = EXCLUDED.route_summary,
          summary = EXCLUDED.summary,
          brochure_pdf_url = EXCLUDED.brochure_pdf_url,
          pricing_tiers = EXCLUDED.pricing_tiers,
          things_to_carry = EXCLUDED.things_to_carry,
          cancellation_policy = EXCLUDED.cancellation_policy,
          price = EXCLUDED.price,
          price_num = EXCLUDED.price_num,
          original_price = EXCLUDED.original_price,
          discount = EXCLUDED.discount,
          rating = EXCLUDED.rating,
          review_count = EXCLUDED.review_count,
          image = EXCLUDED.image,
          gallery = EXCLUDED.gallery,
          overview = EXCLUDED.overview,
          highlights = EXCLUDED.highlights,
          inclusions = EXCLUDED.inclusions,
          exclusions = EXCLUDED.exclusions,
          itinerary = EXCLUDED.itinerary,
          theme = EXCLUDED.theme,
          featured = EXCLUDED.featured`,
        [
          p.id,
          p.slug,
          p.title,
          p.place,
          p.state,
          p.duration,
          p.daysCount,
          p.nightsCount,
          p.category,
          p.travellerGroup,
          p.destinationSlug,
          p.routeSummary,
          p.summary,
          p.brochurePdfUrl,
          JSON.stringify(p.pricingTiers),
          JSON.stringify(p.thingsToCarry),
          JSON.stringify(p.cancellationPolicy),
          p.price,
          p.priceNum,
          p.originalPrice,
          p.discount,
          p.rating,
          p.reviewCount,
          p.image,
          JSON.stringify(p.gallery),
          p.overview,
          JSON.stringify(p.highlights),
          JSON.stringify(p.inclusions),
          JSON.stringify(p.exclusions),
          JSON.stringify(p.itinerary),
          p.theme,
          p.featured,
        ]
      )
    }

    // 4. Categorize instagram_reels into Couple, Family, Bachelors
    for (const r of INSTAGRAM_REELS_TO_UPSERT) {
      await client.query(
        `INSERT INTO instagram_reels (
          id, title, place, customer_name, rating, review_quote,
          video_url, poster_url, instagram_url, duration, display_order, category
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          place = EXCLUDED.place,
          customer_name = EXCLUDED.customer_name,
          rating = EXCLUDED.rating,
          review_quote = EXCLUDED.review_quote,
          video_url = EXCLUDED.video_url,
          poster_url = EXCLUDED.poster_url,
          instagram_url = COALESCE(NULLIF(instagram_reels.instagram_url, ''), EXCLUDED.instagram_url),
          duration = EXCLUDED.duration,
          display_order = EXCLUDED.display_order,
          category = EXCLUDED.category`,
        [
          r.id,
          r.title,
          r.place,
          r.customerName,
          r.rating,
          r.reviewQuote,
          r.videoUrl,
          r.posterUrl,
          r.instagramUrl,
          r.duration,
          r.displayOrder,
          r.category,
        ]
      )
    }
    await client.query(
      "UPDATE instagram_reels SET category = 'Couple' WHERE category IS NULL OR TRIM(category) = ''"
    )

    // 5. Update hero_slides so all routes point to manali, kasol, or shimla
    await client.query('DELETE FROM hero_slides')
    for (const hs of HERO_SLIDES_TO_SEED) {
      await client.query(
        `INSERT INTO hero_slides (image, eyebrow, title, copy, location, action_route, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [hs.image, hs.eyebrow, hs.title, hs.copy, hs.location, hs.actionRoute, hs.displayOrder]
      )
    }

    // 6. Update offers so none reference purged destinations
    for (const o of OFFERS_TO_UPSERT) {
      await client.query(
        `INSERT INTO offers (id, code, title, discount_text, tag, valid_till, description, min_booking, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           code = EXCLUDED.code,
           title = EXCLUDED.title,
           discount_text = EXCLUDED.discount_text,
           tag = EXCLUDED.tag,
           valid_till = EXCLUDED.valid_till,
           description = EXCLUDED.description,
           min_booking = EXCLUDED.min_booking,
           image = EXCLUDED.image`,
        [o.id, o.code, o.title, o.discountText, o.tag, o.validTill, o.description, o.minBooking, o.image]
      )
    }
    await client.query(
      `DELETE FROM offers
       WHERE id NOT IN ('offer-early-summer', 'offer-honeymoon-perks', 'offer-family-escape')
         AND (
           description ~* 'kashmir|srinagar|kerala|munnar|rajasthan|udaipur|sikkim|gangtok|andaman|hampi|ladakh|goa'
           OR title ~* 'kashmir|srinagar|kerala|munnar|rajasthan|udaipur|sikkim|gangtok|andaman|hampi|ladakh|goa'
         )`
    )

    // 7. Also update storefront special cards / board feature if those tables exist and point to purged destinations
    const specialsTable = await client.query("SELECT to_regclass('public.homepage_specials') AS tbl")
    if (specialsTable.rows[0]?.tbl) {
      const specialUpdates = [
        {
          slotIndex: 1,
          badge: '3D/2N & 4D/3N departures',
          title: 'Manali & Solang Snow',
          description: 'Private cab excursions to Atal Tunnel, Solang Valley & Hidimba pine trails.',
          priceNum: 6999,
          image: '/Video/optimized/destination_himachal_poster.jpg',
          actionRoute: 'destination/manali',
          actionLabel: 'Explore Manali',
        },
        {
          slotIndex: 2,
          badge: 'Parvati Valley escapes',
          title: 'Kasol & Manikaran',
          description: 'Riverside stays in Kasol, Chalal pine walks & Manikaran hot springs.',
          priceNum: 8499,
          image: '/Video/optimized/destination_kinnaur_poster.jpg',
          actionRoute: 'destination/kasol',
          actionLabel: 'Explore Kasol',
        },
        {
          slotIndex: 3,
          badge: 'Heritage hills & Kufri',
          title: 'Shimla & Kufri Circuits',
          description: 'The Ridge, Mall Road, Christ Church & snowy Kufri paired with Manali.',
          priceNum: 10999,
          image: '/Video/optimized/destination_golden_peaks_poster.jpg',
          actionRoute: 'destination/shimla',
          actionLabel: 'Explore Shimla',
        },
        {
          slotIndex: 4,
          badge: 'All 18 PDF Circuits',
          title: 'Grand Himachal Combo',
          description: '5D/4N Manali, Kasol & Shimla routes for Couples, Families & Bachelors.',
          priceNum: 12999,
          image: '/Video/optimized/destination_adventure_poster.jpg',
          actionRoute: 'packages',
          actionLabel: 'View all packages',
        },
      ]
      for (const sp of specialUpdates) {
        await client.query(
          `UPDATE homepage_specials
           SET badge = $1,
               title = $2,
               description = $3,
               price_num = $4,
               image = $5,
               action_route = $6,
               action_label = $7,
               updated_at = NOW()
           WHERE slot_index = $8
             AND action_route NOT IN ('destination/manali', 'destination/kasol', 'destination/shimla', 'packages')`,
          [sp.badge, sp.title, sp.description, sp.priceNum, sp.image, sp.actionRoute, sp.actionLabel, sp.slotIndex]
        )
      }
    }

    const boardTable = await client.query("SELECT to_regclass('public.homepage_board_feature') AS tbl")
    if (boardTable.rows[0]?.tbl) {
      await client.query(`
        UPDATE homepage_board_feature
        SET kicker = 'Selected with mountain specialists',
            section_title = 'Travel boards recommend',
            partner_badge = '24/7 Telugu Concierge & Private Cabs',
            headline = 'Manali, Kasol & Shimla beyond the ordinary',
            description = 'Solang Valley snow points, Atal Tunnel, Parvati riverside stays in Kasol, and Kufri ridges crafted across 3D/2N, 4D/3N, and 5D/4N routes.',
            image = '/Video/optimized/destination_himachal_poster.jpg',
            action_route = 'destination/manali',
            action_label = 'Explore Manali',
            updated_at = NOW()
        WHERE action_route NOT IN ('destination/manali', 'destination/kasol', 'destination/shimla', 'packages')
      `)
    }

    await client.query('COMMIT')

    const destRows = await client.query(
      'SELECT slug, city, adventure_enabled, jsonb_array_length(customization_options) AS stops_count FROM destinations ORDER BY display_order ASC'
    )
    const pkgSummary = await client.query(`
      SELECT destination_slug, category, COUNT(*)::int AS count
      FROM packages
      GROUP BY destination_slug, category
      ORDER BY destination_slug, category
    `)
    const reelSummary = await client.query(`
      SELECT category, COUNT(*)::int AS count
      FROM instagram_reels
      GROUP BY category
      ORDER BY category
    `)

    console.log('Strict PDF-only seed completed cleanly!')
    console.log('Destinations:', destRows.rows)
    console.log('Packages by destination & category:', pkgSummary.rows)
    console.log('Reels by category:', reelSummary.rows)
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {})
    }
    console.error('Seed failed:', err)
    process.exitCode = 1
  } finally {
    if (client) {
      client.release()
    }
    await pool.end().catch(() => {})
  }
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exitCode = 1
})
