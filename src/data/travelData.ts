import {
  Currency,
  CurrencyConfig,
  DestinationCustomizationStop,
  DestinationItem,
  FAQItem,
  InstagramReelItem,
  OfferItem,
  OfficeLocation,
  PackageItem,
  ReviewItem,
  RoadTripItem,
  StayItem,
  StoryItem,
} from '../types/travel'
import socialHimachal from '../assets/wayfare-social-himachal.png'

export const CURRENCY_RATES: Record<Currency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 0.012 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095 },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044 },
}

export function formatPrice(priceInINR: number, currency: Currency = 'INR'): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR
  const converted = Math.round(priceInINR * config.rate)
  if (currency === 'INR') {
    return `₹${priceInINR.toLocaleString('en-IN')}`
  }
  return `${config.symbol}${converted.toLocaleString('en-US')}`
}

export const services = [
  { name: 'Holidays', route: 'home', icon: 'compass' as const },
  { name: 'Tour Packages', route: 'packages', icon: 'flight' as const },
  { name: 'Stays', route: 'stays', icon: 'hotel' as const },
  { name: 'Road Trips', route: 'road-trips', icon: 'car' as const },
  { name: 'Travel Stories', route: 'stories', icon: 'sparkle' as const },
  { name: 'Crazy Offers', route: 'offers', icon: 'tag' as const },
]

export const heroSlides = [
  {
    image: socialHimachal,
    eyebrow: 'Snow peaks & cedar valleys',
    title: 'Manali, Solang & Atal Tunnel.',
    copy: 'Private cabs from Delhi, boutique mountain stays, and 24/7 Telugu concierge care across Kullu, Manali, and Sissu.',
    location: 'Manali & Kullu Valley, Himachal Pradesh',
    actionRoute: 'destination/manali',
  },
  {
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
    eyebrow: 'Parvati riverside escape',
    title: 'Slow mornings in Kasol & Manikaran.',
    copy: 'Pine forest trails, riverside cafés, geothermal hot springs at Manikaran Sahib, and cosy valley camps.',
    location: 'Kasol & Parvati Valley, Himachal Pradesh',
    actionRoute: 'destination/kasol',
  },
  {
    image: '/Video/optimized/destination_adventure_poster.jpg',
    eyebrow: 'Colonial ridges & pine hills',
    title: 'Shimla, Kufri & Grand Himachal Circuits.',
    copy: 'Heritage Mall Road walks, Jakhu hilltops, Pandoh Dam scenic drives, and seamless 4D/3N and 5D/4N routes.',
    location: 'Shimla & Kufri, Himachal Pradesh',
    actionRoute: 'destination/shimla',
  },
]

export const popularDestinations: string[] = ['Manali', 'Kasol', 'Shimla']

