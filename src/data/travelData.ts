import {
  Currency,
  CurrencyConfig,
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
import kashmirImage from '../assets/wayfare-kashmir.png'
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
    image: kashmirImage,
    eyebrow: 'Spring in the valley',
    title: 'See India with new eyes.',
    copy: 'Thoughtfully planned journeys across the places we call home. Handcrafted departures, verified heritage stays, and local hosts.',
    location: 'Tulip season in Kashmir',
    actionRoute: 'destination/srinagar',
  },
  {
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1800&q=88',
    eyebrow: 'Mist over the tea gardens',
    title: 'Find a slower rhythm in Kerala.',
    copy: 'Hill-country walks, spice-scented kitchens, boutique plantation hideaways and quiet backwater mornings.',
    location: 'Monsoon light in Munnar',
    actionRoute: 'destination/munnar',
  },
  {
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1800&q=88',
    eyebrow: 'Stories written in sandstone',
    title: 'Royal Rajasthan, beautifully unhurried.',
    copy: 'Courtyard havelis, desert drives, private stepwell dining and evenings under an endless canopy of stars.',
    location: 'Old-city mornings in Jaipur & Udaipur',
    actionRoute: 'destination/udaipur',
  },
]

export const nationalDestinations: DestinationItem[] = [
  {
    slug: 'udaipur',
    city: 'Udaipur',
    country: 'Rajasthan',
    state: 'Rajasthan',
    price: '₹32,500',
    priceNum: 32500,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88',
    season: 'October to March',
    duration: '5 days',
    tagline: 'Lake light and living royal history',
    description:
      'Slow mornings by the water, intimate heritage stays, and the quiet romance of Rajasthan’s white city.',
    highlights: [
      'Private old-city artisan walk',
      'Sunset boat cruise on Lake Pichola',
      'Countryside haveli lunch & vintage car museum',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=85',
    ],
    bestTimeToVisit: 'September to March (cool breezes and clear skies)',
    idealFor: 'Couples, Architecture Lovers & Photography Enthusiasts',
  },
  {
    slug: 'munnar',
    city: 'Munnar',
    country: 'Kerala',
    state: 'Kerala',
    price: '₹28,900',
    priceNum: 28900,
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88',
    season: 'September to May',
    duration: '5 days',
    tagline: 'Tea gardens above the clouds',
    description:
      'Wake to rolling emerald hills, walk with local naturalists, taste freshly plucked tea, and experience Kerala at its purest.',
    highlights: [
      'Private tea estate & factory heritage walk',
      'Eravikulam National Park with a naturalist',
      'Supper at a 100-year-old colonial plantation',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85',
    ],
    bestTimeToVisit: 'August to May (misty mornings, waterfalls in full flow)',
    idealFor: 'Honeymooners, Nature Lovers & Slow Travelers',
  },
  {
    slug: 'hampi',
    city: 'Hampi',
    country: 'Karnataka',
    state: 'Karnataka',
    price: '₹24,400',
    priceNum: 24400,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=88',
    season: 'October to February',
    duration: '4 days',
    tagline: 'Ruins, boulders and golden twilight',
    description:
      'Explore the ancient Vijayanagara capital at an unhurried human pace, from riverside temples to sunset atop granite boulder ridges.',
    highlights: [
      'Expert archaeological heritage storyteller',
      'Traditional coracle river crossing across Tungabhadra',
      'Sunrise viewpoint climb over Matanga Hill',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=85',
    ],
    bestTimeToVisit: 'October to March (pleasant walking climate)',
    idealFor: 'History Buffs, Explorers & Solo Wanderers',
  },
  {
    slug: 'srinagar',
    city: 'Srinagar',
    country: 'Kashmir',
    state: 'Jammu & Kashmir',
    price: '₹36,800',
    priceNum: 36800,
    image: kashmirImage,
    season: 'March to October',
    duration: '6 days',
    tagline: 'A valley bathed in full floral colour',
    description:
      'Mughal gardens, crisp Himalayan breezes, cedar-wood houseboats and tranquil shikara evenings woven into an unforgettable escape.',
    highlights: [
      'Handcrafted cedar boutique houseboat stay on Nigeen Lake',
      'VIP morning access to Indira Gandhi Memorial Tulip Garden',
      'Day journey into the high alpine meadows of Gulmarg',
    ],
    gallery: [
      kashmirImage,
      socialHimachal,
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
    ],
    bestTimeToVisit: 'March to October (Tulip blooms in spring, apple harvests in autumn)',
    idealFor: 'Families, Couples & Mountain Wanderers',
  },
  {
    slug: 'gangtok',
    city: 'Gangtok',
    country: 'Sikkim',
    state: 'Sikkim',
    price: '₹31,500',
    priceNum: 31500,
    image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=88',
    season: 'March to June',
    duration: '6 days',
    tagline: 'Monasteries beneath snowy Himalayan peaks',
    description:
      'A mindful Himalayan haven of winding pine forest roads, chanting monasteries, organic tea valleys, and welcoming local kitchens.',
    highlights: [
      'Exclusive Rumtek & Enchey monastery morning trail',
      'Glacial excursion to turquoise Tsomgo Lake',
      'Traditional homestyle Sikkimese lunch in a rural farmhouse',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=85',
    ],
    bestTimeToVisit: 'March to June & October to December (crystal Kanchenjunga panoramas)',
    idealFor: 'Culture Seekers, Trekkers & Spiritual Travellers',
  },
  {
    slug: 'andaman',
    city: 'Andaman',
    country: 'Bay of Bengal',
    state: 'Andaman & Nicobar Islands',
    region: 'Islands',
    price: '₹42,000',
    priceNum: 42000,
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88',
    season: 'October to May',
    duration: '6 days',
    tagline: 'Turquoise island lagoons and pristine coral atolls',
    description:
      'Glass-clear warm ocean waters, virgin rainforest fringes, bioluminescent night kayak trips, and unhurried luxury barefoot living.',
    highlights: [
      'Guided coral reef snorkelling in Havelock island',
      'Private Radhanagar beach sunset picnic setup',
      'Baratang mangrove forest boat safari',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=800&q=85',
      '/catalog-photos/radhanagar-beach.jpg',
    ],
    bestTimeToVisit: 'October to May (calm sea conditions and high underwater visibility)',
    idealFor: 'Beach Enthusiasts, Scuba Divers & Honeymoon Couples',
    isTrending: true,
    adventureEnabled: true,
    displayOrder: 6,
  },
  {
    slug: 'himachal',
    city: 'Himachal',
    country: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'North India',
    price: '₹6,999',
    priceNum: 6999,
    image: socialHimachal,
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
      socialHimachal,
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
      '/Instagram_videos/thumbnails/reel_05_poster.jpg',
    ],
    videoUrl: '/Video/optimized/destination_himachal.mp4',
    posterUrl: '/Video/optimized/destination_himachal_poster.jpg',
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
    videoUrl: '/Video/optimized/destination_ladakh.mp4',
    posterUrl: '/Video/optimized/destination_ladakh_poster.jpg',
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
    id: 'kashmir-tulips',
    title: 'Tulips, Houseboats & High Meadows',
    place: 'Kashmir',
    state: 'Jammu & Kashmir',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
    nightsCount: 5,
    category: 'Couple',
    destinationSlug: 'srinagar',
    routeSummary: '2N Srinagar Houseboat • 1N Gulmarg • 2N Pahalgam',
    price: '₹36,800',
    priceNum: 36800,
    originalPrice: '₹44,000',
    discount: '16% OFF',
    rating: 4.9,
    reviewCount: 142,
    image: kashmirImage,
    overview:
      'Experience Kashmir in its most magical season. Glide on Dal Lake in a wooden shikara, rest aboard a boutique cedar-wood houseboat, marvel at millions of blooming tulips, and ascend into snow-crested Gulmarg meadows.',
    highlights: [
      '2 Nights Heritage Houseboat on Nigeen Lake + 3 Nights Luxury Pine Resort in Pahalgam',
      'Shikara ride at golden hour with traditional Kahwa tea',
      'Gondola ride Phase 1 tickets included in Gulmarg',
      'Private chauffeured luxury Innova Crysta for all transfers',
    ],
    inclusions: [
      'Welcome drink on arrival (traditional Kashmiri Kahwa)',
      '5 nights handpicked 4-star boutique accommodation',
      'Daily gourmet buffet breakfast and chef-crafted dinners',
      'Private AC vehicle for all transfers and sightseeing',
      'Dedicated local tour escort and driver allowances',
      'Shikara boat ride on Dal Lake (2 hours)',
      'All toll taxes, parking, and state passenger fees',
    ],
    exclusions: [
      'Airfare to/from Srinagar International Airport',
      'Pony rides or snow sledging in Gulmarg / Pahalgam',
      'Personal expenses, laundry, and guide tips',
      'Travel insurance (available as optional add-on)',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive Srinagar & Check-in to Boutique Houseboat',
        description:
          'Warm airport reception and transfer to your luxury wooden houseboat on serene Nigeen Lake. Settle in with freshly brewed saffron Kahwa. In the evening, enjoy a sunset shikara ride across lotus channels.',
        meals: 'Dinner included',
        hotel: 'Mascot Luxury Heritage Houseboat',
      },
      {
        day: 2,
        title: 'Mughal Gardens & Tulip Splendour',
        description:
          'Visit Nishat Bagh and Shalimar Bagh built during Emperor Jahangir’s reign. Spend the afternoon in Asia’s largest Tulip Garden with over 60 varieties in peak bloom.',
        meals: 'Breakfast & Dinner',
        hotel: 'Mascot Luxury Heritage Houseboat',
      },
      {
        day: 3,
        title: 'Srinagar to Gulmarg Alpine Wonderland',
        description:
          'Scenic drive through willow and apple orchards to Gulmarg (2,730m). Board the famous Gulmarg Gondola up to Kongdoori Valley with panoramic snow views across the Pir Panjal range.',
        meals: 'Breakfast & Dinner',
        hotel: 'The Khyber Himalayan Resort / Grand Mumtaz',
      },
      {
        day: 4,
        title: 'Pahalgam - The Valley of Shepherds',
        description:
          'Journey past saffron fields at Pampore and pine-lined gorges along the Lidder River into Pahalgam. Visit Betaab Valley and Chandanwari.',
        meals: 'Breakfast & Dinner',
        hotel: 'Pahalgam Pine & Peaks Resort',
      },
      {
        day: 5,
        title: 'Lidder River Walks & Local Village Encounter',
        description:
          'A quiet, unhurried day walking through Aru Valley with a local naturalist. Visit an artisan cooperative weaving genuine Pashmina shawls.',
        meals: 'Breakfast & Dinner',
        hotel: 'Pahalgam Pine & Peaks Resort',
      },
      {
        day: 6,
        title: 'Departure with Cherished Memories',
        description:
          'Enjoy a final slow breakfast overlooking the river before your private transfer to Srinagar Airport for your return flight.',
        meals: 'Breakfast included',
        hotel: 'Check-out',
      },
    ],
    theme: 'Honeymoon',
    featured: true,
  },
  {
    id: 'kerala-tea-trails',
    title: 'Tea Trails, Mist & Backwater Serenity',
    place: 'Kerala',
    state: 'Kerala',
    duration: '7 Days / 6 Nights',
    daysCount: 7,
    nightsCount: 6,
    category: 'Family',
    destinationSlug: 'munnar',
    routeSummary: '1N Fort Kochi • 2N Munnar • 1N Thekkady • 1N Alleppey • 1N Marari',
    price: '₹42,900',
    priceNum: 42900,
    originalPrice: '₹51,000',
    discount: '15% OFF',
    rating: 4.8,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85',
    overview:
      'Immerse in God’s Own Country: historic Portuguese alleys in Fort Kochi, misty rolling tea gardens in Munnar, spice plantations in Thekkady, and a private overnight cruise through Alleppey backwaters.',
    highlights: [
      '2 Nights Heritage Plantation in Munnar + 1 Night Private Houseboat in Alleppey',
      'Ayurvedic wellness rejuvenation session included',
      'Kathakali cultural performance & spice market walk in Kochi',
      'Eco-cruise through Periyar Lake Wildlife Sanctuary',
    ],
    inclusions: [
      '6 nights premium heritage and nature accommodation',
      'All meals on the Alleppey houseboat (authentic Kerala cuisine)',
      'Daily breakfast at all land resorts',
      'Private AC sedan/SUV throughout the journey',
      'Spice plantation guided walk with botanist',
    ],
    exclusions: [
      'Flights to Kochi and from Trivandrum/Kochi',
      'Optional ayurvedic massage treatments',
      'Entry fees to monuments and wildlife safari camera permits',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Fort Kochi - Colonial Charms',
        description:
          'Arrive at Cochin Airport. Explore Fort Kochi’s Chinese fishing nets, St. Francis Church, and colorful Jew Town.',
        meals: 'Dinner included',
        hotel: 'Brunton Boatyard / Old Harbour Hotel',
      },
      {
        day: 2,
        title: 'Kochi to Munnar Tea Country',
        description:
          'Drive past Cheeyappara Waterfalls into lush green hills. Arrive at your plantation resort tucked amid tea estates.',
        meals: 'Breakfast & Dinner',
        hotel: 'Windermere Estate Munnar',
      },
      {
        day: 3,
        title: 'Munnar Tea Trails & Naturalist Walk',
        description:
          'Guided walk through heritage tea bushes, visit the Tata Tea Museum, and enjoy panoramic views at Mattupetty Dam.',
        meals: 'Breakfast & Dinner',
        hotel: 'Windermere Estate Munnar',
      },
      {
        day: 4,
        title: 'Thekkady - Cardamom Hills & Wildlife',
        description:
          'Journey to the spice capital Thekkady. Take a serene boat safari on Periyar Lake watching wild elephants along the banks.',
        meals: 'Breakfast & Dinner',
        hotel: 'Spice Village Thekkady',
      },
      {
        day: 5,
        title: 'Boarding Private Alleppey Houseboat',
        description:
          'Check-in to your traditional thatched kettuvallam. Glide through tranquil palm-lined canals as fresh Karimeen fish is prepared by your private onboard chef.',
        meals: 'Breakfast, Lunch & Dinner',
        hotel: 'Private Luxury Houseboat (Alleppey)',
      },
      {
        day: 6,
        title: 'Marari Beachfront Relaxation',
        description:
          'Disembark at Alleppey and head to the peaceful sands of Marari. Relax beneath coconut groves.',
        meals: 'Breakfast & Dinner',
        hotel: 'Marari Beach Resort',
      },
      {
        day: 7,
        title: 'Farewell Kerala',
        description:
          'After a leisurely seaside breakfast, transfer back to Kochi International Airport for your flight.',
        meals: 'Breakfast included',
        hotel: 'Check-out',
      },
    ],
    theme: 'Family',
    featured: true,
  },
  {
    id: 'rajasthan-royal',
    title: 'Palaces, Dunes & Desert Stars',
    place: 'Rajasthan',
    state: 'Rajasthan',
    duration: '8 Days / 7 Nights',
    daysCount: 8,
    nightsCount: 7,
    category: 'Family',
    destinationSlug: 'udaipur',
    routeSummary: '2N Jaipur • 1N Jodhpur • 2N Jaisalmer • 2N Udaipur',
    price: '₹48,500',
    priceNum: 48500,
    originalPrice: '₹59,000',
    discount: '18% OFF',
    rating: 4.9,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85',
    overview:
      'The ultimate Royal Circuit: Jaipur’s Amber Fort and City Palace, Jodhpur’s blue-hued alleys and Mehrangarh Fort, a luxury desert tent stay in Jaisalmer Sam Sand Dunes, ending in romantic Udaipur.',
    highlights: [
      'Luxury Swiss tent night in Thar Desert with folk music and star-gazing',
      'Private sunset boat ride on Lake Pichola in Udaipur',
      'Exclusive courtyard royal dinner at a restored heritage haveli',
      'Chauffeur-driven private Toyota Innova throughout Rajasthan',
    ],
    inclusions: [
      '7 nights accommodation in certified heritage properties and royal havelis',
      'Daily breakfast and 3 curated signature dinners',
      'Camel safari and cultural dance evening in Jaisalmer',
      'English/Hindi speaking government-approved monument guides',
    ],
    exclusions: [
      'Monument entry tickets and video camera permits',
      'Internal or international flights',
      'Items of personal nature',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Welcome to the Pink City - Jaipur',
        description:
          'Arrive in Jaipur, check-in to a heritage palace hotel. Evening visit to the vibrant bazaars of Johari and Bapu.',
        meals: 'Dinner included',
        hotel: 'Alsisar Haveli / Shahpura House',
      },
      {
        day: 2,
        title: 'Jaipur’s Architectural Marvels',
        description:
          'Visit the hilltop Amber Fort, marvel at Hawa Mahal’s 953 stone jharokhas, and tour the City Palace royal quarters.',
        meals: 'Breakfast',
        hotel: 'Alsisar Haveli',
      },
      {
        day: 3,
        title: 'Blue City - Jodhpur',
        description:
          'Drive to Jodhpur. Ascend the towering Mehrangarh Fort and stroll through the indigo-washed old quarters.',
        meals: 'Breakfast & Dinner',
        hotel: 'Ratan Vilas Jodhpur',
      },
      {
        day: 4,
        title: 'Golden City & Desert Camp - Jaisalmer',
        description:
          'Cross the golden Thar desert into Jaisalmer. Arrive at Sam Sand Dunes for an evening camel ride, folk Kalbelia dance, and open-air stargazing.',
        meals: 'Breakfast & Dinner',
        hotel: 'Sujan / Serai Luxury Desert Camp',
      },
      {
        day: 5,
        title: 'Living Fort of Jaisalmer',
        description:
          'Explore Sonar Qila, the only living fort where thousands of families reside. Admire intricate Patwon ki Haveli carvings.',
        meals: 'Breakfast',
        hotel: 'Fort Rajwada Jaisalmer',
      },
      {
        day: 6,
        title: 'Jaisalmer to the City of Lakes - Udaipur',
        description:
          'Drive through the Aravalli hills, visiting the white marble Ranakpur Jain Temple en route to Udaipur.',
        meals: 'Breakfast & Dinner',
        hotel: 'Fateh Garh Palace Udaipur',
      },
      {
        day: 7,
        title: 'Romantic Udaipur & Lake Pichola',
        description:
          'Tour the grand City Palace complex, Saheliyon-ki-Bari gardens, and take an exclusive sunset boat cruise past Jag Mandir.',
        meals: 'Breakfast & Dinner',
        hotel: 'Fateh Garh Palace Udaipur',
      },
      {
        day: 8,
        title: 'Bid Farewell to Rajasthan',
        description:
          'Transfer to Udaipur Maharana Pratap Airport with unforgettable royal memories.',
        meals: 'Breakfast included',
        hotel: 'Check-out',
      },
    ],
    theme: 'Heritage',
    featured: true,
  },
  {
    id: 'andaman-coral-retreat',
    title: 'Azure Waters & Coral Reefs',
    place: 'Andaman Islands',
    state: 'Andaman & Nicobar Islands',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
    nightsCount: 5,
    category: 'Adventure',
    destinationSlug: 'andaman',
    routeSummary: '2N Port Blair • 2N Havelock • 1N Neil Island',
    pricingTiers: {
      perUnit: 'Per Person',
      minPax: 2,
      offSeasonDates: 'Jun 01 - Sep 30',
      seasonDates: 'Oct 01 - May 31',
      tiers: [
        { name: 'Standard', offSeasonPrice: 36999, seasonPrice: 42000 },
        { name: 'Standard Plus', offSeasonPrice: 41999, seasonPrice: 47500 },
        { name: 'Premium', offSeasonPrice: 48999, seasonPrice: 54999 },
      ],
    },
    price: '₹42,000',
    priceNum: 42000,
    originalPrice: '₹49,000',
    discount: '14% OFF',
    rating: 4.9,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=900&q=85',
    overview:
      'Tropical bliss on India’s most secluded archipelago: historical Cellular Jail in Port Blair, high-speed catamaran cruise to Havelock, world-renowned Radhanagar Beach, and snorkeling at Elephant Beach.',
    highlights: [
      '3 Nights Beachfront Villa in Havelock + 2 Nights Sea-view Resort in Port Blair',
      'Makruzz / Nautika premium catamaran cruise tickets between islands',
      'Complimentary Discover Scuba / Snorkel session with PADI certified dive master',
    ],
    inclusions: [
      '5 nights luxury beachfront accommodation',
      'Daily breakfast buffet',
      'All island ferry and inter-island catamaran transfers',
      'Private airport and jetty transfers in AC cab',
    ],
    exclusions: ['Airfare to Port Blair', 'Water sports not specified in inclusions'],
    itinerary: [
      {
        day: 1,
        title: 'Arrive Port Blair & Light & Sound Show',
        description:
          'Arrive at Port Blair Airport. Check-in and relax before the evening Light & Sound Show at Cellular Jail.',
        meals: 'Dinner',
        hotel: 'Symphony Samudra Port Blair',
      },
      {
        day: 2,
        title: 'Catamaran to Havelock Island (Swaraj Dweep)',
        description:
          'Board high-speed catamaran to Havelock. Check in to your beach resort and watch a dream sunset at Radhanagar Beach.',
        meals: 'Breakfast',
        hotel: 'Taj Exotica / Barefoot Havelock',
      },
      {
        day: 3,
        title: 'Elephant Beach Coral Snorkelling',
        description:
          'Speedboat to Elephant Beach for pristine coral gardens and colourful clownfish viewing.',
        meals: 'Breakfast',
        hotel: 'Barefoot at Havelock',
      },
      {
        day: 4,
        title: 'Neil Island (Shaheed Dweep) & Natural Bridge',
        description:
          'Ferry to peaceful Neil Island. Walk across the rock-cut Natural Bridge and relax at Laxmanpur Beach.',
        meals: 'Breakfast & Dinner',
        hotel: 'Sea Shell Neil Island',
      },
      {
        day: 5,
        title: 'Return to Port Blair & Local Souvenirs',
        description:
          'Catamaran back to Port Blair. Visit Sagarika Emporium for genuine seashell and pearl crafts.',
        meals: 'Breakfast & Dinner',
        hotel: 'Symphony Samudra',
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Airport transfer with sun-kissed memories.',
        meals: 'Breakfast',
        hotel: 'Check-out',
      },
    ],
    theme: 'Adventure',
  },
  {
    id: 'sikkim-monasteries',
    title: 'Himalayan Monasteries & Glacial Lakes',
    place: 'Sikkim & Darjeeling',
    state: 'Sikkim',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
    nightsCount: 5,
    category: 'Family',
    destinationSlug: 'gangtok',
    routeSummary: '2N Gangtok • 1N Pelling • 2N Darjeeling',
    price: '₹31,500',
    priceNum: 31500,
    originalPrice: '₹37,000',
    discount: '15% OFF',
    rating: 4.8,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=900&q=85',
    overview:
      'Gaze upon majestic Mt. Kanchenjunga, listen to morning monastic chants, ride the historic Darjeeling Himalayan Toy Train, and travel to the sacred alpine waters of Tsomgo Lake near Nathula Pass.',
    highlights: [
      'Sunrise over Tiger Hill with Kanchenjunga panorama',
      'Darjeeling UNESCO World Heritage Toy Train ride',
      'Tsomgo Lake & Baba Mandir excursion (12,400 ft altitude)',
    ],
    inclusions: [
      '5 nights boutique mountain lodge accommodation',
      'Daily breakfast and dinner',
      'All local permits and protected area passes for Sikkim',
      'Private 4WD SUV throughout',
    ],
    exclusions: ['Toy train tickets if booked outside schedule', 'Nathula Pass permit fee'],
    itinerary: [
      {
        day: 1,
        title: 'Bagdogra to Gangtok',
        description: 'Drive along Teesta River to Gangtok. Evening stroll along pedestrian MG Marg.',
        meals: 'Dinner',
        hotel: 'The Elgin Nor-Khill Gangtok',
      },
      {
        day: 2,
        title: 'Tsomgo Lake & Sacred Heights',
        description: 'Drive to 12,400 ft high alpine lake surrounded by snow-dusted crags.',
        meals: 'Breakfast & Dinner',
        hotel: 'The Elgin Nor-Khill',
      },
      {
        day: 3,
        title: 'Gangtok Monasteries to Pelling',
        description: 'Visit Rumtek Monastery and drive through cardamon forests to Pelling.',
        meals: 'Breakfast & Dinner',
        hotel: 'Chumbi Mountain Retreat Pelling',
      },
      {
        day: 4,
        title: 'Pelling to Queen of Hills - Darjeeling',
        description: 'Skywalk at Chenrezig statue, then drive to colonial Darjeeling.',
        meals: 'Breakfast & Dinner',
        hotel: 'Windamere Colonial Hotel Darjeeling',
      },
      {
        day: 5,
        title: 'Tiger Hill Sunrise & Himalayan Mountaineering Institute',
        description: 'Pre-dawn drive for golden sunrise over Kanchenjunga. Visit Happy Valley tea estate.',
        meals: 'Breakfast & Dinner',
        hotel: 'Windamere Colonial Hotel',
      },
      {
        day: 6,
        title: 'Departure from Bagdogra',
        description: 'Morning scenic downhill drive to Bagdogra Airport.',
        meals: 'Breakfast',
        hotel: 'Check-out',
      },
    ],
    theme: 'Scenic',
  },
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
  "featured": false,
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
  "featured": true,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "featured": true,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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
  "featured": false,
  exclusions: HIMACHAL_EXCLUSIONS,
  thingsToCarry: HIMACHAL_THINGS_TO_CARRY,
  cancellationPolicy: HIMACHAL_CANCELLATION_POLICY,
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

