import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

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

const pool = new Pool(
  dbUrl
    ? {
        connectionString: dbUrl,
        ssl: isLocalUrl ? false : { rejectUnauthorized: false },
      }
    : {
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '0907',
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: process.env.PGDATABASE || 'crazy_tours_db',
      }
)

const HIMACHAL_EXCLUSIONS = [
  "All Adventure Activities",
  "4x4 Vehicles in Heavy Snowfall",
  "Train & flight tickets",
  "Any meal not mentioned in the inclusions",
  "Any entry fees and guide charges",
  "Any cost arising due to natural causes like landslides, road blocks, and political issues",
  "Personal expenses like laundry, luggage charges, and special self-ordered food",
  "Anything which is not included in the package inclusions"
]

const HIMACHAL_THINGS_TO_CARRY = [
  "Approved Government ID",
  "Prescribed medicine for winter",
  "Winter jacket & waterproof shoes",
  "One pair of gloves, winter cap, goggles & socks",
  "Power bank & mobile charger",
  "Little amount of cash in hand"
]

const HIMACHAL_CANCELLATION_POLICY = [
  "Registration charges are non-refundable.",
  "If cancellations are made within 7 days before the start date of the trip, 100% of booking value will be charged as cancellation fees.",
  "If cancelled 15 days before the start date of the trip, 50% of booking value will be charged as cancellation fees.",
  "In case of unforeseen weather conditions or government restrictions, certain activities may be cancelled and we will try our best to provide an alternate feasible activity; however, no refund will be provided for the same.",
  "In case of lockdown at the destination, a credit shell will be released for future bookings."
]

const DESTINATIONS_TO_UPSERT = [
  {
    slug: 'himachal',
    city: 'Himachal',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹6,999',
    priceNum: 6999,
    image: '/Video/optimized/destination_himachal_poster.jpg',
    season: 'All Year (Snow Jan–Mar, Meadow Apr–Jul)',
    duration: '3–5 days',
    tagline: 'Manali cedar valleys, Kasol riversides & snowy Atal Tunnel passes',
    description:
      'From honeymoon escapes in pine-wood cottages to bachelor road trips across Solang Valley, Atal Tunnel, Kasol, and Shimla—explore Himachal with private cabs and 24/7 Telugu concierge care.',
    highlights: [
      'Solang Valley snow point, Atal Tunnel & Sissu scenic excursion',
      'Kasol Parvati riverside cafés & Manikaran hot springs',
      'Shimla Ridge, Kufri peaks & Kullu Valley paragliding & rafting',
    ],
    gallery: [
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
      '/Instagram_videos/thumbnails/reel_05_poster.jpg',
    ],
    bestTimeToVisit: 'April to July for crisp alpine weather; December to March for Solang snowfall',
    idealFor: 'Couples, Families, Bachelors Squads & Adventure Seekers',
    isTrending: true,
    adventureEnabled: true,
    displayOrder: 7,
    nearestAirport: 'Bhuntar Airport (Kullu–Manali) / Chandigarh (IXC)',
    nearestRailway: 'Chandigarh Junction / Kalka Railway Station',
    recommendedStayDays: '3 to 5 days',
    peakSeason: 'Apr 16 – Jul 05 & Dec 16 – Jan 05',
    avgTemp: '-2°C to 22°C',
    permitRequired: false,
    permitDetails: '',
    clothingAdvice: 'Thermal innerwear, waterproof winter jacket, gloves, snow shoes & UV sunglasses',
    culturalNotes: 'Himachali temples observe modest footwear removal; local cafes in Old Manali and Kasol blend mountain warmth with Tibetan culture.',
    mustTryFood: ['Himachali Dham', 'Stuffed Siddu', 'Fresh River Trout', 'Tibetan Thukpa & Momos'],
    keyAttractions: [
      { name: 'Solang Valley & Atal Tunnel', type: 'Snow & Adventure' },
      { name: 'Hidimba Devi Temple & Old Manali', type: 'Heritage & Cafés' },
      { name: 'Kasol & Manikaran Sahib', type: 'Valley & Hot Springs' },
      { name: 'Shimla Mall Road & Kufri', type: 'Hill Heritage' },
    ],
    networkCoverage: 'Strong 4G/5G in Shimla, Manali & Kasol; intermittent past Atal Tunnel toward Sissu',
  },
  {
    slug: 'ladakh',
    city: 'Ladakh',
    country: 'Ladakh',
    state: 'Ladakh',
    region: 'North India',
    price: '₹18,999',
    priceNum: 18999,
    image: '/Video/optimized/destination_ladakh_poster.jpg',
    season: 'May to September',
    duration: '5–6 days',
    tagline: 'High mountain passes, desert dunes & turquoise Pangong shores',
    description:
      'Cross Khardung La into Nubra Valley, camp beside color-shifting Pangong Tso, and ride the Zanskar rapids on an expertly acclimatized Himalayan expedition.',
    highlights: [
      'Khardung La pass crossing & Nubra Valley Bactrian camel dunes',
      'Overnight star-lit glamping by Pangong Tso Lake',
      'Sangam Zanskar white-water rafting & cliffside monasteries',
    ],
    gallery: [
      '/Video/optimized/destination_ladakh_poster.jpg',
      '/Video/optimized/destination_ladakh_pass_poster.jpg',
      '/Instagram_videos/thumbnails/reel_04_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
    ],
    bestTimeToVisit: 'May to September (all high mountain passes open and crystal skies)',
    idealFor: 'Adventure Riders, Squads, Photographers & High-Altitude Explorers',
    isTrending: true,
    adventureEnabled: true,
    displayOrder: 8,
    nearestAirport: 'Kushok Bakula Rimpochee Airport, Leh (IXL)',
    nearestRailway: 'Jammu Tawi / Chandigarh (followed by Manali–Leh highway)',
    recommendedStayDays: '5 to 7 days',
    peakSeason: 'June to September',
    avgTemp: '2°C to 20°C',
    permitRequired: true,
    permitDetails: 'Inner Line Permit required for Nubra Valley, Pangong Tso & Turtuk (pre-arranged by Crazy Tours)',
    clothingAdvice: 'Layered down jacket, windproof shell, polarized sunglasses, lip balm & sturdy boots',
    culturalNotes: 'Respect monastic silence and spin prayer wheels clockwise; carry reusable bottles as Ladakh restricts single-use plastic.',
    mustTryFood: ['Ladakhi Thukpa', 'Skyu Pasta Stew', 'Salted Butter Tea', 'Fresh Apricot Jam & Momos'],
    keyAttractions: [
      { name: 'Pangong Tso Lake', type: 'Alpine Lake' },
      { name: 'Khardung La & Nubra Valley', type: 'High Pass & Dunes' },
      { name: 'Thiksey & Hemis Monasteries', type: 'Monastic Heritage' },
      { name: 'Sangam Zanskar Confluence', type: 'River Rafting' },
    ],
    networkCoverage: 'Postpaid SIMs only (BSNL, Airtel, Jio) work in Leh, Nubra & Pangong',
  },
]

