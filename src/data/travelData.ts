import {
  Currency,
  CurrencyConfig,
  DestinationItem,
  FAQItem,
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
    ],
    bestTimeToVisit: 'October to May (calm sea conditions and high underwater visibility)',
    idealFor: 'Beach Enthusiasts, Scuba Divers & Honeymoon Couples',
  },
]

export const allPackages: PackageItem[] = [
  {
    id: 'kashmir-tulips',
    title: 'Tulips, Houseboats & High Meadows',
    place: 'Kashmir',
    state: 'Jammu & Kashmir',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
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
]

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
      'Our Kashmir journey with Crazy Tours Travels felt completely personal. The quiet houseboat on Nigeen Lake and family orchard lunch were moments we would never have found ourselves.',
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
      'The Rajasthan road trip balanced royal haveli stays with true local discoveries. Even our teenagers said it was the best vacation our family has ever taken. Crazy Tours Travels is now our go-to!',
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
    question: 'What makes Crazy Tours Travels different from regular booking websites?',
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