export const stayTypes = ['Hotels', 'Resorts', 'Heritage Stays', 'Palace Stays', 'Beach Retreats', 'Houseboat Stays', 'Plantation Retreats'] as const

export const hotelStays: StayItem[] = [
  {
    id: 'stay-jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'Heritage Stays',
    name: 'Alsisar Haveli & Royal Courtyards',
    price: '₹9,800',
    priceNum: 9800,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=85',
    amenities: ['Heritage Architecture', 'Swimming Pool', 'Courtyard Dining', 'Spa & Wellness', 'Free Wi-Fi'],
    description:
      'A restored 18th-century Rajput mansion with frescoed ceilings, peaceful interior courtyards, and warm aristocratic hospitality.',
  },
  {
    id: 'stay-goa',
    city: 'Goa',
    state: 'Goa',
    type: 'Beach Retreats',
    name: 'Ahilya by the Sea, Dolphin Bay',
    price: '₹14,500',
    priceNum: 14500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=85',
    amenities: ['Direct Sea View', 'Infinity Pools', 'Private Beach Access', 'Chef’s Table', 'Lush Tropical Gardens'],
    description:
      'An intimate boutique escape perched right on the bay where dolphins play at dawn, blending Portuguese coastal charm with slow luxury.',
  },
  {
    id: 'stay-srinagar',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    type: 'Houseboat Stays',
    name: 'Mascot Cedar Luxury Houseboat',
    price: '₹8,200',
    priceNum: 8200,
    rating: 4.8,
    image: kashmirImage,
    amenities: ['Hand-carved Cedar Wood', 'Private Veranda', 'Dedicated Cook & Butler', 'Shikara Pickup', 'Fireplace'],
    description:
      'Floating heritage moored on quiet Nigeen Lake, offering warm Kashmiri hospitality, home-cooked Wazwan meals, and tranquil mornings.',
  },
  {
    id: 'stay-munnar',
    city: 'Munnar',
    state: 'Kerala',
    type: 'Plantation Retreats',
    name: 'Windermere Colonial Estate',
    price: '₹11,000',
    priceNum: 11000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=700&q=85',
    amenities: ['60-Acre Coffee & Tea Estate', 'Valley Mist Balconies', 'Naturalist Trails', 'Fireplace Lounge', 'Organic Farm Dining'],
    description:
      'A serene mountain sanctuary situated high up among cardamom and tea hills, where the clouds drift across your room window.',
  },
  {
    id: 'stay-udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    type: 'Palace Stays',
    name: 'Fateh Garh Heritage Sanctuary',
    price: '₹12,400',
    priceNum: 12400,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=85',
    amenities: ['Rooftop Infinity Pool', 'Vintage Car Museum', 'Lake Pichola Panoramic Vistas', 'Heritage Spa'],
    description:
      'Perched on a ridge overlooking the entire Udaipur basin, Fateh Garh was rebuilt stone by stone using eco-conservation principles.',
  },
]