const RAW_PACKAGES = [
  {
    "id": "himachal-bachelors-kullu-manali-3d2n",
    "slug": "himachal-bachelors-kullu-manali-3d2n",
    "title": "Kullu Manali Bachelor Trip (3D/2N)",
    "place": "Kullu Manali",
    "state": "Himachal Pradesh",
    "duration": "3 Days / 2 Nights",
    "daysCount": 3,
    "nightsCount": 2,
    "category": "Bachelors",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali",
    "summary": "An action-packed 3-day, 2-night bachelor getaway to Kullu and Manali with round-trip Delhi bus transfers and a dedicated personal taxi. Covers Manali temples and Mall Road, the Solang Valley & Atal Tunnel snow circuit, and Kullu adventure points with 24/7 Telugu support.",
    "brochurePdfUrl": "/Packages/3DAYS 2NIGHTS BACHELOR KULLU MANALI PACKAGE 2.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 6999,
          "seasonPrice": 10499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 7999,
          "seasonPrice": 11499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 8999,
          "seasonPrice": 12499
        }
      ]
    },
    "price": "₹6,999",
    "priceNum": 6999,
    "originalPrice": "₹10,499",
    "discount": "33% OFF",
    "rating": 4.9,
    "reviewCount": 68,
    "image": "/Video/optimized/destination_himachal_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg"
    ],
    "overview": "An action-packed 3-day, 2-night bachelor getaway to Kullu and Manali with round-trip Delhi bus transfers and a dedicated personal taxi. Covers Manali temples and Mall Road, the Solang Valley & Atal Tunnel snow circuit, and Kullu adventure points with 24/7 Telugu support.",
    "highlights": [
      "Round-trip Delhi–Manali bus tickets & 3 days personal taxi",
      "Manali local sightseeing: Hidimba Temple, Mall Road, Monastery, Club House & Van Vihar",
      "Snow Point excursion to Solang Valley, Atal Tunnel & Sissu/Koksar",
      "Kullu valley tour with optional Paragliding & River Rafting + Vaishno Devi Temple",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "2 nights hotel stay in Manali",
      "2 breakfasts and 2 dinners (Veg & Non-Veg)",
      "3 days sightseeing (Manali, Atal Tunnel, Kullu)",
      "3 days personal taxi",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, check out and explore Kullu. Enjoy optional adventure activities like Paragliding & River Rafting (not included in package), followed by a visit to Vaishno Devi Temple and Naggar Castle. Return to Manali to catch your evening bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kullu Sightseeing & Drop at Manali Bus Station for Return Bus to Delhi",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      }
    ],
    "theme": "Scenic",
    "featured": false
  },
  {
    "id": "himachal-family-kullu-manali-3d2n",
    "slug": "himachal-family-kullu-manali-3d2n",
    "title": "Kullu Manali Family Trip (3D/2N)",
    "place": "Kullu Manali",
    "state": "Himachal Pradesh",
    "duration": "3 Days / 2 Nights",
    "daysCount": 3,
    "nightsCount": 2,
    "category": "Family",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali",
    "summary": "A comfortable 3-day, 2-night family escape to Kullu and Manali featuring round-trip Delhi bus tickets, a private Swift taxi for sightseeing, and 2 nights of Manali hotel accommodation with daily breakfast and dinner.",
    "brochurePdfUrl": "/Packages/3DAYS 2NIGHTS FAMILY KULLU MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 7499,
          "seasonPrice": 10499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 8499,
          "seasonPrice": 11499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 9499,
          "seasonPrice": 10999
        }
      ]
    },
    "price": "₹7,499",
    "priceNum": 7499,
    "originalPrice": "₹10,499",
    "discount": "29% OFF",
    "rating": 4.8,
    "reviewCount": 85,
    "image": "/Video/optimized/destination_kinnaur_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg"
    ],
    "overview": "A comfortable 3-day, 2-night family escape to Kullu and Manali featuring round-trip Delhi bus tickets, a private Swift taxi for sightseeing, and 2 nights of Manali hotel accommodation with daily breakfast and dinner.",
    "highlights": [
      "Round-trip Delhi–Manali bus tickets & 3 days personal Swift taxi",
      "Family-friendly Manali sightseeing: Hidimba Temple, Mall Road, Monastery, Club House & Van Vihar",
      "Solang Valley, Atal Tunnel & Sissu/Koksar snow point excursion",
      "Kullu Vaishno Devi Temple & Naggar Castle visit",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "2 nights hotel stay in Manali",
      "2 breakfasts and 2 dinners (Veg & Non-Veg)",
      "3 days sightseeing (Manali, Atal Tunnel, Kullu)",
      "3 days personal taxi (Swift)",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, check out and explore Kullu. Enjoy optional adventure activities like Paragliding & River Rafting (not included in package), followed by a visit to Vaishno Devi Temple and Naggar Castle. Return to Manali to catch your evening bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kullu Sightseeing & Drop at Manali Bus Station for Return Bus to Delhi",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      }
    ],
    "theme": "Family",
    "featured": false
  },
  {
    "id": "himachal-couple-kullu-manali-3d2n",
    "slug": "himachal-couple-kullu-manali-3d2n",
    "title": "Kullu Manali Honeymoon Couple Trip (3D/2N)",
    "place": "Kullu Manali",
    "state": "Himachal Pradesh",
    "duration": "3 Days / 2 Nights",
    "daysCount": 3,
    "nightsCount": 2,
    "category": "Couple",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali",
    "summary": "A romantic 3-day, 2-night honeymoon package in Kullu and Manali priced per couple, complete with a candlelight dinner, honeymoon bed decoration with cake, round-trip Delhi bus tickets, and a personal taxi across all sightseeing spots.",
    "brochurePdfUrl": "/Packages/3DAYS 2NIGHTS HONEYMOON KULLU MANALI PACKAGE-1 (1).pdf",
    "pricingTiers": {
      "perUnit": "Per Couple",
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 17999,
          "seasonPrice": 25999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 19999,
          "seasonPrice": 27999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 22999,
          "seasonPrice": 30999
        }
      ]
    },
    "price": "₹17,999",
    "priceNum": 17999,
    "originalPrice": "₹25,999",
    "discount": "31% OFF",
    "rating": 4.9,
    "reviewCount": 102,
    "image": "/Video/optimized/destination_adventure_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg"
    ],
    "overview": "A romantic 3-day, 2-night honeymoon package in Kullu and Manali priced per couple, complete with a candlelight dinner, honeymoon bed decoration with cake, round-trip Delhi bus tickets, and a personal taxi across all sightseeing spots.",
    "highlights": [
      "1 night candlelight dinner & romantic honeymoon bed decoration with cake",
      "Round-trip Delhi–Manali bus tickets & 3 days personal taxi",
      "Manali local sightseeing including Hidimba Temple, Old Manali, Mall Road & Van Vihar",
      "Snow Point excursion to Solang Valley, Atal Tunnel & Sissu",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "2 nights hotel stay in Manali",
      "2 breakfasts and 2 dinners (Veg & Non-Veg)",
      "3 days sightseeing (Manali, Atal Tunnel, Kullu)",
      "3 days personal taxi",
      "One night candlelight dinner and honeymoon bed decoration with cake",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Old Manali",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, check out and explore Kullu. Enjoy optional adventure activities like Paragliding & River Rafting (not included in package), followed by a visit to Vaishno Devi Temple and Naggar Castle. Return to Manali to catch your evening bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kullu Sightseeing & Drop at Manali Bus Station for Return Bus to Delhi",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      }
    ],
    "theme": "Honeymoon",
    "featured": false
  },
  {
    "id": "himachal-bachelors-kasol-manali-4d3n",
    "slug": "himachal-bachelors-kasol-manali-4d3n",
    "title": "Kasol Manali Bachelor Trip (4D/3N)",
    "place": "Kasol Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Bachelors",
    "destinationSlug": "himachal",
    "routeSummary": "3N Manali",
    "summary": "A 4-day, 3-night bachelor tour covering Manali, Atal Tunnel, Kullu, and Kasol with 3 nights stay in Manali, round-trip Delhi bus tickets, and a personal cab throughout.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS BACHELOR KASOL MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 8499,
          "seasonPrice": 12999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 9499,
          "seasonPrice": 13999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 10999,
          "seasonPrice": 15499
        }
      ]
    },
    "price": "₹8,499",
    "priceNum": 8499,
    "originalPrice": "₹12,999",
    "discount": "35% OFF",
    "rating": 4.8,
    "reviewCount": 119,
    "image": "/Instagram_videos/thumbnails/reel_05_poster.jpg",
    "gallery": [
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg"
    ],
    "overview": "A 4-day, 3-night bachelor tour covering Manali, Atal Tunnel, Kullu, and Kasol with 3 nights stay in Manali, round-trip Delhi bus tickets, and a personal cab throughout.",
    "highlights": [
      "3 nights Manali stay with 4 full days of personal taxi sightseeing",
      "Manali local sightseeing, Solang Valley & Atal Tunnel snow excursion",
      "Kullu adventure activities (Paragliding & River Rafting optional) & Vaishno Devi Temple",
      "Full-day Kasol & Manikaran Sahib Gurudwara hot springs trip",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "3 nights hotel stay in Manali",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Kasol)",
      "4 days personal taxi",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, explore Kullu valley. Tourists can enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple before returning to the hotel in Manali for dinner and overnight rest.",
        "transfer": "Personal Taxi for Kullu Valley Sightseeing",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran",
        "description": "After breakfast, check out from the hotel and explore Kasol (Mini Israel of India, famous for riverside camping & cafes), Manikaran Temple dedicated to Lord Shiva & Parvati with medicinal hot springs, and Sahib Gurudwara. Later return to Manali to catch your bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kasol & Manikaran Excursion & Drop at Manali Bus Station",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Manikaran Temple",
          "Sahib Gurudwara",
          "Kasol Market"
        ]
      }
    ],
    "theme": "Scenic",
    "featured": false
  },
  {
    "id": "himachal-bachelors-shimla-manali-4d3n",
    "slug": "himachal-bachelors-shimla-manali-4d3n",
    "title": "Shimla Manali Bachelor Trip (4D/3N)",
    "place": "Shimla Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Bachelors",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Shimla",
    "summary": "A fast-paced 4-day, 3-night Shimla–Manali bachelor road trip conducted entirely by private cab from Delhi. Spans 2 nights in Manali and 1 night in Shimla, covering Solang Valley, Atal Tunnel, Kullu, Kufri, and Shimla Mall Road.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS BACHELOR SHIMLA MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 10999,
          "seasonPrice": 14999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 11999,
          "seasonPrice": 15999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 12999,
          "seasonPrice": 16999
        }
      ]
    },
    "price": "₹10,999",
    "priceNum": 10999,
    "originalPrice": "₹14,999",
    "discount": "27% OFF",
    "rating": 4.9,
    "reviewCount": 136,
    "image": "/Video/optimized/destination_kedarnath_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg"
    ],
    "overview": "A fast-paced 4-day, 3-night Shimla–Manali bachelor road trip conducted entirely by private cab from Delhi. Spans 2 nights in Manali and 1 night in Shimla, covering Solang Valley, Atal Tunnel, Kullu, Kufri, and Shimla Mall Road.",
    "highlights": [
      "Total tour by dedicated private cab from Delhi",
      "2 nights in Manali + 1 night in Shimla with 3 breakfasts & 3 dinners",
      "Solang Valley, Atal Tunnel & Sissu snow circuit plus Kullu adventure points",
      "Shimla sightseeing: Kufri, Mall Road, Jakhu Temple & Christ Church",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "2 nights hotel stay in Manali",
      "1 night hotel stay in Shimla",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Shimla)",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Drive to Shimla",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Afterward, start the scenic 8-hour drive to Shimla, check in, have dinner, and stay overnight in Shimla.",
        "transfer": "Private Cab from Manali via Kullu to Shimla (Approx. 8 Hours)",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla local attractions including Kufri, Mall Road, Jakhu Temple, and Christ Church. After sightseeing, begin the overnight return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Night Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return to Delhi)",
        "activities": [
          "Kufri",
          "Mall Road",
          "Jakhu Temple",
          "Christ Church"
        ]
      }
    ],
    "theme": "Scenic",
    "featured": false
  },
  {
    "id": "himachal-bachelors-kasol-manali-kasol-stay-4d3n",
    "slug": "himachal-bachelors-kasol-manali-kasol-stay-4d3n",
    "title": "Kasol Manali Bachelor Trip with Kasol Stay (4D/3N)",
    "place": "Kasol Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Bachelors",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Kasol",
    "summary": "A 4-day, 3-night bachelor adventure pairing 2 nights in Manali with an overnight hotel or camp stay in Kasol. Includes round-trip Delhi bus tickets, 4 days personal taxi, and guided coverage of Solang Valley, Atal Tunnel, Kullu, and Manikaran.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS BACHELOR WITH KASOL STAY.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 9499,
          "seasonPrice": 14499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 10499,
          "seasonPrice": 15499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 11499,
          "seasonPrice": 15999
        }
      ]
    },
    "price": "₹9,499",
    "priceNum": 9499,
    "originalPrice": "₹14,499",
    "discount": "34% OFF",
    "rating": 4.8,
    "reviewCount": 153,
    "image": "/Video/optimized/destination_himachal_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg"
    ],
    "overview": "A 4-day, 3-night bachelor adventure pairing 2 nights in Manali with an overnight hotel or camp stay in Kasol. Includes round-trip Delhi bus tickets, 4 days personal taxi, and guided coverage of Solang Valley, Atal Tunnel, Kullu, and Manikaran.",
    "highlights": [
      "2 nights hotel stay in Manali + 1 night riverside hotel/camp stay in Kasol",
      "Round-trip Delhi–Manali bus tickets & 4 days personal taxi",
      "Solang Valley, Atal Tunnel, Kullu adventure activities & Vaishno Devi Temple",
      "Kasol Market cafes, Manikaran hot springs & Sahib Gurudwara",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "2 nights hotel stay in Manali",
      "1 night stay in Kasol (hotel or camp)",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Kasol)",
      "4 days personal taxi",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Transfer to Kasol",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Later head out to Kasol hotel or camps for dinner and overnight stay.",
        "transfer": "Private Cab / Personal Taxi from Manali via Kullu to Kasol",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel or Camp Stay in Kasol",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran",
        "description": "After breakfast, check out from the hotel and explore Kasol (Mini Israel of India, famous for riverside camping & cafes), Manikaran Temple dedicated to Lord Shiva & Parvati with medicinal hot springs, and Sahib Gurudwara. Later return to Manali to catch your bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kasol & Manikaran Excursion & Drop at Manali Bus Station",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Manikaran Temple",
          "Sahib Gurudwara",
          "Kasol Market"
        ]
      }
    ],
    "theme": "Scenic",
    "featured": false
  },
  {
    "id": "himachal-family-kasol-manali-4d3n",
    "slug": "himachal-family-kasol-manali-4d3n",
    "title": "Kasol Manali Family Trip (4D/3N)",
    "place": "Kasol Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Family",
    "destinationSlug": "himachal",
    "routeSummary": "3N Manali",
    "summary": "A relaxing 4-day, 3-night Kasol–Manali family package based out of Manali for 3 nights, avoiding frequent hotel shifts. Includes Delhi–Manali round-trip bus tickets, personal cab for all 4 days, and visits to Solang Valley, Kullu, Kasol, and Manikaran.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS FAMILY KULLU MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 9499,
          "seasonPrice": 12999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 10499,
          "seasonPrice": 13999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 11499,
          "seasonPrice": 15999
        }
      ]
    },
    "price": "₹9,499",
    "priceNum": 9499,
    "originalPrice": "₹12,999",
    "discount": "27% OFF",
    "rating": 4.9,
    "reviewCount": 80,
    "image": "/Video/optimized/destination_kinnaur_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg"
    ],
    "overview": "A relaxing 4-day, 3-night Kasol–Manali family package based out of Manali for 3 nights, avoiding frequent hotel shifts. Includes Delhi–Manali round-trip bus tickets, personal cab for all 4 days, and visits to Solang Valley, Kullu, Kasol, and Manikaran.",
    "highlights": [
      "3 nights Manali hotel stay with 3 breakfasts & 3 dinners",
      "Round-trip Delhi–Manali bus tickets & 4 days personal taxi",
      "Manali local sightseeing, Solang Valley & Atal Tunnel snow circuit",
      "Kullu valley tour plus Day 4 excursion to Kasol & Manikaran Sahib",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "3 nights hotel stay in Manali",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Kasol)",
      "4 days personal taxi",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, explore Kullu valley. Tourists can enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple before returning to the hotel in Manali for dinner and overnight rest.",
        "transfer": "Personal Taxi for Kullu Valley Sightseeing",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran",
        "description": "After breakfast, check out from the hotel and explore Kasol (Mini Israel of India, famous for riverside camping & cafes), Manikaran Temple dedicated to Lord Shiva & Parvati with medicinal hot springs, and Sahib Gurudwara. Later return to Manali to catch your bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kasol & Manikaran Excursion & Drop at Manali Bus Station",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Manikaran Temple",
          "Sahib Gurudwara",
          "Kasol Market"
        ]
      }
    ],
    "theme": "Family",
    "featured": false
  },
  {
    "id": "himachal-family-kasol-manali-kasol-stay-4d3n",
    "slug": "himachal-family-kasol-manali-kasol-stay-4d3n",
    "title": "Kasol Manali Family Trip with Kasol Stay (4D/3N)",
    "place": "Kasol Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Family",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Kasol",
    "summary": "A 4-day, 3-night family itinerary combining 2 nights in Manali with 1 overnight stay in Kasol. Features round-trip Delhi bus tickets, a dedicated cab, and sightseeing across Manali, Solang Valley, Kullu, Kasol, and Manikaran.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS FAMILY MANALI WITH KASOL STAY-1.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 9999,
          "seasonPrice": 14499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 10999,
          "seasonPrice": 15499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 11999,
          "seasonPrice": 16499
        }
      ]
    },
    "price": "₹9,999",
    "priceNum": 9999,
    "originalPrice": "₹14,499",
    "discount": "31% OFF",
    "rating": 4.8,
    "reviewCount": 97,
    "image": "/Video/optimized/destination_adventure_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg"
    ],
    "overview": "A 4-day, 3-night family itinerary combining 2 nights in Manali with 1 overnight stay in Kasol. Features round-trip Delhi bus tickets, a dedicated cab, and sightseeing across Manali, Solang Valley, Kullu, Kasol, and Manikaran.",
    "highlights": [
      "2 nights in Manali + 1 night overnight stay in scenic Kasol",
      "Round-trip Delhi–Manali bus tickets & 4 days personal taxi",
      "Solang Valley, Atal Tunnel, Kullu adventure points & Vaishno Devi Temple",
      "Kasol riverside stay, Manikaran hot springs & Sahib Gurudwara",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "2 nights hotel stay in Manali",
      "1 night stay in Kasol (hotel or camp)",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Kasol)",
      "4 days personal taxi",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Transfer to Kasol",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Later head out to Kasol hotel or camps for dinner and overnight stay.",
        "transfer": "Private Cab / Personal Taxi from Manali via Kullu to Kasol",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel or Camp Stay in Kasol",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran",
        "description": "After breakfast, check out from the hotel and explore Kasol (Mini Israel of India, famous for riverside camping & cafes), Manikaran Temple dedicated to Lord Shiva & Parvati with medicinal hot springs, and Sahib Gurudwara. Later return to Manali to catch your bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kasol & Manikaran Excursion & Drop at Manali Bus Station",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Manikaran Temple",
          "Sahib Gurudwara",
          "Kasol Market"
        ]
      }
    ],
    "theme": "Family",
    "featured": false
  },
  {
    "id": "himachal-family-shimla-manali-4d3n",
    "slug": "himachal-family-shimla-manali-4d3n",
    "title": "Shimla Manali Family Trip (4D/3N)",
    "place": "Shimla Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Family",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Shimla",
    "summary": "A 4-day, 3-night Shimla–Manali family holiday travelling completely by private cab from Delhi. Includes 2 nights in Manali and 1 night in Shimla, covering Solang Valley, Atal Tunnel, Kullu, Kufri, and Shimla local heritage spots.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS FAMILY SHIMLA MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 10999,
          "seasonPrice": 14999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 11999,
          "seasonPrice": 15999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 13499,
          "seasonPrice": 17499
        }
      ]
    },
    "price": "₹10,999",
    "priceNum": 10999,
    "originalPrice": "₹14,999",
    "discount": "27% OFF",
    "rating": 4.9,
    "reviewCount": 114,
    "image": "/Instagram_videos/thumbnails/reel_05_poster.jpg",
    "gallery": [
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg"
    ],
    "overview": "A 4-day, 3-night Shimla–Manali family holiday travelling completely by private cab from Delhi. Includes 2 nights in Manali and 1 night in Shimla, covering Solang Valley, Atal Tunnel, Kullu, Kufri, and Shimla local heritage spots.",
    "highlights": [
      "Total tour by private cab from Delhi with 3 breakfasts & 3 dinners",
      "2 nights in Manali + 1 night in Shimla",
      "Solang Valley, Atal Tunnel, Sissu & Kullu Vaishno Devi Temple",
      "Shimla sightseeing covering Kufri, Mall Road, Jakhu Temple & Christ Church",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "2 nights hotel stay in Manali",
      "1 night hotel stay in Shimla",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Shimla)",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest. (Note: Day 1 slide is omitted in the brochure PDF; follows standard 2N Manali arrival & local sightseeing schedule.)",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Drive to Shimla",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Afterward, start the scenic 8-hour drive to Shimla, check in, have dinner, and stay overnight in Shimla.",
        "transfer": "Private Cab from Manali via Kullu to Shimla (Approx. 8 Hours)",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla local attractions including Kufri, Mall Road, Jakhu Temple, and Christ Church. After sightseeing, begin the overnight return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Night Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return to Delhi)",
        "activities": [
          "Kufri",
          "Mall Road",
          "Jakhu Temple",
          "Christ Church"
        ]
      }
    ],
    "theme": "Family",
    "featured": false
  },
  {
    "id": "himachal-couple-kasol-manali-4d3n",
    "slug": "himachal-couple-kasol-manali-4d3n",
    "title": "Kasol Manali Honeymoon Couple Trip (4D/3N)",
    "place": "Kasol Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Couple",
    "destinationSlug": "himachal",
    "routeSummary": "3N Manali",
    "summary": "A 4-day, 3-night Kasol–Manali honeymoon package priced per couple with 3 comfortable nights in Manali, a romantic candlelight dinner and bed decoration with cake, round-trip Delhi bus tickets, and 4 days of personal taxi sightseeing.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS HONEYMOON KASOL MANALI PACKAGE-1.pdf",
    "pricingTiers": {
      "perUnit": "Per Couple",
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 21999,
          "seasonPrice": 31999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 23999,
          "seasonPrice": 33999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 28499,
          "seasonPrice": 39499
        }
      ]
    },
    "price": "₹21,999",
    "priceNum": 21999,
    "originalPrice": "₹31,999",
    "discount": "31% OFF",
    "rating": 4.8,
    "reviewCount": 131,
    "image": "/Video/optimized/destination_kedarnath_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg"
    ],
    "overview": "A 4-day, 3-night Kasol–Manali honeymoon package priced per couple with 3 comfortable nights in Manali, a romantic candlelight dinner and bed decoration with cake, round-trip Delhi bus tickets, and 4 days of personal taxi sightseeing.",
    "highlights": [
      "1 night candlelight dinner & honeymoon bed decoration with cake",
      "3 nights Manali hotel stay with round-trip Delhi bus tickets & personal taxi",
      "Manali local sightseeing, Solang Valley & Atal Tunnel snow point",
      "Kullu adventure activities & Day 4 Kasol–Manikaran romantic excursion",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "3 nights hotel stay in Manali",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Kasol)",
      "4 days personal taxi",
      "One night candlelight dinner and honeymoon bed decoration with cake",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, explore Kullu valley. Tourists can enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple before returning to the hotel in Manali for dinner and overnight rest.",
        "transfer": "Personal Taxi for Kullu Valley Sightseeing",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran",
        "description": "After breakfast, check out from the hotel and explore Kasol (Mini Israel of India, famous for riverside camping & cafes), Manikaran Temple dedicated to Lord Shiva & Parvati with medicinal hot springs, and Sahib Gurudwara. Later return to Manali to catch your bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kasol & Manikaran Excursion & Drop at Manali Bus Station",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Manikaran Temple",
          "Sahib Gurudwara",
          "Kasol Market"
        ]
      }
    ],
    "theme": "Honeymoon",
    "featured": false
  },
  {
    "id": "himachal-couple-shimla-manali-4d3n",
    "slug": "himachal-couple-shimla-manali-4d3n",
    "title": "Shimla Manali Honeymoon Couple Trip (4D/3N)",
    "place": "Shimla Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Couple",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Shimla",
    "summary": "An intimate 4-day, 3-night Shimla–Manali honeymoon tour priced per couple with a private cab from Delhi, candlelight dinner, and honeymoon bed decoration with cake across 2 nights in Manali and 1 night in Shimla.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS HONEYMOON SHIMLA MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Couple",
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 31999,
          "seasonPrice": 44999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 33999,
          "seasonPrice": 46999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 39999,
          "seasonPrice": 50499
        }
      ]
    },
    "price": "₹31,999",
    "priceNum": 31999,
    "originalPrice": "₹44,999",
    "discount": "29% OFF",
    "rating": 4.9,
    "reviewCount": 148,
    "image": "/Video/optimized/destination_himachal_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg"
    ],
    "overview": "An intimate 4-day, 3-night Shimla–Manali honeymoon tour priced per couple with a private cab from Delhi, candlelight dinner, and honeymoon bed decoration with cake across 2 nights in Manali and 1 night in Shimla.",
    "highlights": [
      "Private cab throughout the entire Delhi–Manali–Shimla–Delhi route",
      "1 night candlelight dinner & honeymoon bed decoration with cake",
      "2 nights in Manali + 1 night in Shimla with 3 breakfasts & 3 dinners",
      "Solang Valley, Atal Tunnel, Kullu & Shimla Kufri–Mall Road sightseeing",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "2 nights hotel stay in Manali",
      "1 night hotel stay in Shimla",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Shimla)",
      "One night candlelight dinner and honeymoon bed decoration with cake",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Drive to Shimla",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Afterward, start the scenic 8-hour drive to Shimla, check in, have dinner, and stay overnight in Shimla.",
        "transfer": "Private Cab from Manali via Kullu to Shimla (Approx. 8 Hours)",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla local attractions including Kufri, Mall Road, Jakhu Temple, and Christ Church. After sightseeing, begin the overnight return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Night Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return to Delhi)",
        "activities": [
          "Kufri",
          "Mall Road",
          "Jakhu Temple",
          "Christ Church"
        ]
      }
    ],
    "theme": "Honeymoon",
    "featured": false
  },
  {
    "id": "himachal-couple-kasol-manali-kasol-stay-4d3n",
    "slug": "himachal-couple-kasol-manali-kasol-stay-4d3n",
    "title": "Kasol Manali Honeymoon Trip with Kasol Stay (4D/3N)",
    "place": "Kasol Manali",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Couple",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Kasol",
    "summary": "A 4-day, 3-night honeymoon escape priced per couple blending 2 nights in Manali with 1 cozy riverside night in Kasol. Includes candlelight dinner, honeymoon bed decoration with cake, round-trip Delhi bus tickets, and 4 days of personal taxi.",
    "brochurePdfUrl": "/Packages/4DAYS 3NIGHTS HONEYMOON WITH KASOL STAY.pdf",
    "pricingTiers": {
      "perUnit": "Per Couple",
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 23999,
          "seasonPrice": 33999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 25499,
          "seasonPrice": 35999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 29499,
          "seasonPrice": 40999
        }
      ]
    },
    "price": "₹23,999",
    "priceNum": 23999,
    "originalPrice": "₹33,999",
    "discount": "29% OFF",
    "rating": 4.8,
    "reviewCount": 75,
    "image": "/Video/optimized/destination_kinnaur_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg"
    ],
    "overview": "A 4-day, 3-night honeymoon escape priced per couple blending 2 nights in Manali with 1 cozy riverside night in Kasol. Includes candlelight dinner, honeymoon bed decoration with cake, round-trip Delhi bus tickets, and 4 days of personal taxi.",
    "highlights": [
      "2 nights in Manali + 1 night romantic hotel/camp stay in Kasol",
      "1 night candlelight dinner & honeymoon bed decoration with cake",
      "Round-trip Delhi–Manali bus tickets & 4 days personal taxi",
      "Solang Valley, Atal Tunnel, Kullu & Kasol–Manikaran hot springs",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Delhi to Manali round-trip bus tickets",
      "2 nights hotel stay in Manali",
      "1 night stay in Kasol (hotel or camp)",
      "3 breakfasts and 3 dinners (Veg & Non-Veg)",
      "4 days sightseeing (Manali, Atal Tunnel, Kullu, Kasol)",
      "4 days personal taxi",
      "One night candlelight dinner and honeymoon bed decoration with cake",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali Bus Station, meet the cab driver and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali Overnight Bus & Manali Bus Station Pickup by Personal Taxi",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Transfer to Kasol",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Later head out to Kasol hotel or camps for dinner and overnight stay.",
        "transfer": "Private Cab / Personal Taxi from Manali via Kullu to Kasol",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel or Camp Stay in Kasol",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran",
        "description": "After breakfast, check out from the hotel and explore Kasol (Mini Israel of India, famous for riverside camping & cafes), Manikaran Temple dedicated to Lord Shiva & Parvati with medicinal hot springs, and Sahib Gurudwara. Later return to Manali to catch your bus at Manali Bus Station.",
        "transfer": "Personal Taxi for Kasol & Manikaran Excursion & Drop at Manali Bus Station",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Manikaran Temple",
          "Sahib Gurudwara",
          "Kasol Market"
        ]
      }
    ],
    "theme": "Honeymoon",
    "featured": false
  },
  {
    "id": "himachal-family-shimla-manali-kasol-kasol-stay-5d4n",
    "slug": "himachal-family-shimla-manali-kasol-kasol-stay-5d4n",
    "title": "Shimla Manali Family Trip with Kasol Stay (5D/4N)",
    "place": "Shimla Manali & Kasol",
    "state": "Himachal Pradesh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Family",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Kasol • 1N Shimla",
    "summary": "Our flagship 5-day, 4-night family Himachal circuit by private cab covering Manali (2N), Kasol (1N), and Shimla (1N). Enjoy snow valleys, Kullu adventure stops, Manikaran hot springs, and Shimla heritage sights with 4 breakfasts and 4 dinners.",
    "brochurePdfUrl": "/Packages/5DAY 4NIGHTS FAMILY SHIMLA MANALI WITH KASOL STAY.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 13499,
          "seasonPrice": 17499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 14499,
          "seasonPrice": 18499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 17499,
          "seasonPrice": 20499
        }
      ]
    },
    "price": "₹13,499",
    "priceNum": 13499,
    "originalPrice": "₹17,499",
    "discount": "23% OFF",
    "rating": 4.9,
    "reviewCount": 92,
    "image": "/Video/optimized/destination_adventure_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg"
    ],
    "overview": "Our flagship 5-day, 4-night family Himachal circuit by private cab covering Manali (2N), Kasol (1N), and Shimla (1N). Enjoy snow valleys, Kullu adventure stops, Manikaran hot springs, and Shimla heritage sights with 4 breakfasts and 4 dinners.",
    "highlights": [
      "Complete Himachal tri-hub circuit: 2N Manali • 1N Kasol • 1N Shimla",
      "Total tour by private cab with 4 breakfasts & 4 dinners",
      "Solang Valley, Atal Tunnel, Kullu, Kasol cafes & Manikaran hot springs",
      "Shimla sightseeing covering Mall Road, Jakhu Temple, Christ Church & Kufri",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "2 nights hotel stay in Manali",
      "1 night hotel or camp stay in Kasol",
      "1 night hotel stay in Shimla",
      "4 breakfasts and 4 dinners (Veg & Non-Veg)",
      "5 days sightseeing (Manali, Solang Valley, Kullu, Kasol, Shimla)",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Transfer to Kasol",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Later head out to Kasol hotel or camps for dinner and overnight stay.",
        "transfer": "Private Cab / Personal Taxi from Manali via Kullu to Kasol",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel or Camp Stay in Kasol",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran - Drive to Shimla",
        "description": "After breakfast, check out from the Kasol stay and explore Kasol (Mini Israel of India), Manikaran Temple hot springs, and Sahib Gurudwara. Afterward, begin the 200 km (approx. 7 hours) scenic journey to Shimla for dinner and overnight stay.",
        "transfer": "Private Cab from Kasol / Manikaran to Shimla (200 km / Approx. 7 Hours)",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Kasol Market",
          "Manikaran Temple",
          "Sahib Gurudwara"
        ]
      },
      {
        "day": 5,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla Mall Road, Jakhu Temple, Christ Church, and Kufri. After sightseeing, start the return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Return Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Return to Delhi)",
        "activities": [
          "Jakhu Temple",
          "Mall Road",
          "Christ Church",
          "Kufri"
        ]
      }
    ],
    "theme": "Family",
    "featured": true
  },
  {
    "id": "himachal-bachelors-shimla-manali-5d4n",
    "slug": "himachal-bachelors-shimla-manali-5d4n",
    "title": "Shimla Manali Bachelor Trip (5D/4N)",
    "place": "Shimla Manali",
    "state": "Himachal Pradesh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Bachelors",
    "destinationSlug": "himachal",
    "routeSummary": "3N Manali • 1N Shimla",
    "summary": "A comprehensive 5-day, 4-night Shimla–Manali bachelor tour by private cab featuring 3 nights in Manali and 1 night in Shimla. Highlights include Atal Tunnel, Solang Valley, Kullu rafting & paragliding, Pandoh Dam en route, and Kufri.",
    "brochurePdfUrl": "/Packages/5DAYS 4NIGHTS BACHELOR SHIMLA MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 11999,
          "seasonPrice": 16499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 12999,
          "seasonPrice": 17499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 15999,
          "seasonPrice": 18499
        }
      ]
    },
    "price": "₹11,999",
    "priceNum": 11999,
    "originalPrice": "₹16,499",
    "discount": "27% OFF",
    "rating": 4.8,
    "reviewCount": 109,
    "image": "/Instagram_videos/thumbnails/reel_05_poster.jpg",
    "gallery": [
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg"
    ],
    "overview": "A comprehensive 5-day, 4-night Shimla–Manali bachelor tour by private cab featuring 3 nights in Manali and 1 night in Shimla. Highlights include Atal Tunnel, Solang Valley, Kullu rafting & paragliding, Pandoh Dam en route, and Kufri.",
    "highlights": [
      "Total tour by private cab with 3N Manali & 1N Shimla stay",
      "Manali local sightseeing, Solang Valley, Atal Tunnel & Kullu adventure activities",
      "Scenic Manali–Shimla drive featuring Pandoh Dam & Ropeway Point",
      "Shimla exploration: Mall Road, Jakhu Temple, Christ Church & Kufri",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "3 nights hotel stay in Manali",
      "1 night hotel stay in Shimla",
      "4 breakfasts and 4 dinners (Veg & Non-Veg)",
      "5 days sightseeing (Manali, Atal Tunnel, Kullu, Shimla)",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, explore Kullu valley. Tourists can enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple before returning to the hotel in Manali for dinner and overnight rest.",
        "transfer": "Personal Taxi for Kullu Valley Sightseeing",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Manali to Shimla via Pandoh Dam",
        "description": "After breakfast, check out from the Manali hotel and drive towards Shimla. En route visit Pandoh Dam for scenic views and photos, with optional ropeway activity nearby (Rs. 250 adult / Rs. 150 child). Reach Shimla by evening for dinner and overnight stay.",
        "transfer": "Private Cab from Manali to Shimla via Pandoh Dam",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Pandoh Dam",
          "Ropeway Point",
          "Shimla"
        ]
      },
      {
        "day": 5,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla Mall Road, Jakhu Temple, Christ Church, and Kufri. After sightseeing, start the return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Return Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Return to Delhi)",
        "activities": [
          "Jakhu Temple",
          "Mall Road",
          "Christ Church",
          "Kufri"
        ]
      }
    ],
    "theme": "Scenic",
    "featured": false
  },
  {
    "id": "himachal-bachelors-shimla-manali-kasol-kasol-stay-5d4n",
    "slug": "himachal-bachelors-shimla-manali-kasol-kasol-stay-5d4n",
    "title": "Shimla Manali Bachelor Trip with Kasol Stay (5D/4N)",
    "place": "Shimla Manali & Kasol",
    "state": "Himachal Pradesh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Bachelors",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Kasol • 1N Shimla",
    "summary": "The ultimate 5-day, 4-night bachelor expedition by private cab spanning Manali (2N), Kasol (1N), and Shimla (1N). Covers snow peaks, Kullu adventure sports, Kasol riverside vibes, Manikaran hot springs, and Shimla landmarks.",
    "brochurePdfUrl": "/Packages/5DAYS 4NIGHTS BACHELOR WITH KASOL STAY.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 12999,
          "seasonPrice": 16999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 13999,
          "seasonPrice": 17999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 16499,
          "seasonPrice": 19999
        }
      ]
    },
    "price": "₹12,999",
    "priceNum": 12999,
    "originalPrice": "₹16,999",
    "discount": "24% OFF",
    "rating": 4.9,
    "reviewCount": 126,
    "image": "/Video/optimized/destination_kedarnath_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg"
    ],
    "overview": "The ultimate 5-day, 4-night bachelor expedition by private cab spanning Manali (2N), Kasol (1N), and Shimla (1N). Covers snow peaks, Kullu adventure sports, Kasol riverside vibes, Manikaran hot springs, and Shimla landmarks.",
    "highlights": [
      "All-in-one Himachal bachelor trail: 2N Manali • 1N Kasol • 1N Shimla",
      "Private cab throughout with 4 breakfasts & 4 dinners",
      "Solang Valley, Atal Tunnel, Kullu adventure activities & Kasol camp/hotel night",
      "Manikaran hot springs, Sahib Gurudwara & Shimla Kufri–Mall Road sightseeing",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "2 nights hotel stay in Manali",
      "1 night hotel or camp stay in Kasol",
      "1 night hotel stay in Shimla",
      "4 breakfasts and 4 dinners (Veg & Non-Veg)",
      "5 days sightseeing (Manali, Solang Valley, Kullu, Kasol, Shimla)",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Transfer to Kasol",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Later head out to Kasol hotel or camps for dinner and overnight stay.",
        "transfer": "Private Cab / Personal Taxi from Manali via Kullu to Kasol",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel or Camp Stay in Kasol",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran - Drive to Shimla",
        "description": "After breakfast, check out from the Kasol stay and explore Kasol (Mini Israel of India), Manikaran Temple hot springs, and Sahib Gurudwara. Afterward, begin the 200 km (approx. 7 hours) scenic journey to Shimla for dinner and overnight stay.",
        "transfer": "Private Cab from Kasol / Manikaran to Shimla (200 km / Approx. 7 Hours)",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Kasol Market",
          "Manikaran Temple",
          "Sahib Gurudwara"
        ]
      },
      {
        "day": 5,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla Mall Road, Jakhu Temple, Christ Church, and Kufri. After sightseeing, start the return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Return Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Return to Delhi)",
        "activities": [
          "Jakhu Temple",
          "Mall Road",
          "Christ Church",
          "Kufri"
        ]
      }
    ],
    "theme": "Scenic",
    "featured": false
  },
  {
    "id": "himachal-family-shimla-manali-5d4n",
    "slug": "himachal-family-shimla-manali-5d4n",
    "title": "Shimla Manali Family Trip (5D/4N)",
    "place": "Shimla Manali",
    "state": "Himachal Pradesh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Family",
    "destinationSlug": "himachal",
    "routeSummary": "3N Manali • 1N Shimla",
    "summary": "A well-paced 5-day, 4-night family holiday across Manali (3N) and Shimla (1N) by private cab from Delhi. Enjoy Hidimba Temple, Solang Valley, Atal Tunnel, Kullu, Pandoh Dam, and Shimla Mall Road with 4 breakfasts and 4 dinners.",
    "brochurePdfUrl": "/Packages/5DAYS 4NIGHTS FAMILY SHIMLA MANALI PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 6,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 12499,
          "seasonPrice": 16499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 13499,
          "seasonPrice": 17499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 16499,
          "seasonPrice": 19999
        }
      ]
    },
    "price": "₹12,499",
    "priceNum": 12499,
    "originalPrice": "₹16,499",
    "discount": "24% OFF",
    "rating": 4.8,
    "reviewCount": 143,
    "image": "/Video/optimized/destination_himachal_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg"
    ],
    "overview": "A well-paced 5-day, 4-night family holiday across Manali (3N) and Shimla (1N) by private cab from Delhi. Enjoy Hidimba Temple, Solang Valley, Atal Tunnel, Kullu, Pandoh Dam, and Shimla Mall Road with 4 breakfasts and 4 dinners.",
    "highlights": [
      "Total tour by private cab with 3N Manali & 1N Shimla hotel stays",
      "4 breakfasts & 4 dinners (Veg & Non-Veg)",
      "Manali local sightseeing, Solang Valley, Atal Tunnel & Kullu Valley",
      "En-route Pandoh Dam & Ropeway Point stopovers plus Shimla & Kufri tour",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "3 nights hotel stay in Manali",
      "1 night hotel stay in Shimla",
      "4 breakfasts and 4 dinners (Veg & Non-Veg)",
      "5 days sightseeing (Manali, Atal Tunnel, Kullu, Shimla)",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, explore Kullu valley. Tourists can enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple before returning to the hotel in Manali for dinner and overnight rest.",
        "transfer": "Personal Taxi for Kullu Valley Sightseeing",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Manali to Shimla via Pandoh Dam",
        "description": "After breakfast, check out from the Manali hotel and drive towards Shimla. En route visit Pandoh Dam for scenic views and photos, with optional ropeway activity nearby (Rs. 250 adult / Rs. 150 child). Reach Shimla by evening for dinner and overnight stay.",
        "transfer": "Private Cab from Manali to Shimla via Pandoh Dam",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Pandoh Dam",
          "Ropeway Point",
          "Shimla"
        ]
      },
      {
        "day": 5,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla Mall Road, Jakhu Temple, Christ Church, and Kufri. After sightseeing, start the return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Return Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Return to Delhi)",
        "activities": [
          "Jakhu Temple",
          "Mall Road",
          "Christ Church",
          "Kufri"
        ]
      }
    ],
    "theme": "Family",
    "featured": true
  },
  {
    "id": "himachal-couple-shimla-manali-kasol-kasol-stay-5d4n",
    "slug": "himachal-couple-shimla-manali-kasol-kasol-stay-5d4n",
    "title": "Shimla Manali Honeymoon Trip with Kasol Stay (5D/4N)",
    "place": "Shimla Manali & Kasol",
    "state": "Himachal Pradesh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Couple",
    "destinationSlug": "himachal",
    "routeSummary": "2N Manali • 1N Kasol • 1N Shimla",
    "summary": "A signature 5-day, 4-night honeymoon package priced per couple, taking you by private cab through Manali (2N), Kasol (1N), and Shimla (1N). Includes a candlelight dinner, honeymoon bed decoration with cake, 4 breakfasts, and 4 dinners.",
    "brochurePdfUrl": "/Packages/5DAYS 4NIGHTS HONEYMOON SHIMLA MANALI WITH KASOL STAY.pdf",
    "pricingTiers": {
      "perUnit": "Per Couple",
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 38999,
          "seasonPrice": 49999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 40999,
          "seasonPrice": 51999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 44999,
          "seasonPrice": 56499
        }
      ]
    },
    "price": "₹38,999",
    "priceNum": 38999,
    "originalPrice": "₹49,999",
    "discount": "22% OFF",
    "rating": 4.9,
    "reviewCount": 70,
    "image": "/Video/optimized/destination_kinnaur_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg"
    ],
    "overview": "A signature 5-day, 4-night honeymoon package priced per couple, taking you by private cab through Manali (2N), Kasol (1N), and Shimla (1N). Includes a candlelight dinner, honeymoon bed decoration with cake, 4 breakfasts, and 4 dinners.",
    "highlights": [
      "Romantic 5-day private cab circuit: 2N Manali • 1N Kasol • 1N Shimla",
      "1 night candlelight dinner & honeymoon bed decoration with cake",
      "Solang Valley, Atal Tunnel, Kullu valley, Kasol & Manikaran hot springs",
      "Shimla sightseeing covering Mall Road, Jakhu Temple, Christ Church & Kufri",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "2 nights hotel stay in Manali",
      "1 night hotel or camp stay in Kasol",
      "1 night hotel stay in Shimla",
      "4 breakfasts and 4 dinners (Veg & Non-Veg)",
      "5 days sightseeing (Manali, Solang Valley, Kullu, Kasol, Shimla)",
      "One night candlelight dinner and honeymoon bed decoration with cake",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities - Transfer to Kasol",
        "description": "After breakfast, check out from the Manali hotel and explore Kullu. Enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple. Later head out to Kasol hotel or camps for dinner and overnight stay.",
        "transfer": "Private Cab / Personal Taxi from Manali via Kullu to Kasol",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel or Camp Stay in Kasol",
        "activities": [
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Kasol - Manikaran - Drive to Shimla",
        "description": "After breakfast, check out from the Kasol stay and explore Kasol (Mini Israel of India), Manikaran Temple hot springs, and Sahib Gurudwara. Afterward, begin the 200 km (approx. 7 hours) scenic journey to Shimla for dinner and overnight stay.",
        "transfer": "Private Cab from Kasol / Manikaran to Shimla (200 km / Approx. 7 Hours)",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Kasol Market",
          "Manikaran Temple",
          "Sahib Gurudwara"
        ]
      },
      {
        "day": 5,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla Mall Road, Jakhu Temple, Christ Church, and Kufri. After sightseeing, start the return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Return Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Return to Delhi)",
        "activities": [
          "Jakhu Temple",
          "Mall Road",
          "Christ Church",
          "Kufri"
        ]
      }
    ],
    "theme": "Honeymoon",
    "featured": true
  },
  {
    "id": "himachal-couple-shimla-manali-5d4n",
    "slug": "himachal-couple-shimla-manali-5d4n",
    "title": "Shimla Manali Honeymoon Couple Trip (5D/4N)",
    "place": "Shimla Manali",
    "state": "Himachal Pradesh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Couple",
    "destinationSlug": "himachal",
    "routeSummary": "3N Manali • 1N Shimla",
    "summary": "A serene 5-day, 4-night Shimla–Manali honeymoon tour priced per couple with private cab travel from Delhi, 3 nights in Manali, and 1 night in Shimla. Features candlelight dinner, honeymoon bed decoration with cake, Pandoh Dam views, and Kufri.",
    "brochurePdfUrl": "/Packages/5DAYS 4NIGHTS SHIMLA MANALI HONEYMOON PACKAGE.pdf",
    "pricingTiers": {
      "perUnit": "Per Couple",
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 35999,
          "seasonPrice": 47999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 37999,
          "seasonPrice": 49999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 43999,
          "seasonPrice": 55999
        }
      ]
    },
    "price": "₹35,999",
    "priceNum": 35999,
    "originalPrice": "₹47,999",
    "discount": "25% OFF",
    "rating": 4.8,
    "reviewCount": 87,
    "image": "/Video/optimized/destination_adventure_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg",
      "/Video/optimized/destination_kedarnath_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg"
    ],
    "overview": "A serene 5-day, 4-night Shimla–Manali honeymoon tour priced per couple with private cab travel from Delhi, 3 nights in Manali, and 1 night in Shimla. Features candlelight dinner, honeymoon bed decoration with cake, Pandoh Dam views, and Kufri.",
    "highlights": [
      "Total tour by private cab with 3N Manali & 1N Shimla stays",
      "1 night candlelight dinner & honeymoon bed decoration with cake",
      "Manali local sightseeing, Solang Valley, Atal Tunnel & Kullu Valley",
      "Scenic drive past Pandoh Dam & Ropeway Point plus Shimla & Kufri",
      "24/7 Telugu customer care support"
    ],
    "inclusions": [
      "Total tour by private cab (Delhi to Delhi)",
      "3 nights hotel stay in Manali",
      "1 night hotel stay in Shimla",
      "4 breakfasts and 4 dinners (Veg & Non-Veg)",
      "5 days sightseeing (Manali, Atal Tunnel, Kullu, Shimla)",
      "One night candlelight dinner and honeymoon bed decoration with cake",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Manali Local Sightseeing",
        "description": "Arrival at Manali from Delhi by private cab and transfer to hotel. Hotel check-in at 12:00 noon (early check-in subject to availability). Freshen up and explore Manali local sightseeing spots before returning to the hotel for dinner and overnight rest.",
        "transfer": "Delhi to Manali by Private Cab & Hotel Transfer",
        "meals": "Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Hidimba Temple",
          "Mall Road",
          "Monastery",
          "Club House",
          "Van Vihar"
        ]
      },
      {
        "day": 2,
        "title": "Snow Point - Atal Tunnel",
        "description": "After morning breakfast, head out to explore the Snow Point circuit covering Solang Valley, Atal Tunnel, and Sissu or Koksar. Enjoy optional snow adventure activities and panoramic snow-capped mountain views before returning to the hotel for dinner and overnight rest.",
        "transfer": "Personal Taxi for Solang Valley, Atal Tunnel & Sissu Excursion",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu",
          "Koksar"
        ],
        "seasonalNote": "From January 10, snow point visits are limited to Solang Valley only; if heavy snowfall occurs in Solang Valley, Manali local sightseeing may not be possible. From January 10 to March 15, Atal Tunnel & Sissu remain closed."
      },
      {
        "day": 3,
        "title": "Kullu & Adventure Activities",
        "description": "After breakfast, explore Kullu valley. Tourists can enjoy optional Paragliding & River Rafting (not included in package) and visit Vaishno Devi Temple before returning to the hotel in Manali for dinner and overnight rest.",
        "transfer": "Personal Taxi for Kullu Valley Sightseeing",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Manali",
        "activities": [
          "Naggar Castle",
          "Vaishno Devi Temple",
          "Paragliding",
          "River Rafting"
        ]
      },
      {
        "day": 4,
        "title": "Manali to Shimla via Pandoh Dam",
        "description": "After breakfast, check out from the Manali hotel and drive towards Shimla. En route visit Pandoh Dam for scenic views and photos, with optional ropeway activity nearby (Rs. 250 adult / Rs. 150 child). Reach Shimla by evening for dinner and overnight stay.",
        "transfer": "Private Cab from Manali to Shimla via Pandoh Dam",
        "meals": "Breakfast & Dinner",
        "hotel": "Hotel Stay in Shimla",
        "activities": [
          "Pandoh Dam",
          "Ropeway Point",
          "Shimla"
        ]
      },
      {
        "day": 5,
        "title": "Shimla Local Sightseeing & Departure",
        "description": "After breakfast, check out from the hotel and explore Shimla Mall Road, Jakhu Temple, Christ Church, and Kufri. After sightseeing, start the return journey to Delhi (approx. 10 hours).",
        "transfer": "Private Cab for Shimla Sightseeing & Return Journey to Delhi (Approx. 10 Hours)",
        "meals": "Breakfast",
        "hotel": "Check-out (Return to Delhi)",
        "activities": [
          "Jakhu Temple",
          "Mall Road",
          "Christ Church",
          "Kufri"
        ]
      }
    ],
    "theme": "Honeymoon",
    "featured": true
  },
  {
    "id": "himachal-adventure-solang-hampta-4d3n",
    "slug": "himachal-adventure-solang-hampta-4d3n",
    "title": "Manali, Solang & Atal Tunnel Snow Adventure (4D/3N)",
    "place": "Manali & Solang",
    "state": "Himachal Pradesh",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Adventure",
    "destinationSlug": "himachal",
    "routeSummary": "3N Manali",
    "summary": "A high-adrenaline 4-day Himachal adventure featuring Solang Valley ziplining and snow ATV rides, an Atal Tunnel & Sissu glacier expedition, Beas river rafting, and Kullu valley paragliding.",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 4,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 10999,
          "seasonPrice": 14999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 12499,
          "seasonPrice": 16499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 14499,
          "seasonPrice": 18499
        }
      ]
    },
    "price": "₹10,999",
    "priceNum": 10999,
    "originalPrice": "₹14,999",
    "discount": "27% OFF",
    "rating": 4.9,
    "reviewCount": 114,
    "image": "/Video/optimized/destination_adventure_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg"
    ],
    "overview": "A high-adrenaline 4-day Himachal adventure featuring Solang Valley ziplining and snow ATV rides, an Atal Tunnel & Sissu glacier expedition, Beas river rafting, and Kullu valley paragliding.",
    "highlights": [
      "Guided Jogini Waterfall ridge hike & Old Manali café trail",
      "Solang Valley adventure circuit, Atal Tunnel & Sissu snow excursion",
      "Kullu Beas River white-water rafting & Dobhi tandem paragliding session",
      "Round-trip Delhi–Manali Volvo bus & dedicated SUV sightseeing cab"
    ],
    "inclusions": [
      "Delhi to Manali round-trip Volvo AC semi-sleeper tickets",
      "3 nights adventure riverside camp / boutique hotel stay in Manali",
      "3 breakfasts and 3 dinners with bonfire evening",
      "Dedicated personal SUV/taxi for 4 days of adventure transfers",
      "1 tandem paragliding flight in Kullu & 7 km Beas River rafting stretch",
      "24/7 Telugu customer care & adventure trip coordinator"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrive Manali & Jogini Waterfall Ridge Hike",
        "description": "Arrive at Manali Bus Station, transfer to your riverside adventure camp/hotel, and freshen up. Set off on a guided forest trail past Vashisht Hot Springs to Jogini Waterfall before exploring Old Manali.",
        "transfer": "Delhi to Manali Overnight Volvo & Private Cab Pickup",
        "meals": "Dinner",
        "hotel": "Riverside Adventure Lodge, Manali",
        "activities": [
          "Vashisht Hot Springs",
          "Jogini Waterfall Hike",
          "Old Manali",
          "Hidimba Temple"
        ]
      },
      {
        "day": 2,
        "title": "Solang Valley Thrills, Atal Tunnel & Sissu Snow Trail",
        "description": "Head to Solang Valley for ropeway, ziplining, and ATV trails, then cross the iconic Atal Tunnel to Sissu Waterfall and Koksar snow fields in Lahaul Valley.",
        "transfer": "Private Cab Excursion via Solang & Atal Tunnel",
        "meals": "Breakfast & Dinner",
        "hotel": "Riverside Adventure Lodge, Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu Waterfall",
          "Koksar Snow Point"
        ],
        "seasonalNote": "From Jan 10 to Mar 15, Atal Tunnel & Sissu access depends on BRO snow clearance; Solang Valley snow sports operate daily."
      },
      {
        "day": 3,
        "title": "Hampta Mountain Pass Scenic Drive & Bonfire Night",
        "description": "Ascend the alpine switchbacks toward Sethan and Hampta valley viewpoints for photography and ridge walks. Return for an evening bonfire and acoustic session at camp.",
        "transfer": "4x4 / Cab Mountain Excursion to Sethan Dome & Hampta Viewpoint",
        "meals": "Breakfast & Dinner",
        "hotel": "Riverside Adventure Lodge, Manali",
        "activities": [
          "Sethan Valley",
          "Hampta Viewpoint",
          "Bonfire & Stargazing"
        ]
      },
      {
        "day": 4,
        "title": "Beas River Rafting & Kullu Valley Paragliding",
        "description": "Check out and drive to Kullu for a thrilling 7 km white-water rafting run on the Beas River followed by tandem paragliding at Dobhi. Evening drop at Manali Bus Station for return overnight bus.",
        "transfer": "Private Cab to Kullu Adventure Base & Drop at Manali Bus Stand",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Beas River Rafting",
          "Dobhi Paragliding",
          "Naggar Castle"
        ]
      }
    ],
    "theme": "Adventure",
    "featured": true
  },
  {
    "id": "himachal-adventure-kasol-kheerganga-5d4n",
    "slug": "himachal-adventure-kasol-kheerganga-5d4n",
    "title": "Kasol, Kheerganga Trek & Manali Rapids (5D/4N)",
    "place": "Kasol & Manali",
    "state": "Himachal Pradesh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Adventure",
    "destinationSlug": "himachal",
    "routeSummary": "1N Kasol • 1N Kheerganga Camp • 2N Manali",
    "summary": "Conquer the legendary Parvati Valley trek to Kheerganga alpine hot springs, explore Chalal and Manikaran, and finish with Solang snow trails and Beas rafting in Manali.",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 4,
      "offSeasonDates": "Jan 06 - Apr 15 & Jul 06 - Dec 15",
      "seasonDates": "Apr 16 - Jul 05 & Dec 16 - Jan 05",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 12999,
          "seasonPrice": 16999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 14499,
          "seasonPrice": 18499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 16999,
          "seasonPrice": 20999
        }
      ]
    },
    "price": "₹12,999",
    "priceNum": 12999,
    "originalPrice": "₹16,999",
    "discount": "24% OFF",
    "rating": 4.9,
    "reviewCount": 89,
    "image": "/Video/optimized/destination_kinnaur_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_kinnaur_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg",
      "/Video/optimized/destination_himachal_poster.jpg",
      "/Instagram_videos/thumbnails/reel_05_poster.jpg"
    ],
    "overview": "Conquer the legendary Parvati Valley trek to Kheerganga alpine hot springs, explore Chalal and Manikaran, and finish with Solang snow trails and Beas rafting in Manali.",
    "highlights": [
      "Guided 12 km forest trek from Barshaini to Kheerganga (9,700 ft) with overnight summit camp",
      "Natural geothermal hot-spring dip overlooking snow peaks",
      "Kasol Parvati riverside trail, Chalal suspension bridge & Manikaran Sahib",
      "Solang Valley & Atal Tunnel snow expedition + Beas River rafting"
    ],
    "inclusions": [
      "Delhi to Bhuntar/Kasol and Manali to Delhi overnight Volvo tickets",
      "1 night Kasol riverside camp, 1 night Kheerganga alpine dome camp, 2 nights Manali hotel",
      "4 breakfasts and 4 dinners (including hot mountain meals at Kheerganga)",
      "Certified local trek leader for Kheerganga expedition",
      "Private taxi for all Parvati Valley, Kullu & Manali sightseeing",
      "24/7 Telugu customer care support"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrive Kasol, Chalal Pine Walk & Parvati River",
        "description": "Transfer from Bhuntar to Kasol. Cross the Parvati suspension bridge to Chalal village, unwind at riverside cafés, and enjoy dinner by a bonfire.",
        "transfer": "Bhuntar Pickup to Kasol Riverside Camp by Private Taxi",
        "meals": "Dinner",
        "hotel": "Parvati Riverside Camp, Kasol",
        "activities": [
          "Kasol Market",
          "Chalal Forest Trail",
          "Parvati Riverbank"
        ]
      },
      {
        "day": 2,
        "title": "Barshaini to Kheerganga Summit Trek",
        "description": "Morning drive to Barshaini trek head. Trek 12 km past Rudra Nag waterfalls and pine canopies up to Kheerganga meadow. Soak in the natural hot water springs before stargazing at camp.",
        "transfer": "Private Cab to Barshaini + 5-Hour Guided Trek",
        "meals": "Breakfast & Dinner",
        "hotel": "Kheerganga Alpine Mountain Camp",
        "activities": [
          "Barshaini Trek",
          "Rudra Nag Waterfall",
          "Kheerganga Hot Springs"
        ]
      },
      {
        "day": 3,
        "title": "Descend Kheerganga, Manikaran & Drive to Manali",
        "description": "Trek back to Barshaini after sunrise breakfast, visit Manikaran Sahib Gurudwara hot springs, and take a scenic drive along the Beas River into Manali.",
        "transfer": "Descent Trek + Private Cab from Barshaini to Manali via Manikaran",
        "meals": "Breakfast & Dinner",
        "hotel": "Pine Valley Resort, Manali",
        "activities": [
          "Manikaran Sahib",
          "Kullu Valley Drive",
          "Mall Road Manali"
        ]
      },
      {
        "day": 4,
        "title": "Solang Valley, Atal Tunnel & Sissu Snow Point",
        "description": "Full-day high-altitude snow excursion to Solang Valley, Atal Tunnel, and Sissu village with optional skiing, tubing, and zipline adventures.",
        "transfer": "Private Taxi for Solang & Atal Tunnel Circuit",
        "meals": "Breakfast & Dinner",
        "hotel": "Pine Valley Resort, Manali",
        "activities": [
          "Solang Valley",
          "Atal Tunnel",
          "Sissu"
        ],
        "seasonalNote": "From Jan 10 to Mar 15, Atal Tunnel & Sissu may close during heavy snowfall; alternate Solang snow ridge activities apply."
      },
      {
        "day": 5,
        "title": "Beas River Rafting, Hidimba Temple & Departure",
        "description": "Morning visit to Hidimba Devi Temple and Van Vihar, followed by white-water rafting at Babeli/Kullu before catching your overnight Volvo back to Delhi.",
        "transfer": "Private Cab Sightseeing & Drop at Manali Bus Stand",
        "meals": "Breakfast",
        "hotel": "Check-out (Overnight Return Bus)",
        "activities": [
          "Hidimba Temple",
          "Beas River Rafting",
          "Vaishno Devi Temple"
        ]
      }
    ],
    "theme": "Adventure",
    "featured": false
  },
  {
    "id": "ladakh-adventure-nubra-pangong-5d4n",
    "slug": "ladakh-adventure-nubra-pangong-5d4n",
    "title": "Leh, Khardung La & Pangong High-Pass Expedition (5D/4N)",
    "place": "Leh, Nubra & Pangong",
    "state": "Ladakh",
    "duration": "5 Days / 4 Nights",
    "daysCount": 5,
    "nightsCount": 4,
    "category": "Adventure",
    "destinationSlug": "ladakh",
    "routeSummary": "2N Leh • 1N Nubra Valley • 1N Pangong Tso",
    "summary": "Cross one of the world's highest motorable passes at Khardung La, ride ATVs across Hunder white sand dunes in Nubra Valley, and camp under the Milky Way beside Pangong Tso.",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 4,
      "offSeasonDates": "Apr 15 - May 31 & Sep 16 - Oct 15",
      "seasonDates": "Jun 01 - Sep 15",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 18999,
          "seasonPrice": 22999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 21499,
          "seasonPrice": 25499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 24999,
          "seasonPrice": 29499
        }
      ]
    },
    "price": "₹18,999",
    "priceNum": 18999,
    "originalPrice": "₹22,999",
    "discount": "17% OFF",
    "rating": 4.9,
    "reviewCount": 132,
    "image": "/Video/optimized/destination_ladakh_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_ladakh_poster.jpg",
      "/Video/optimized/destination_ladakh_pass_poster.jpg",
      "/Instagram_videos/thumbnails/reel_04_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg"
    ],
    "overview": "Cross one of the world's highest motorable passes at Khardung La, ride ATVs across Hunder white sand dunes in Nubra Valley, and camp under the Milky Way beside Pangong Tso.",
    "highlights": [
      "Khardung La Pass (17,982 ft) high-altitude mountain crossing",
      "Hunder Sand Dunes ATV & double-humped Bactrian camel experience in Nubra",
      "Overnight luxury Swiss tent stay overlooking Pangong Tso Lake",
      "All Inner Line Permits, oxygen cylinder backup & local Ladakhi SUV included"
    ],
    "inclusions": [
      "4 nights handpicked stays (2N Leh boutique hotel, 1N Nubra camp, 1N Pangong lakefront camp)",
      "4 breakfasts and 4 dinners",
      "Private high-altitude Innova / Xylo SUV with experienced Ladakhi driver",
      "All Inner Line Permits & Ladakh environmental fees",
      "Portable oxygen cylinder & oximeter support in vehicle"
    ],
    "exclusions": [
      "Flights to/from Kushok Bakula Rimpochee Airport, Leh",
      "ATV quad biking, camel rides & river rafting charges",
      "Monastery entry tickets and personal lunches",
      "Any cost due to weather pass closures or landslides"
    ],
    "thingsToCarry": [
      "Original Government Photo ID (Passport / Aadhaar / Voter ID)",
      "Heavy down jacket, thermal layers & windproof gloves",
      "UV-400 polarized sunglasses, SPF 50+ sunscreen & lip balm",
      "Prescribed Diamox (consult doctor) & personal first-aid kit",
      "Postpaid mobile SIM (BSNL / Airtel / Jio) & power bank"
    ],
    "cancellationPolicy": [
      "Booking deposit is non-refundable.",
      "50% cancellation fee applies 15–29 days prior to arrival.",
      "100% cancellation fee applies within 14 days of departure.",
      "In case of flight cancellations or pass closures, alternate Leh-region routing is arranged."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrive Leh — Acclimatization & Shanti Stupa Sunset",
        "description": "Arrive at Leh Airport (11,500 ft) and transfer to your hotel. Rest for high-altitude acclimatization before a gentle evening visit to Shanti Stupa and Leh Main Bazaar.",
        "transfer": "Leh Airport Pickup by Private SUV",
        "meals": "Dinner",
        "hotel": "The Grand Dragon / Ladakhi Retreat, Leh",
        "activities": [
          "Acclimatization Rest",
          "Shanti Stupa",
          "Leh Market"
        ]
      },
      {
        "day": 2,
        "title": "Leh to Nubra Valley via Khardung La Pass",
        "description": "Cross snow-draped Khardung La Pass into the dramatic Nubra Valley. Visit Diskit Monastery's towering Maitreya Buddha before riding across Hunder silver sand dunes.",
        "transfer": "Private SUV via Khardung La (5–6 hrs)",
        "meals": "Breakfast & Dinner",
        "hotel": "Nubra Eco Retreat Camp, Hunder",
        "activities": [
          "Khardung La Pass",
          "Diskit Monastery",
          "Hunder Sand Dunes"
        ],
        "seasonalNote": "Khardung La crossings are best scheduled before noon for clear skies and smooth traffic."
      },
      {
        "day": 3,
        "title": "Nubra Valley to Pangong Tso via Shyok River",
        "description": "Follow the dramatic Shyok River gorge straight to the emerald-and-cobalt shores of Pangong Tso (14,270 ft). Watch sunset hues shift across the mountain lake.",
        "transfer": "Private SUV via Shyok Route (6–7 hrs)",
        "meals": "Breakfast & Dinner",
        "hotel": "Pangong Lakeside Swiss Camp",
        "activities": [
          "Shyok River Valley",
          "Pangong Tso Shore",
          "Stargazing Camp"
        ]
      },
      {
        "day": 4,
        "title": "Pangong Sunrise & Return to Leh via Chang La",
        "description": "Wake to golden light over Pangong Tso, cross Chang La Pass (17,586 ft), and stop at Thiksey Monastery and Rancho School on your return to Leh.",
        "transfer": "Private SUV via Chang La Pass (5–6 hrs)",
        "meals": "Breakfast & Dinner",
        "hotel": "The Grand Dragon / Ladakhi Retreat, Leh",
        "activities": [
          "Chang La Pass",
          "Thiksey Monastery",
          "Sindhu Ghat"
        ]
      },
      {
        "day": 5,
        "title": "Leh Departure",
        "description": "Early morning transfer to Leh Airport for your flight over the Zanskar peaks with unforgettable Himalayan memories.",
        "transfer": "Private SUV Drop at Leh Airport",
        "meals": "Breakfast",
        "hotel": "Check-out",
        "activities": [
          "Leh Airport Transfer"
        ]
      }
    ],
    "theme": "Adventure",
    "featured": true
  },
  {
    "id": "ladakh-adventure-zanskar-turtuk-6d5n",
    "slug": "ladakh-adventure-zanskar-turtuk-6d5n",
    "title": "Ladakh Ultimate Passes, Turtuk & Zanskar Rapids (6D/5N)",
    "place": "Leh, Turtuk & Pangong",
    "state": "Ladakh",
    "duration": "6 Days / 5 Nights",
    "daysCount": 6,
    "nightsCount": 5,
    "category": "Adventure",
    "destinationSlug": "ladakh",
    "routeSummary": "3N Leh • 1N Nubra Valley • 1N Pangong Tso",
    "summary": "Our flagship 6-day Ladakh adventure adding the Sham Valley Zanskar river rafting stretch, Magnetic Hill, and a thrilling day trip to Turtuk — India's northernmost Balti village.",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 4,
      "offSeasonDates": "Apr 15 - May 31 & Sep 16 - Oct 15",
      "seasonDates": "Jun 01 - Sep 15",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 22999,
          "seasonPrice": 27499
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 25999,
          "seasonPrice": 30499
        },
        {
          "name": "Premium",
          "offSeasonPrice": 29999,
          "seasonPrice": 34999
        }
      ]
    },
    "price": "₹22,999",
    "priceNum": 22999,
    "originalPrice": "₹27,499",
    "discount": "16% OFF",
    "rating": 4.9,
    "reviewCount": 76,
    "image": "/Video/optimized/destination_ladakh_pass_poster.jpg",
    "gallery": [
      "/Video/optimized/destination_ladakh_pass_poster.jpg",
      "/Instagram_videos/thumbnails/reel_04_poster.jpg",
      "/Video/optimized/destination_ladakh_poster.jpg",
      "/Video/optimized/destination_adventure_poster.jpg"
    ],
    "overview": "Our flagship 6-day Ladakh adventure adding the Sham Valley Zanskar river rafting stretch, Magnetic Hill, and a thrilling day trip to Turtuk — India's northernmost Balti village.",
    "highlights": [
      "Sangam Indus–Zanskar confluence white-water rafting & Magnetic Hill",
      "Excursion to Turtuk Balti border village near Siachen gateway",
      "Khardung La, Chang La, Diskit Monastery & Hunder Sand Dunes",
      "Overnight stay beside Pangong Tso with oxygen & permit support"
    ],
    "inclusions": [
      "5 nights boutique hotels & luxury mountain camps (3N Leh, 1N Nubra, 1N Pangong)",
      "5 breakfasts and 5 dinners",
      "Private SUV for all high-pass circuits + Zanskar rafting transfer",
      "Inner Line Permits, wildlife fees & oxygen cylinder backup"
    ],
    "exclusions": [
      "Airfare to/from Leh Airport",
      "Zanskar rafting gear fee, ATV & camel rides",
      "Monument entry fees and personal expenses"
    ],
    "thingsToCarry": [
      "Original Government Photo ID",
      "Heavy winter jacket, thermal layers & quick-dry rafting wear",
      "UV-400 sunglasses, sunscreen & sturdy hiking shoes",
      "Postpaid SIM card & portable power bank"
    ],
    "cancellationPolicy": [
      "Booking deposit is non-refundable.",
      "50% cancellation fee applies 15–29 days prior to arrival.",
      "100% cancellation fee applies within 14 days of departure."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrive Leh & Shanti Stupa Acclimatization",
        "description": "Airport pickup, full hydration and acclimatization rest, followed by an evening sunset walk at Shanti Stupa and Leh Palace viewpoint.",
        "transfer": "Leh Airport Pickup by Private SUV",
        "meals": "Dinner",
        "hotel": "Ladakhi Heritage Hotel, Leh",
        "activities": [
          "Shanti Stupa",
          "Leh Palace Viewpoint",
          "Leh Market"
        ]
      },
      {
        "day": 2,
        "title": "Sham Valley, Magnetic Hill & Zanskar River Rafting",
        "description": "Drive along the Indus River to Hall of Fame, Gurudwara Pathar Sahib, Magnetic Hill, and Sangam confluence for Grade II–III Zanskar river rafting.",
        "transfer": "Private SUV Sham Valley Circuit",
        "meals": "Breakfast & Dinner",
        "hotel": "Ladakhi Heritage Hotel, Leh",
        "activities": [
          "Magnetic Hill",
          "Sangam Confluence",
          "Zanskar River Rafting",
          "Hall of Fame"
        ]
      },
      {
        "day": 3,
        "title": "Leh to Nubra Valley via Khardung La & Turtuk Excursion",
        "description": "Cross Khardung La early morning into Nubra Valley. Continue along the Shyok river canyon to historic Turtuk village before returning to Hunder dunes for the night.",
        "transfer": "Private SUV via Khardung La to Hunder & Turtuk",
        "meals": "Breakfast & Dinner",
        "hotel": "Nubra Luxury Desert Camp, Hunder",
        "activities": [
          "Khardung La Pass",
          "Turtuk Village",
          "Hunder Sand Dunes"
        ]
      },
      {
        "day": 4,
        "title": "Diskit Monastery & Shyok Drive to Pangong Tso",
        "description": "Morning visit to Diskit Monastery, then follow the rugged Shyok valley road to Pangong Tso for an unforgettable star-filled lakeside camp night.",
        "transfer": "Private SUV via Shyok Gorge",
        "meals": "Breakfast & Dinner",
        "hotel": "Pangong Lakeside Camp",
        "activities": [
          "Diskit Monastery",
          "Shyok Gorge",
          "Pangong Tso"
        ]
      },
      {
        "day": 5,
        "title": "Pangong Sunrise to Leh via Chang La Pass",
        "description": "Enjoy sunrise reflections on Pangong Tso and drive back over Chang La Pass, stopping at Hemis or Thiksey Monastery en route to Leh.",
        "transfer": "Private SUV via Chang La Pass",
        "meals": "Breakfast & Dinner",
        "hotel": "Ladakhi Heritage Hotel, Leh",
        "activities": [
          "Chang La Pass",
          "Thiksey Monastery",
          "Hemis Monastery"
        ]
      },
      {
        "day": 6,
        "title": "Departure from Leh",
        "description": "Morning breakfast and private drop to Leh Airport.",
        "transfer": "Private SUV Drop at Leh Airport",
        "meals": "Breakfast",
        "hotel": "Check-out",
        "activities": [
          "Leh Airport Transfer"
        ]
      }
    ],
    "theme": "Adventure",
    "featured": false
  },
  {
    "id": "andaman-adventure-scuba-kayaking-4d3n",
    "slug": "andaman-adventure-scuba-kayaking-4d3n",
    "title": "Havelock Scuba, Coral Reefs & Night Kayaking (4D/3N)",
    "place": "Port Blair & Havelock",
    "state": "Andaman & Nicobar Islands",
    "duration": "4 Days / 3 Nights",
    "daysCount": 4,
    "nightsCount": 3,
    "category": "Adventure",
    "destinationSlug": "andaman",
    "routeSummary": "1N Port Blair • 2N Havelock",
    "summary": "A compact 4-day ocean-adventure escape centered on Havelock Island: PADI-guided shore scuba diving, bioluminescent night mangrove kayaking, and Elephant Beach reef water sports.",
    "pricingTiers": {
      "perUnit": "Per Person",
      "minPax": 2,
      "offSeasonDates": "Jun 01 - Sep 30",
      "seasonDates": "Oct 01 - May 31",
      "tiers": [
        {
          "name": "Standard",
          "offSeasonPrice": 17499,
          "seasonPrice": 21999
        },
        {
          "name": "Standard Plus",
          "offSeasonPrice": 20499,
          "seasonPrice": 24999
        },
        {
          "name": "Premium",
          "offSeasonPrice": 24999,
          "seasonPrice": 29999
        }
      ]
    },
    "price": "₹17,499",
    "priceNum": 17499,
    "originalPrice": "₹21,999",
    "discount": "20% OFF",
    "rating": 4.9,
    "reviewCount": 108,
    "image": "/catalog-photos/radhanagar-beach.jpg",
    "gallery": [
      "/catalog-photos/radhanagar-beach.jpg",
      "/Video/optimized/hero_soul_travel_poster.jpg",
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=800&q=85"
    ],
    "overview": "A compact 4-day ocean-adventure escape centered on Havelock Island: PADI-guided shore scuba diving, bioluminescent night mangrove kayaking, and Elephant Beach reef water sports.",
    "highlights": [
      "PADI-certified Discover Scuba Dive session at Nemo Reef with underwater video",
      "Guided bioluminescent night kayaking through Havelock mangrove creeks",
      "Elephant Beach speedboat transfer, reef snorkeling & Radhanagar sunset",
      "High-speed private catamaran ferry (Makruzz / Nautika) between islands"
    ],
    "inclusions": [
      "3 nights beachfront resort stay (1N Port Blair, 2N Havelock Island)",
      "Daily breakfast + welcome island refreshments",
      "1 Discover Scuba Dive session + 1 guided mangrove kayaking excursion",
      "Round-trip Makruzz / Nautika high-speed ferry tickets",
      "All private AC cab transfers at Port Blair & Havelock"
    ],
    "exclusions": [
      "Flights to and from Veer Savarkar International Airport, Port Blair",
      "Optional parasailing, jet-ski & sea-walk water sports at Elephant Beach",
      "Lunches, dinners & personal expenses"
    ],
    "thingsToCarry": [
      "Original Government Photo ID (mandatory for ferry boarding)",
      "Quick-dry swimwear, reef-safe sunscreen & waterproof phone pouch",
      "Polarized sunglasses, beach sandals & light cotton layers",
      "Motion sickness tablets if sensitive to sea crossings"
    ],
    "cancellationPolicy": [
      "Ferry & scuba permit charges are non-refundable once issued.",
      "50% cancellation fee applies 15 days prior to departure.",
      "100% cancellation fee applies within 7 days of departure.",
      "Water activities are subject to Coast Guard & sea weather clearance."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrive Port Blair, Corbyn's Cove & Cellular Jail",
        "description": "Arrive at Port Blair Airport and transfer to your hotel. Enjoy coastal breezes at Corbyn's Cove Beach before attending the evening Cellular Jail Light & Sound Show.",
        "transfer": "Private AC Cab Airport Pickup & Sightseeing",
        "meals": "Breakfast (from Day 2)",
        "hotel": "SeaShell / Symphony Samudra, Port Blair",
        "activities": [
          "Corbyn's Cove Beach",
          "Cellular Jail Light & Sound Show"
        ]
      },
      {
        "day": 2,
        "title": "Ferry to Havelock, Radhanagar Sunset & Night Kayaking",
        "description": "Board the morning catamaran to Havelock Island. Relax on the white sands of Radhanagar Beach at sunset, then paddle through glowing bioluminescent mangroves after dark.",
        "transfer": "Private Cab + High-Speed Catamaran to Havelock",
        "meals": "Breakfast",
        "hotel": "Havelock Island Beach Resort",
        "activities": [
          "Makruzz Ferry",
          "Radhanagar Beach",
          "Bioluminescent Night Kayaking"
        ],
        "seasonalNote": "Bioluminescence brightness varies by lunar phase; new-moon evenings offer the strongest glow."
      },
      {
        "day": 3,
        "title": "PADI Scuba Dive at Nemo Reef & Elephant Beach Snorkeling",
        "description": "Begin with a PADI-certified Discover Scuba session among vibrant staghorn corals at Nemo Reef, followed by a speedboat ride to Elephant Beach for snorkeling and sea sports.",
        "transfer": "Local Cab + Speedboat to Elephant Beach",
        "meals": "Breakfast",
        "hotel": "Havelock Island Beach Resort",
        "activities": [
          "Nemo Reef Scuba Dive",
          "Elephant Beach Speedboat",
          "Coral Snorkeling"
        ]
      },
      {
        "day": 4,
        "title": "Return Catamaran to Port Blair & Departure",
        "description": "Catch the morning ferry back to Port Blair and transfer directly to the airport for your return flight.",
        "transfer": "High-Speed Catamaran + Private Cab to Port Blair Airport",
        "meals": "Breakfast",
        "hotel": "Check-out",
        "activities": [
          "Havelock to Port Blair Ferry",
          "Airport Transfer"
        ]
      }
    ],
    "theme": "Adventure",
    "featured": false
  }
]