export const DEFAULT_MANALI_CUSTOMIZATION_STOPS: DestinationCustomizationStop[] = [
  {
    id: 'dharamshala',
    name: 'Dharamshala',
    subtitle: 'McLeod Ganj, Dalai Lama Temple & tea estates',
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
      'Panchpula & St. John’s colonial heritage walk',
    ],
    allowedDurations: ['3D/2N', '4D/3N', '5D/4N'],
    image: '/Video/optimized/destination_himachal_poster.jpg',
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    subtitle: 'Sukhna Lake, Rock Garden & transit break',
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
    subtitle: 'Golden Temple & Wagah Border ceremony',
    extraDays: 1,
    extraNights: 1,
    priceDelta: 3000,
    highlights: [
      'Sri Harmandir Sahib (Golden Temple) darshan',
      'Attari–Wagah Border Beating Retreat ceremony',
      'Jallianwala Bagh & Amritsari kulcha heritage trail',
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
    subtitle: 'Sainj Valley meadows & wooden heritage temple',
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

export const nationalDestinations: DestinationItem[] = [
  {
    slug: 'manali',
    city: 'Manali',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹6,999',
    priceNum: 6999,
    image: socialHimachal,
    season: 'All Year (Snow Jan–Mar, Meadow Apr–Jul)',
    duration: '3–5 days',
    tagline: 'Kullu valleys, Solang snow slopes & Atal Tunnel passes',
    videoUrl: '/Video/optimized/destination_himachal.mp4',
    posterUrl: '/Video/optimized/destination_himachal_poster.jpg',
    description:
      'Explore Manali, Solang Valley, Atal Tunnel, Sissu, and Kullu with private cabs, Delhi Volvo or cab transfers, curated stays, and 24/7 Telugu customer care across 3D/2N, 4D/3N, and 5D/4N packages.',
    highlights: [
      'Manali local circuit: Hidimba Temple, Mall Road, Monastery, Club House & Van Vihar',
      'Snow Point excursion to Solang Valley, Atal Tunnel, Sissu & Koksar',
      'Kullu valley tour with Naggar Castle, Vaishno Devi Temple & optional rafting/paragliding',
    ],
    gallery: [
      socialHimachal,
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
      '/Instagram_videos/thumbnails/reel_05_poster.jpg',
    ],
    bestTimeToVisit: 'April to July for crisp alpine weather; December to March for Solang & Atal Tunnel snow',
    idealFor: 'Couples, Families & Bachelors Squads',
    isTrending: true,
    adventureEnabled: false,
    displayOrder: 1,
    customizationOptions: DEFAULT_MANALI_CUSTOMIZATION_STOPS,
    nearestAirport: 'Bhuntar Airport (Kullu–Manali) / Chandigarh (IXC)',
    nearestRailway: 'Chandigarh Junction / Kalka Railway Station',
    recommendedStayDays: '3 to 5 days',
    peakSeason: 'Apr 16 – Jul 05 & Dec 16 – Jan 05',
    avgTemp: '-2°C to 22°C',
    permitRequired: false,
    clothingAdvice: 'Winter jacket, waterproof snow shoes, gloves, woollen cap, UV goggles & power bank',
    culturalNotes: 'Remove footwear before entering Hidimba and Vaishno Devi temples; Old Manali and Mall Road stay lively till late evening.',
    mustTryFood: ['Himachali Dham', 'Stuffed Siddu', 'Fresh River Trout', 'Tibetan Thukpa & Momos'],
    keyAttractions: [
      { name: 'Solang Valley & Atal Tunnel', type: 'Snow Point' },
      { name: 'Hidimba Devi Temple & Old Manali', type: 'Heritage & Cafés' },
      { name: 'Sissu & Koksar', type: 'Alpine Valley' },
      { name: 'Kullu & Naggar Castle', type: 'Valley & River' },
    ],
    networkCoverage: 'Strong 4G/5G in Manali & Kullu; intermittent past Atal Tunnel toward Sissu/Koksar',
  },
  {
    slug: 'kasol',
    city: 'Kasol',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹8,499',
    priceNum: 8499,
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
    season: 'All Year (Peak Apr–Jul & Dec–Jan)',
    duration: '4–5 days',
    tagline: 'Parvati riverside camps, cafés & Manikaran hot springs',
    videoUrl: '/Video/optimized/destination_kinnaur.mp4',
    posterUrl: '/Video/optimized/destination_kinnaur_poster.jpg',
    description:
      'Combine Manali and Kullu with India’s beloved Parvati Valley hub—Kasol Market, riverside hotels or camps, Manikaran Sahib Gurudwara, and natural geothermal hot springs.',
    highlights: [
      'Kasol riverside camp or hotel stay options in 4D/3N and 5D/4N routes',
      'Manikaran Temple medicinal hot springs & Sahib Gurudwara visit',
      'Seamless extension with Manali local sights, Solang Valley & Kullu',
    ],
    gallery: [
      '/Video/optimized/destination_kinnaur_poster.jpg',
      '/Instagram_videos/thumbnails/reel_05_poster.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
    ],
    bestTimeToVisit: 'March to July and October to January for cool riverside weather and pine forest views',
    idealFor: 'Bachelors, Couples & Relaxed Family Getaways',
    isTrending: true,
    adventureEnabled: false,
    displayOrder: 2,
    customizationOptions: DEFAULT_MANALI_CUSTOMIZATION_STOPS,
    nearestAirport: 'Bhuntar Airport (Kullu–Manali, approx. 31 km)',
    nearestRailway: 'Chandigarh Junction / Pathankot',
    recommendedStayDays: '4 to 5 days (combined with Manali / Shimla)',
    peakSeason: 'Apr 16 – Jul 05 & Dec 16 – Jan 05',
    avgTemp: '2°C to 24°C',
    permitRequired: false,
    clothingAdvice: 'Warm fleece or winter jacket, waterproof walking shoes, gloves & cash in hand for local cafés',
    culturalNotes: 'Cover heads respectfully inside Manikaran Sahib Gurudwara and preserve riverside quiet around Parvati Valley camps.',
    mustTryFood: ['Wood-Fired Israeli Shakshuka', 'Tibetan Momos', 'Himachali Siddu', 'Gurudwara Langar'],
    keyAttractions: [
      { name: 'Kasol Market & Riverside Cafés', type: 'Valley Hub' },
      { name: 'Manikaran Temple & Hot Springs', type: 'Sacred Springs' },
      { name: 'Sahib Gurudwara', type: 'Pilgrimage' },
      { name: 'Parvati River Valley', type: 'Scenic Trail' },
    ],
    networkCoverage: 'Good 4G in Kasol & Manikaran; patchier in deeper side valleys like Tosh',
  },
  {
    slug: 'shimla',
    city: 'Shimla',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹10,999',
    priceNum: 10999,
    image: '/Video/optimized/destination_adventure_poster.jpg',
    season: 'All Year (Snow Dec–Feb, Pleasant Mar–Jul)',
    duration: '4–5 days',
    tagline: 'Heritage Mall Road, Jakhu hilltops & snowy Kufri',
    videoUrl: '/Video/optimized/destination_adventure.mp4',
    posterUrl: '/Video/optimized/destination_adventure_poster.jpg',
    description:
      'Travel Delhi to Manali and Shimla completely by private cab—covering Solang Valley, Atal Tunnel, Pandoh Dam, Kasol, Kufri snow ridge, Mall Road, Jakhu Temple, and Christ Church.',
    highlights: [
      'Total tour by dedicated private cab from Delhi across 4D/3N and 5D/4N circuits',
      'Shimla icons: Kufri, Mall Road, Jakhu Temple & neo-Gothic Christ Church',
      'Scenic Manali–Shimla transfer via Pandoh Dam & Ropeway Point',
    ],
    gallery: [
      '/Video/optimized/destination_adventure_poster.jpg',
      '/Video/optimized/destination_kedarnath_poster.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
    ],
    bestTimeToVisit: 'March to July for crisp hill weather; December to February for Kufri winter snow',
    idealFor: 'Families, Honeymoon Couples & Road Trip Squads',
    isTrending: true,
    adventureEnabled: false,
    displayOrder: 3,
    customizationOptions: DEFAULT_MANALI_CUSTOMIZATION_STOPS,
    nearestAirport: 'Shimla Airport (Jubbarhatti) / Chandigarh (IXC)',
    nearestRailway: 'Kalka Railway Station / Chandigarh Junction',
    recommendedStayDays: '4 to 5 days (combined Manali–Shimla circuit)',
    peakSeason: 'Apr 16 – Jul 05 & Dec 16 – Jan 05',
    avgTemp: '0°C to 23°C',
    permitRequired: false,
    clothingAdvice: 'Warm jacket, comfortable walking shoes for pedestrian Mall Road, gloves & winter cap in Dec–Feb',
    culturalNotes: 'Mall Road and The Ridge are vehicle-free pedestrian promenades; taxis drop guests at designated lift/parking points.',
    mustTryFood: ['Chana Madra', 'Babru Stuffed Kachori', 'Hot Gulab Jamun on Mall Road', 'Cafe Sol Bakery'],
    keyAttractions: [
      { name: 'Kufri Snow Ridge', type: 'Hilltop Viewpoint' },
      { name: 'The Ridge & Mall Road', type: 'Heritage Promenade' },
      { name: 'Christ Church & Jakhu Temple', type: 'Landmarks' },
      { name: 'Pandoh Dam & Ropeway Point', type: 'Scenic En-route' },
    ],
    networkCoverage: 'Full 4G/5G coverage throughout Shimla, Kufri & highway corridor',
  },
]

export const destinations = nationalDestinations

const HIMACHAL_EXCLUSIONS = [
  'All Adventure Activities',
  '4x4 Vehicles in Heavy Snowfall',
  'Train & flight tickets',
  'Any meal not mentioned in the inclusions',
  'Any entry fees and guide charges',
  'Any cost arising due to natural causes like landslides, road blocks, and political issues',
  'Personal expenses like laundry, luggage charges, and special self-ordered food',
  'Anything which is not included in the package inclusions',
]

const HIMACHAL_THINGS_TO_CARRY = [
  'Approved Government ID',
  'Prescribed medicine for winter',
  'Winter jacket & waterproof shoes',
  'One pair of gloves, winter cap, goggles & socks',
  'Power bank & mobile charger',
  'Little amount of cash in hand',
]

const HIMACHAL_CANCELLATION_POLICY = [
  'Registration charges are non-refundable.',
  'If cancellations are made within 7 days before the start date of the trip, 100% of booking value will be charged as cancellation fees.',
  'If cancelled 15 days before the start date of the trip, 50% of booking value will be charged as cancellation fees.',
  'In case of unforeseen weather conditions or government restrictions, certain activities may be cancelled and we will try our best to provide an alternate feasible activity; however, no refund will be provided for the same.',
  'In case of lockdown at the destination, a credit shell will be released for future bookings.',
]

export const allPackages: PackageItem[] = [
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
  "travellerGroup": "Friends & bachelors",
  "destinationSlug": "manali",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Families",
  "destinationSlug": "manali",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Couples",
  "destinationSlug": "manali",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Friends & bachelors",
  "destinationSlug": "kasol",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Friends & bachelors",
  "destinationSlug": "shimla",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Friends & bachelors",
  "destinationSlug": "kasol",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Families",
  "destinationSlug": "kasol",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Families",
  "destinationSlug": "kasol",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Families",
  "destinationSlug": "shimla",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Couples",
  "destinationSlug": "kasol",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Couples",
  "destinationSlug": "shimla",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Couples",
  "destinationSlug": "kasol",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Families",
  "destinationSlug": "shimla",
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
  "featured": true,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Friends & bachelors",
  "destinationSlug": "shimla",
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Friends & bachelors",
  "destinationSlug": "shimla",
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
  "featured": true,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Families",
  "destinationSlug": "shimla",
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
  "featured": true,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Couples",
  "destinationSlug": "shimla",
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
  "featured": true,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "travellerGroup": "Couples",
  "destinationSlug": "shimla",
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
  "featured": true,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
},
]

export const stayTypes = ['Hotels', 'Resorts', 'Heritage Stays', 'Palace Stays', 'Beach Retreats', 'Houseboat Stays', 'Plantation Retreats'] as const

export const hotelStays: StayItem[] = [
  {
    id: 'stay-manali-pine',
    city: 'Manali',
    state: 'Himachal Pradesh',
    type: 'Resorts',
    name: 'Pinecrest Cedar Resort & Spa, Manali',
    price: '₹5,400',
    priceNum: 5400,
    rating: 4.9,
    image: '/Video/optimized/destination_himachal_poster.jpg',
    amenities: ['Valley Balcony Views', 'Bonfire Lounge', 'Veg & Non-Veg Dining', 'Heated Rooms', 'Free Wi-Fi'],
    description:
      'Set amid tall Himalayan deodars minutes from Mall Road and Hidimba Temple, offering cosy mountain rooms and warm Himachali hospitality.',
  },
  {
    id: 'stay-kasol-riverside',
    city: 'Kasol',
    state: 'Himachal Pradesh',
    type: 'Heritage Stays',
    name: 'Parvati Riverside Camps & Chalets, Kasol',
    price: '₹4,200',
    priceNum: 4200,
    rating: 4.8,
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
    amenities: ['Parvati Riverfront', 'Swiss & Cedar Cottages', 'Bonfire Evenings', 'Café Access', '24/7 Care'],
    description:
      'Wake to the gentle roar of the Parvati River with direct access to Kasol Market cafés and the Manikaran hot-spring route.',
  },
  {
    id: 'stay-shimla-ridge',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    type: 'Hotels',
    name: 'Cedar Crest Ridge Hotel, Shimla',
    price: '₹6,200',
    priceNum: 6200,
    rating: 4.9,
    image: '/Video/optimized/destination_adventure_poster.jpg',
    amenities: ['Pine Valley Views', 'Mall Road Access', 'In-House Restaurant', 'Private Parking', 'Concierge'],
    description:
      'A hillside boutique stay overlooking Shimla’s cedar slopes with effortless access to The Ridge, Christ Church, Jakhu Temple, and Kufri.',
  },
]

export const roadTrips: RoadTripItem[] = [
  {
    id: 'delhi-manali-atal-tunnel',
    name: 'Manali, Solang & Atal Tunnel Snow Circuit',
    route: 'Delhi to Manali via Kullu, Solang Valley, Atal Tunnel & Sissu',
    days: '3–4 Days',
    distance: '540 km',
    difficulty: 'Moderate',
    image: '/Video/optimized/destination_himachal_poster.jpg',
    highlights: [
      'Drive through the engineering marvel of Atal Tunnel into Sissu & Koksar',
      'Hidimba Devi Temple, Old Manali cafés & Mall Road evenings',
      'Kullu valley paragliding, Beas river rafting & Naggar Castle stopover',
    ],
    description:
      'Our classic Himachal mountain drive pairing overnight Delhi comfort or private cab flexibility with snow-point excursions in Solang Valley and Lahaul.',
    stops: ['Delhi', 'Kullu', 'Manali', 'Solang Valley', 'Atal Tunnel', 'Sissu'],
  },
  {
    id: 'manali-kasol-parvati-trail',
    name: 'Manali to Kasol & Parvati Valley Trail',
    route: 'Manali via Kullu to Kasol, Manikaran & Tosh',
    days: '4 Days',
    distance: '85 km (Valley Sector)',
    difficulty: 'Easy',
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
    highlights: [
      'Parvati riverside camping & café hopping in Kasol',
      'Sacred Manikaran Sahib Gurudwara & geothermal hot springs',
      'Optional custom extension to Tosh village or Shangarh meadows',
    ],
    description:
      'Wind down from Manali’s snow slopes through Kullu’s adventure corridor into the cedar-scented Parvati Valley of Kasol and Manikaran.',
    stops: ['Manali', 'Naggar', 'Kullu', 'Kasol', 'Manikaran'],
  },
  {
    id: 'shimla-manali-grand-loop',
    name: 'The Grand Shimla, Kasol & Manali Cab Loop',
    route: 'Delhi to Manali, Kasol & Shimla via Pandoh Dam & Kufri',
    days: '5 Days',
    distance: '1,120 km (Round Loop)',
    difficulty: 'Moderate',
    image: '/Video/optimized/destination_adventure_poster.jpg',
    highlights: [
      'Complete private cab journey from Delhi covering all three Himachal hubs',
      'En-route photo stop at Pandoh Dam & Ropeway Point',
      'Kufri ridge views, Christ Church, Jakhu Temple & Mall Road in Shimla',
    ],
    description:
      'Designed for travellers who want every iconic Himachal landmark in one seamless 5D/4N private cab loop—extendable with Chandigarh, Dharamshala, or Amritsar.',
    stops: ['Delhi', 'Manali', 'Solang Valley', 'Kullu', 'Kasol', 'Pandoh Dam', 'Shimla', 'Kufri'],
  },
]

export const stories: StoryItem[] = [
  {
    id: 'story-manali-atal-tunnel',
    title: 'Through Atal Tunnel: Morning Light in Sissu & Solang',
    category: 'Mountain Journals',
    author: 'Karthik & Ananya Reddy',
    date: 'February 2026',
    readTime: '5 min read',
    image: socialHimachal,
    snippet:
      'Leaving pine-shaded Old Manali at dawn, the nine-kilometre tunnel opens straight onto crisp Lahaul snowfields.',
    content: [
      'Every Manali morning starts with mountain chai looking out over frost-dusted deodars before our private cab climbs steadily toward Solang Valley.',
      'Emerging from the north portal of Atal Tunnel into Sissu feels like stepping into another season altogether—wide snowy bowls, frozen waterfalls, and clear blue skies.',
      'By sunset we were back on Mall Road with warm Tibetan thukpa and our 24/7 Telugu concierge already checking our Kullu rafting slot for the next morning.',
    ],
  },
  {
    id: 'story-kasol-parvati',
    title: 'Hot Springs & Pine Trails Along the Parvati River',
    category: 'Field Notes',
    author: 'Vikram & Squad',
    date: 'March 2026',
    readTime: '4 min read',
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
    snippet:
      'Between riverside cafés in Kasol and steaming geothermal waters at Manikaran Sahib, Parvati Valley moves at its own unhurried pace.',
    content: [
      'Our 4D/3N bachelor itinerary gave us two vibrant nights in Manali and an overnight riverside camp in Kasol—just enough contrast between snow sports and pine-forest chill.',
      'At Manikaran Temple and Sahib Gurudwara, steam rises gently from natural hot springs beside the cold rushing Parvati river.',
      'Adding an extra day to hike toward Tosh made the trip feel custom-built around our group without any planning headaches.',
    ],
  },
  {
    id: 'story-shimla-manali-cab',
    title: 'Five Days Across Manali, Kasol & Shimla by Private Cab',
    category: 'Family Diaries',
    author: 'The Rao Family',
    date: 'January 2026',
    readTime: '6 min read',
    image: '/Video/optimized/destination_adventure_poster.jpg',
    snippet:
      'From Hidimba Temple and Pandoh Dam to colonial Christ Church and snowy Kufri—travelling with one dedicated cab made all the difference.',
    content: [
      'With parents and kids travelling together, having the same trusted driver from Delhi pickup through Manali, Kasol, and Shimla kept every transfer calm and predictable.',
      'We paused at Pandoh Dam for ropeway views on our way to Shimla and spent our final morning wandering Kufri and Mall Road.',
      'Crazy Tours’ 24/7 Telugu support checked in every evening at dinner so our family could simply enjoy the mountains.',
    ],
  },
]

export const offers: OfferItem[] = [
  {
    id: 'offer-manali-group',
    code: 'CRAZYSQUAD',
    title: 'Manali & Kasol Group Saver (6+ Pax)',
    discountText: 'Starting ₹6,999',
    tag: 'Bachelors & Friends',
    validTill: 'Off-Season & Peak Windows',
    description:
      'Special per-person tiered pricing for groups of 6 or more on our 3D/2N Kullu Manali and 4D/3N Kasol Manali packages—with private cab sightseeing.',
    minBooking: 'Min. 6 travellers',
    image: '/Video/optimized/destination_himachal_poster.jpg',
  },
  {
    id: 'offer-honeymoon-perks',
    code: 'HIMALAYALOVE',
    title: 'Manali Honeymoon Candlelight & Cake Inclusions',
    discountText: 'Complimentary Perks',
    tag: 'Couples Only',
    validTill: 'Year-Round',
    description:
      'Included on all 3D/2N, 4D/3N, and 5D/4N Manali, Kasol & Shimla couple packages: one night candlelight dinner and honeymoon bed decoration with cake.',
    minBooking: 'Applicable on all Couple tiers',
    image: '/Video/optimized/destination_kinnaur_poster.jpg',
  },
  {
    id: 'offer-shimla-loop',
    code: 'SHIMLA5D',
    title: '5D/4N Shimla, Manali & Kasol Private Cab Upgrade',
    discountText: 'Standard Plus Deal',
    tag: 'Best for Families',
    validTill: 'Jan 06 - Apr 15 & Jul 06 - Dec 15',
    description:
      'Book our 5D/4N Shimla–Manali–Kasol family circuit during off-season dates and lock Standard Plus hotel stays with 4 breakfasts and 4 dinners.',
    minBooking: 'Min. 6 travellers (Family / Group)',
    image: '/Video/optimized/destination_adventure_poster.jpg',
  },
]

export const reviews: ReviewItem[] = [
  {
    id: 'rev-1',
    quote:
      'Our 5D/4N Shimla–Manali–Kasol honeymoon was effortless. The candlelight dinner, bed decoration with cake, and our private cab driver made every mountain mile memorable.',
    name: 'Harsha & Divya Reddy',
    trip: 'Shimla Manali & Kasol Couple Trip (5D/4N)',
    rating: 5,
  },
  {
    id: 'rev-2',
    quote:
      'Travelling with parents and kids from Hyderabad to Delhi and Manali felt completely stress-free thanks to 24/7 Telugu support and punctual transfers at every sightseeing point.',
    name: 'Srinivas Rao & Family',
    trip: 'Shimla Manali Family Trip with Kasol Stay (5D/4N)',
    rating: 5,
  },
  {
    id: 'rev-3',
    quote:
      'Six of us booked the 4D/3N Kasol Manali Bachelor package—Solang Valley snow, Atal Tunnel, Kullu rafting, and overnight Kasol camps were worth every rupee.',
    name: 'Karthik, Sai & Friends',
    trip: 'Kasol Manali Bachelor Trip with Kasol Stay (4D/3N)',
    rating: 5,
  },
  {
    id: 'rev-4',
    quote:
      'We started with the 3D/2N Kullu Manali package and added Dharamshala and Amritsar right on the itinerary builder. Transparent pricing and zero hidden surprises.',
    name: 'Praveen & Meghana',
    trip: 'Custom Manali + Dharamshala + Amritsar Route',
    rating: 5,
  },
]

export const faqs: FAQItem[] = [
  {
    question: 'What is included in your Manali, Kasol & Shimla packages?',
    answer:
      'Depending on the 3D/2N, 4D/3N, or 5D/4N itinerary you choose, packages include Delhi–Manali round-trip Volvo bus or full Delhi-to-Delhi private cab, hotel/camp stays, daily breakfasts & dinners (Veg & Non-Veg), local sightseeing, and 24/7 Telugu customer care support.',
    category: 'Inclusions',
  },
  {
    question: 'Can I customize my itinerary with nearby places like Dharamshala, Dalhousie, or Amritsar?',
    answer:
      'Yes! Open any Manali, Kasol, or Shimla package and scroll to the Day-by-Day Itinerary & Customization section to add stops like Dharamshala, Dalhousie, Chandigarh, Amritsar, Tosh, Shangarh, or Baralacha Pass directly to your trip plan.',
    category: 'Customization',
  },
  {
    question: 'What is the difference between Off-Season and Season pricing?',
    answer:
      'Off-Season dates run Jan 06 – Apr 15 and Jul 06 – Dec 15, while Season (peak) dates run Apr 16 – Jul 05 and Dec 16 – Jan 05. Each package offers Standard, Standard Plus, and Premium hotel tiers with transparent Per Couple or Per Person (min 6 pax) rates.',
    category: 'Booking & Payment',
  },
  {
    question: 'Are Solang Valley, Atal Tunnel & Sissu open all year?',
    answer:
      'Solang Valley operates year-round, while Atal Tunnel and Sissu typically close between Jan 10 and Mar 15 during heavy snowfall. During heavy snowfall days, 4x4 vehicles may be required at actual local rates.',
    category: 'Policies',
  },
  {
    question: 'What is your cancellation and refund policy?',
    answer:
      'Registration charges are non-refundable. Cancellations made 15 days before trip start incur 50% of booking value, and cancellations within 7 days incur 100%. In case of destination lockdown, a credit shell is issued for future bookings.',
    category: 'Policies',
  },
  {
    question: 'Do you provide Telugu-speaking customer support during the trip?',
    answer:
      'Yes! All 18 Himachal packages include 24/7 Telugu customer care support from arrival pickup at Manali or Delhi until your safe return journey.',
    category: 'Support',
  },
]

export const officeLocations: OfficeLocation[] = [
  {
    city: 'Hyderabad (Headquarters)',
    address: 'Level 4, Jubilee Hills Road No. 36, Hyderabad 500033',
    phone: '+91 8047 112 112',
    email: 'hyderabad@crazytourstravels.com',
    hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
  },
  {
    city: 'New Delhi (Departure Hub)',
    address: 'Suite 204, Barakhamba Road, Connaught Place, New Delhi 110001',
    phone: '+91 8047 112 113',
    email: 'delhi@crazytourstravels.com',
    hours: 'Mon - Sat: 9:30 AM - 7:30 PM',
  },
  {
    city: 'Bengaluru',
    address: 'Ground Floor, Indiranagar 100ft Road, HAL 2nd Stage, Bengaluru 560038',
    phone: '+91 8047 112 114',
    email: 'bangalore@crazytourstravels.com',
    hours: 'Mon - Sat: 10:00 AM - 7:30 PM',
  },
]

export const socialStories = [
  { place: 'Manali & Solang', image: socialHimachal, duration: '0:30', caption: 'Snow slopes and hot mountain tea above Solang Valley.' },
  { place: 'Atal Tunnel & Sissu', image: '/Video/optimized/destination_himachal_poster.jpg', duration: '0:45', caption: 'Crossing into crisp Lahaul winter views past Atal Tunnel.' },
  { place: 'Kasol & Manikaran', image: '/Video/optimized/destination_kinnaur_poster.jpg', duration: '0:35', caption: 'Parvati riverside cafés and steaming Manikaran hot springs.' },
  { place: 'Shimla & Kufri', image: '/Video/optimized/destination_adventure_poster.jpg', duration: '0:50', caption: 'Golden twilight over The Ridge, Christ Church & Kufri.' },
]

export const instagramReels: InstagramReelItem[] = [
  {
    id: 'reel-1',
    title: 'Candlelight Evenings & Snow Views in Manali',
    place: 'Manali & Solang Valley, Himachal',
    customerName: 'Harsha & Divya Reddy',
    rating: 5.0,
    reviewQuote: 'Our honeymoon candlelight dinner, cake setup, and snow morning at Solang Valley felt completely effortless. Crazy Tours handled every detail.',
    videoUrl: '/Instagram_videos/compressed/reel_01.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_01_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:56',
    displayOrder: 1,
    category: 'Couple',
  },
  {
    id: 'reel-2',
    title: 'Old Manali Cafés & Hidimba Pine Walks',
    place: 'Old Manali & Kullu, Himachal',
    customerName: 'Pooja & Siddharth',
    rating: 5.0,
    reviewQuote: 'Cosy pine-view hotel, private cab for every spot, and 24/7 Telugu support whenever we had a question.',
    videoUrl: '/Instagram_videos/compressed/reel_02.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_02_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:10',
    displayOrder: 2,
    category: 'Couple',
  },
  {
    id: 'reel-3',
    title: '5-Day Family Loop Across Manali, Kasol & Shimla',
    place: 'Shimla, Manali & Kasol, Himachal',
    customerName: 'The Srinivas Rao Family',
    rating: 5.0,
    reviewQuote: 'Having one private cab from Delhi across Manali, Pandoh Dam, Kasol, and Shimla kept our parents and kids super comfortable.',
    videoUrl: '/Instagram_videos/compressed/reel_03.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_03_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:18',
    displayOrder: 3,
    category: 'Family',
  },
  {
    id: 'reel-4',
    title: 'Squad Drive Through Atal Tunnel & Sissu',
    place: 'Atal Tunnel & Sissu, Manali',
    customerName: 'Vikram, Sai & Friends',
    rating: 5.0,
    reviewQuote: 'Best bachelor road trip! Snow fights at Sissu, paragliding in Kullu, and riverside camps in Kasol—all sorted seamlessly.',
    videoUrl: '/Instagram_videos/compressed/reel_04.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_04_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:46',
    displayOrder: 4,
    category: 'Bachelors',
  },
  {
    id: 'reel-5',
    title: 'Parvati Riverside Mornings in Kasol',
    place: 'Kasol & Manikaran, Himachal',
    customerName: 'Ananya & Karthik',
    rating: 5.0,
    reviewQuote: 'Spending a night at Kasol riverside camp after two days in Manali was the highlight of our 4D/3N couple trip.',
    videoUrl: '/Instagram_videos/compressed/reel_05.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_05_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:44',
    displayOrder: 5,
    category: 'Couple',
  },
  {
    id: 'reel-6',
    title: 'Kufri Ridge & Mall Road Family Strolls',
    place: 'Shimla & Kufri, Himachal',
    customerName: 'Meera & Rajesh Family',
    rating: 5.0,
    reviewQuote: 'Jakhu Temple, Christ Church, and Kufri snow views—our family loved the relaxed 5D/4N pacing and warm hotel stays.',
    videoUrl: '/Instagram_videos/compressed/reel_06.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_06_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:17',
    displayOrder: 6,
    category: 'Family',
  },
  {
    id: 'reel-7',
    title: 'Beas River Rafting & Kullu Paragliding Squad',
    place: 'Kullu Valley & Manali, Himachal',
    customerName: 'Arjun & College Crew',
    rating: 5.0,
    reviewQuote: 'Six of us booked the 3D/2N Kullu Manali bachelor trip—non-stop energy from Solang snow to Beas rapids.',
    videoUrl: '/Instagram_videos/compressed/reel_07.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_07_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:47',
    displayOrder: 7,
    category: 'Bachelors',
  },
  {
    id: 'reel-8',
    title: 'Sunset Over Shimla Hills & Pandoh Dam',
    place: 'Shimla & Manali, Himachal',
    customerName: 'Divya & Nikhil',
    rating: 5.0,
    reviewQuote: 'The scenic drive from Manali via Pandoh Dam to Shimla was unforgettable. Premium hotel tier was worth every penny.',
    videoUrl: '/Instagram_videos/compressed/reel_08.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_08_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:14',
    displayOrder: 8,
    category: 'Couple',
  },
  {
    id: 'reel-9',
    title: 'Bonfire Nights & Hot Springs in Kasol',
    place: 'Kasol & Manikaran Sahib, Himachal',
    customerName: 'Rohit, Tej & Friends',
    rating: 5.0,
    reviewQuote: 'Crazy Tours even helped us customize an extra Tosh stopover on our 4D/3N Kasol stay. Zero hassle, total fun.',
    videoUrl: '/Instagram_videos/compressed/reel_09.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_09_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '0:52',
    displayOrder: 9,
    category: 'Bachelors',
  },
  {
    id: 'reel-10',
    title: 'First Snowfall Memories in Solang Valley',
    place: 'Manali & Kullu, Himachal',
    customerName: 'The Iyer Family',
    rating: 5.0,
    reviewQuote: 'Seeing snow together at Solang Valley and visiting Hidimba Temple and Naggar Castle made this our best family holiday.',
    videoUrl: '/Instagram_videos/compressed/reel_10.mp4',
    posterUrl: '/Instagram_videos/thumbnails/reel_10_poster.jpg',
    instagramUrl: 'https://www.instagram.com/crazytourstravels/',
    duration: '1:05',
    displayOrder: 10,
    category: 'Family',
  },
]

export const directoryGroups = {
  'North India': [
    'Manali & Kullu Valley (3D/2N)',
    'Kasol & Manikaran Parvati Trail (4D/3N)',
    'Shimla, Kufri & Manali Cab Loop (4D/3N)',
    'Grand Shimla, Manali & Kasol (5D/4N)',
    'Solang Valley & Atal Tunnel Snow Circuit',
  ],
  'Custom Add-On Stops': [
    'Dharamshala & McLeod Ganj',
    'Dalhousie & Khajjiar',
    'Chandigarh Lake & Rock Garden',
    'Amritsar Golden Temple & Wagah',
    'Tosh, Shangarh & Baralacha Pass',
  ],
  'Travel Styles': [
    'Couple & Honeymoon packages',
    'Family private cab holidays',
    'Bachelors & Friends group trips',
    'Standard, Standard Plus & Premium tiers',
    '24/7 Telugu customer care support',
  ],
}