export const roadTrips: RoadTripItem[] = [
  {
    id: 'konkan-coast',
    name: 'The Konkan Coastal Highway',
    route: 'Mumbai to Goa via Alibaug, Ganpatipule & Malvan',
    days: '6 Days',
    distance: '580 km',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=850&q=85',
    highlights: [
      'Vehicle ferry across Dharamtar Creek',
      'Uncrowded white sand beaches of Guhagar & Ganpatipule',
      'Authentic Malvani seafood dining & sea fort walks',
    ],
    description:
      'A dream coastal road trip with the Arabian Sea by your side, crossing estuaries by vehicle ferry, coconut groves, and sea forts.',
    stops: ['Mumbai', 'Alibaug', 'Murud Janjira', 'Ganpatipule', 'Tarkarli / Malvan', 'North Goa'],
  },
  {
    id: 'high-roads-ladakh',
    name: 'High Roads of Ladakh',
    route: 'Manali to Leh via Atal Tunnel, Jispa & Baralacha La',
    days: '9 Days',
    distance: '490 km (High Altitude)',
    difficulty: 'Challenging',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=850&q=85',
    highlights: [
      'Traverse high mountain passes over 16,500 ft',
      'Camp by the sapphire blue waters of Pangong Tso',
      'World’s highest motorable roads at Khardung La',
    ],
    description:
      'The crown jewel of Indian road expeditions. From green Kullu valley through deep rock canyons, moonscapes, and high-altitude Buddhist gompas.',
    stops: ['Manali', 'Jispa', 'Sarchu', 'Leh', 'Nubra Valley', 'Pangong Lake', 'Leh'],
  },
  {
    id: 'tea-country-trails',
    name: 'Nilgiri & Western Ghats Trail',
    route: 'Kochi to Munnar, Valparai & Ooty',
    days: '5 Days',
    distance: '380 km',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=850&q=85',
    highlights: [
      '40 hairpin bends with views over Anamalai Tiger Reserve',
      'Cool cloud-covered rainforest tracks and waterfalls',
      'Heritage British bungalows and fresh high-grown Nilgiri tea',
    ],
    description:
      'Climb from coastal coconut lowlands into pine forests and emerald carpeted hills with crisp mountain air.',
    stops: ['Kochi', 'Thattekad Bird Haven', 'Munnar', 'Valparai', 'Pollachi', 'Ooty'],
  },
]