const PACKAGES_TO_UPSERT = RAW_PACKAGES.map((p) => ({
  ...p,
  exclusions: p.exclusions || HIMACHAL_EXCLUSIONS,
  thingsToCarry: p.thingsToCarry || HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: p.cancellationPolicy || HIMACHAL_CANCELLATION_POLICY,
}))

async function run() {
  const client = await pool.connect()
  try {
    console.log('Ensuring schema columns for destinations and packages...')
    await client.query(`
      ALTER TABLE destinations ADD COLUMN IF NOT EXISTS adventure_enabled BOOLEAN DEFAULT FALSE;
      ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS slug VARCHAR(120),
        ADD COLUMN IF NOT EXISTS nights_count INTEGER,
        ADD COLUMN IF NOT EXISTS category VARCHAR(60),
        ADD COLUMN IF NOT EXISTS destination_slug VARCHAR(120),
        ADD COLUMN IF NOT EXISTS route_summary TEXT,
        ADD COLUMN IF NOT EXISTS summary TEXT,
        ADD COLUMN IF NOT EXISTS brochure_pdf_url TEXT,
        ADD COLUMN IF NOT EXISTS pricing_tiers JSONB,
        ADD COLUMN IF NOT EXISTS things_to_carry JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS cancellation_policy JSONB DEFAULT '[]'::jsonb;
      CREATE INDEX IF NOT EXISTS idx_packages_destination_category ON packages(destination_slug, category);
    `)

    await client.query('BEGIN')

    for (const d of DESTINATIONS_TO_UPSERT) {
      await client.query(
        `INSERT INTO destinations (
          slug, city, country, state, region, price, price_num, image, season, duration, tagline, description,
          highlights, gallery, best_time_to_visit, ideal_for, is_trending, adventure_enabled, display_order,
          nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp,
          permit_required, permit_details, clothing_advice, cultural_notes,
          must_try_food, key_attractions, network_coverage
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24,
          $25, $26, $27, $28,
          $29, $30, $31
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
          d.slug, d.city, d.country, d.state, d.region, d.price, d.priceNum, d.image, d.season, d.duration,
          d.tagline, d.description, JSON.stringify(d.highlights), JSON.stringify(d.gallery),
          d.bestTimeToVisit, d.idealFor, d.isTrending, d.adventureEnabled, d.displayOrder,
          d.nearestAirport, d.nearestRailway, d.recommendedStayDays, d.peakSeason, d.avgTemp,
          d.permitRequired, d.permitDetails, d.clothingAdvice, d.culturalNotes,
          JSON.stringify(d.mustTryFood), JSON.stringify(d.keyAttractions), d.networkCoverage,
        ]
      )
    }

    // Ensure Andaman destination has adventure_enabled = TRUE
    await client.query(`UPDATE destinations SET adventure_enabled = TRUE WHERE slug = 'andaman'`)

    // Enrich any existing legacy package rows with destination_slug, category, and nights_count
    const legacyLinks = [
      { ids: ['kashmir-tulips'], destinationSlug: 'srinagar', category: 'Couple' },
      { ids: ['kerala-backwaters', 'kerala-tea-trails'], destinationSlug: 'munnar', category: 'Family' },
      { ids: ['rajasthan-royals', 'rajasthan-royal'], destinationSlug: 'udaipur', category: 'Family' },
      { ids: ['andaman-paradise', 'andaman-coral-retreat'], destinationSlug: 'andaman', category: 'Adventure' },
      { ids: ['sikkim-himalaya', 'sikkim-monasteries'], destinationSlug: 'gangtok', category: 'Family' },
    ]
    for (const link of legacyLinks) {
      await client.query(
        `UPDATE packages
         SET destination_slug = COALESCE(destination_slug, $1),
             category = COALESCE(category, $2),
             nights_count = COALESCE(nights_count, GREATEST(0, days_count - 1))
         WHERE id = ANY($3::text[])`,
        [link.destinationSlug, link.category, link.ids]
      )
    }

    for (const p of PACKAGES_TO_UPSERT) {
      await client.query(
        `INSERT INTO packages (
          id, slug, title, place, state, duration, days_count, nights_count,
          category, destination_slug, route_summary, summary, brochure_pdf_url,
          pricing_tiers, things_to_carry, cancellation_policy,
          price, price_num, original_price, discount,
          rating, review_count, image, gallery, overview,
          highlights, inclusions, exclusions, itinerary, theme, featured
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13,
          $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23, $24, $25,
          $26, $27, $28, $29, $30, $31
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
          p.slug || p.id,
          p.title,
          p.place,
          p.state,
          p.duration,
          p.daysCount,
          p.nightsCount,
          p.category,
          p.destinationSlug,
          p.routeSummary,
          p.summary,
          p.brochurePdfUrl || null,
          JSON.stringify(p.pricingTiers || null),
          JSON.stringify(p.thingsToCarry || []),
          JSON.stringify(p.cancellationPolicy || []),
          p.price,
          p.priceNum,
          p.originalPrice || '',
          p.discount || '',
          p.rating ?? 4.8,
          p.reviewCount ?? 80,
          p.image,
          JSON.stringify(p.gallery || []),
          p.overview || p.summary || '',
          JSON.stringify(p.highlights || []),
          JSON.stringify(p.inclusions || []),
          JSON.stringify(p.exclusions || []),
          JSON.stringify(p.itinerary || []),
          p.theme,
          Boolean(p.featured),
        ]
      )
    }

    await client.query('COMMIT')

    const destCount = await client.query('SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE adventure_enabled) ::int AS adventure FROM destinations')
    const pkgSummary = await client.query(`
      SELECT category, COUNT(*)::int AS count
      FROM packages
      GROUP BY category
      ORDER BY category
    `)
    console.log('Seed completed cleanly!')
    console.log('Destinations:', destCount.rows[0])
    console.log('Packages by category:', pkgSummary.rows)
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('Seed failed:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

run()