export const stories: StoryItem[] = [
  {
    id: 'story-kashmir-spring',
    title: 'A Houseboat Morning on Nigeen Lake',
    category: 'Slow Travel',
    author: 'Aamir Mir & Priya Sharma',
    date: 'April 2026',
    readTime: '6 min read',
    image: kashmirImage,
    snippet:
      'Long before the first shikara ripples the mirror water, the smell of woodsmoke and saffron tea drifts across the cedar deck.',
    content: [
      'In Kashmir, spring arrives not with a calendar date, but with a sudden, quiet shift in the mountain air. On Nigeen Lake, tucked away from the busier waters of Dal, dawn breaks with an ethereal stillness.',
      'Our houseboat, handcrafted from aromatic Himalayan deodar cedar over six decades ago, creaks gently against its mooring rope. Nazir, our host whose grandfather originally laid the vessel’s cedar keel, brings out steaming brass cups of Kahwa.',
      'By 7:30 AM, our shikara glides silently into the blooming tulip fields at Siraj Bagh. Walking through red, yellow, and pastel purple ribbons beneath the Zabarwan range, you realize that true luxury in Kashmir is simply having time to pause.',
    ],
  },
  {
    id: 'story-kerala-tea',
    title: 'What the Cardamom Hills Taught Us About Time',
    category: 'Field Notes',
    author: 'Devika Menon',
    date: 'February 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85',
    snippet:
      'High in the Western Ghats, life is measured not in hours, but in the arrival of the afternoon mist.',
    content: [
      'We left the humid plains of Cochin behind at dawn. By midday, as the road curled upwards past spice gardens and banana trees, the temperature dropped ten degrees.',
      'At Windermere Estate, there are no televisions and no blaring alarms. Instead, naturalists guide you along trails through pepper vines, coffee bushes, and tea shrubs.',
      'In the evening, over a home-style supper of appams and coconut stew, the local planter told us stories of early tea pioneers who walked these hills with compass and walking stick.',
    ],
  },
  {
    id: 'story-rajasthan-road',
    title: 'Across the Thar: A Sandstone Diary',
    category: 'Road Journals',
    author: 'Rohan Mehra',
    date: 'January 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85',
    snippet:
      'Driving through Rajasthan reveals that the desert is never empty—it is full of songs, textiles, and courtyards that outlast empires.',
    content: [
      'There is a particular hour on the Jodhpur-Jaisalmer highway when the landscape turns from scrubland to shimmering gold.',
      'Stopping at a roadside dhabha for hot ginger chai and bajre ki roti, we watched a herd of chinkara deer leap across the horizon. At Sam Sand Dunes, the night air was biting cold, but the bonfire and soulful Manganiyar melodies made the Thar feel like the center of the universe.',
    ],
  },
]

export const offers: OfferItem[] = [
  {
    id: 'offer-early-summer',
    code: 'CRAZY15',
    title: 'Early Bird Summer Holiday Offer',
    discountText: 'Flat 15% OFF',
    tag: 'Limited Seats',
    validTill: 'Valid until 30th April 2026',
    description:
      'Book your summer getaway to Kashmir, Ladakh, or Himachal 45 days in advance and enjoy guaranteed luxury room upgrades.',
    minBooking: 'Min. booking ₹50,000',
    image: kashmirImage,
  },
  {
    id: 'offer-honeymoon-perks',
    code: 'ROMANCE',
    title: 'Honeymoon Special Inclusions',
    discountText: 'Complimentary Perks',
    tag: 'Couples Only',
    validTill: 'Year-Round',
    description:
      'Enjoy free candle-lit dinner, flower bed decoration, private shikara ride, and couple spa credits on all Kerala and Kashmir honeymoon packages.',
    minBooking: 'Applicable on 5+ days trips',
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'offer-family-escape',
    code: 'FAMILYFUN',
    title: 'Family Explorer Discount',
    discountText: 'Free Child Package',
    tag: 'Best for Families',
    validTill: 'Valid till 31st May 2026',
    description:
      'Children under 10 travel free (hotel stay & meals) on all Andaman, Rajasthan, and Golden Triangle family group bookings.',
    minBooking: 'Min. 2 paying adults',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=700&q=85',
  },
]

export const reviews: ReviewItem[] = [
  {
    id: 'rev-1',
    quote:
      'Our Kashmir journey with Crazy Tours Travel felt completely personal. The quiet houseboat on Nigeen Lake and family orchard lunch were moments we would never have found ourselves.',
    name: 'Anika & Rohan Sengupta',
    trip: 'Kashmir Spring Tour, April 2025',
    rating: 5,
  },
  {
    id: 'rev-2',
    quote:
      'Everything was calm, considered, and impeccably organized—from the first planning call with their travel designer to our drive through Kerala’s tea country. 24/7 on-trip support was outstanding.',
    name: 'Meera & Rajesh Shah',
    trip: 'Kerala Backwaters & Tea Trails, June 2025',
    rating: 5,
  },
  {
    id: 'rev-3',
    quote:
      'The Rajasthan road trip balanced royal haveli stays with true local discoveries. Even our teenagers said it was the best vacation our family has ever taken. Crazy Tours Travel is now our go-to!',
    name: 'The Iyer Family',
    trip: 'Royal Rajasthan Circuit, January 2026',
    rating: 5,
  },
  {
    id: 'rev-4',
    quote:
      'Booking our Andaman scuba getaway was seamless. Transparent pricing, no hidden costs at checkout, and our villa at Havelock was right on the beach.',
    name: 'Vikram Joshi & Friends',
    trip: 'Andaman Coral Retreat, November 2025',
    rating: 5,
  },
]

export const faqs: FAQItem[] = [
  {
    question: 'What makes Crazy Tours Travel different from regular booking websites?',
    answer:
      'We do not sell cookie-cutter packages. Every journey is curated by travel designers who have personally visited the destinations, stayed in the properties, and verified local drivers and guides. You get human travel design with transparent pricing and 24/7 on-trip concierge assistance.',
    category: 'About Us',
  },
  {
    question: 'Can I customise any tour package on the website?',
    answer:
      'Yes, 100%! All our itineraries are flexible starting points. You can add days, upgrade hotels to 5-star heritage properties, swap experiences, or request custom private transport. Click "Plan This Journey" or use our Custom Trip Builder.',
    category: 'Customization',
  },
  {
    question: 'How do bookings and payments work?',
    answer:
      'Once you choose or customize your journey, our travel designer confirms availability. You confirm with a standard 25% deposit via secure payment link (Credit Card, Net Banking, UPI, EMI). The remaining balance is payable prior to departure.',
    category: 'Booking & Payment',
  },
  {
    question: 'What is your cancellation and refund policy?',
    answer:
      'We offer traveler-friendly policies: cancellations made 30+ days before travel receive a full refund minus minimal non-refundable hotel/airline retainers. In case of unexpected weather or flight disruptions, our 24/7 team arranges seamless rescheduling.',
    category: 'Policies',
  },
  {
    question: 'Are flights and airport transfers included?',
    answer:
      'All our packages include private airport/railway transfers in sanitized, dedicated air-conditioned vehicles. Domestic flights can be bundled seamlessly into your quote at live airline rates.',
    category: 'Inclusions',
  },
  {
    question: 'Will I have on-trip support during my holiday?',
    answer:
      'Yes! You receive a dedicated WhatsApp Concierge and 24/7 emergency support line. From the moment you land until you board your return flight, our local team is just a message or call away.',
    category: 'Support',
  },
]

export const officeLocations: OfficeLocation[] = [
  {
    city: 'Mumbai (Headquarters)',
    address: 'Level 4, Express Towers, Nariman Point, Marine Drive, Mumbai 400021',
    phone: '+91 8047 112 112',
    email: 'mumbai@crazytourstravels.com',
    hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
  },
  {
    city: 'New Delhi',
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
  { place: 'Himachal Pradesh', image: socialHimachal, duration: '0:30', caption: 'High mountain tea at 9,000 ft above Manali.' },
  { place: 'Kedarnath Valley', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=650&q=85', duration: '0:45', caption: 'Chanting and snow peaks along the sacred trail.' },
  { place: 'Kochi Backwaters', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=650&q=85', duration: '0:35', caption: 'Sunset silhouettes over ancient Chinese fishing nets.' },
  { place: 'Ladakh High Pass', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=650&q=85', duration: '0:50', caption: 'Wind prayer flags fluttering at Khardung La.' },
]

export const instagramReels: InstagramReelItem[] = [
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

export const directoryGroups = {
  'North India': [
    'Kashmir holiday packages',
    'Ladakh motor expeditions',
    'Himachal mountain escapes',
    'Uttarakhand spiritual trails',
    'Royal Rajasthan havelis',
    'Varanasi cultural weekends',
  ],
  'South India': [
    'Kerala backwater houseboats',
    'Karnataka ancient heritage',
    'Tamil Nadu temple trails',
    'Goa luxury beach stays',
    'Andhra coastal retreats',
    'Lakshadweep island cruises',
  ],
  'Travel Styles': [
    'Romantic honeymoon journeys',
    'Luxury family holidays',
    'Scenic road trips & self-drive',
    'Slow travel & heritage stays',
    'Wildlife & nature safaris',
    'Wellness & ayurvedic retreats',
    'Private small-group tours',
    'Seasonal festival departures',
  ],
}
