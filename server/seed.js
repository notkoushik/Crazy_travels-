import fs from 'node:fs'
import path from 'node:path'
import { pool } from './db.js'

async function runSeed() {
  console.log('Connecting to PostgreSQL crazy_tours_db...')
  const client = await pool.connect()

  try {
    // 1. Run Schema
    console.log('Applying database schema...')
    const schemaPath = path.resolve(import.meta.dirname, './schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    await client.query(schemaSql)
    console.log('Database schema applied successfully.')

    // 2. Seed Destinations (with Rajasthan Fort Arch specifications)
    console.log('Seeding destinations...')
    const destinations = [
      {
        slug: 'udaipur',
        city: 'Udaipur',
        country: 'Rajasthan',
        state: 'Rajasthan',
        price: '₹32,500',
        price_num: 32500,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88',
        season: 'October to March',
        duration: '5 days',
        tagline: 'Lake light and living royal history',
        description: 'Slow mornings by the water, intimate heritage stays, and the quiet romance of Rajasthan’s white city.',
        highlights: JSON.stringify(['Private old-city artisan walk', 'Sunset boat cruise on Lake Pichola', 'Haveli lunch & vintage car museum']),
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=85',
        ]),
        best_time_to_visit: 'September to March (cool breezes and clear skies)',
        ideal_for: 'Couples, Architecture Lovers & Photography Enthusiasts',
        is_trending: true,
        display_order: 1,
      },
      {
        slug: 'munnar',
        city: 'Munnar',
        country: 'Kerala',
        state: 'Kerala',
        price: '₹28,900',
        price_num: 28900,
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88',
        season: 'September to May',
        duration: '5 days',
        tagline: 'Tea gardens above the clouds',
        description: 'Wake to rolling emerald hills, walk with local naturalists, taste freshly plucked tea, and experience Kerala at its purest.',
        highlights: JSON.stringify(['Private tea estate & factory heritage walk', 'Eravikulam National Park with a naturalist', 'Supper at a 100-year colonial plantation']),
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85',
        ]),
        best_time_to_visit: 'August to May (misty mornings, waterfalls in full flow)',
        ideal_for: 'Honeymooners, Nature Lovers & Slow Travelers',
        is_trending: true,
        display_order: 2,
      },
      {
        slug: 'hampi',
        city: 'Hampi',
        country: 'Karnataka',
        state: 'Karnataka',
        price: '₹24,400',
        price_num: 24400,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=88',
        season: 'October to February',
        duration: '4 days',
        tagline: 'Ruins, boulders and golden twilight',
        description: 'Explore the ancient Vijayanagara capital at an unhurried human pace, from riverside temples to sunset atop granite boulder ridges.',
        highlights: JSON.stringify(['Expert archaeological heritage storyteller', 'Traditional coracle river crossing across Tungabhadra', 'Sunrise viewpoint climb over Matanga Hill']),
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=85',
        ]),
        best_time_to_visit: 'October to March (pleasant walking climate)',
        ideal_for: 'History Buffs, Explorers & Solo Wanderers',
        is_trending: true,
        display_order: 3,
      },
      {
        slug: 'srinagar',
        city: 'Srinagar',
        country: 'Kashmir',
        state: 'Jammu & Kashmir',
        price: '₹36,800',
        price_num: 36800,
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88',
        season: 'March to October',
        duration: '6 days',
        tagline: 'A valley bathed in full floral colour',
        description: 'Mughal gardens, crisp Himalayan breezes, cedar-wood houseboats and tranquil shikara evenings woven into an unforgettable escape.',
        highlights: JSON.stringify(['Cedar boutique houseboat stay on Nigeen Lake', 'VIP morning access to Tulip Garden', 'Day journey into Gulmarg alpine meadows']),
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
        ]),
        best_time_to_visit: 'March to October (Tulip blooms in spring, apple harvests in autumn)',
        ideal_for: 'Families, Couples & Mountain Wanderers',
        is_trending: true,
        display_order: 4,
      },
      {
        slug: 'gangtok',
        city: 'Gangtok',
        country: 'Sikkim',
        state: 'Sikkim',
        price: '₹31,500',
        price_num: 31500,
        image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=88',
        season: 'March to June',
        duration: '6 days',
        tagline: 'Monasteries beneath snowy Himalayan peaks',
        description: 'A mindful Himalayan haven of winding pine forest roads, chanting monasteries, organic tea valleys, and welcoming local kitchens.',
        highlights: JSON.stringify(['Exclusive Rumtek & Enchey monastery morning trail', 'Glacial excursion to turquoise Tsomgo Lake', 'Homestyle Sikkimese lunch in a rural farmhouse']),
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=85',
        ]),
        best_time_to_visit: 'March to June & October to December',
        ideal_for: 'Culture Seekers, Trekkers & Spiritual Travellers',
        is_trending: true,
        display_order: 5,
      },
      {
        slug: 'andaman',
        city: 'Andaman',
        country: 'Bay of Bengal',
        state: 'Andaman & Nicobar Islands',
        price: '₹42,000',
        price_num: 42000,
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88',
        season: 'October to May',
        duration: '6 days',
        tagline: 'Turquoise island lagoons and pristine coral atolls',
        description: 'Glass-clear warm ocean waters, virgin rainforest fringes, bioluminescent night kayak trips, and unhurried luxury barefoot living.',
        highlights: JSON.stringify(['Guided coral reef snorkelling in Havelock', 'Radhanagar beach sunset picnic setup', 'Baratang mangrove boat safari']),
        gallery: JSON.stringify([
          'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=85',
        ]),
        best_time_to_visit: 'October to May (calm sea conditions and high visibility)',
        ideal_for: 'Beach Enthusiasts, Scuba Divers & Honeymoon Couples',
        is_trending: true,
        display_order: 6,
      },
    ]

    for (const d of destinations) {
      await client.query(
        `INSERT INTO destinations (slug, city, country, state, price, price_num, image, season, duration, tagline, description, highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (slug) DO UPDATE SET
           city = EXCLUDED.city,
           country = EXCLUDED.country,
           state = EXCLUDED.state,
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
           display_order = EXCLUDED.display_order`,
        [
          d.slug, d.city, d.country, d.state, d.price, d.price_num, d.image,
          d.season, d.duration, d.tagline, d.description, d.highlights, d.gallery,
          d.best_time_to_visit, d.ideal_for, d.is_trending, d.display_order
        ]
      )
    }

    // 3. Seed Tour Packages
    console.log('Seeding tour packages...')
    const packages = [
      {
        id: 'kashmir-tulips',
        slug: 'kashmir-tulips',
        title: 'Tulips, Houseboats & High Meadows',
        place: 'Kashmir',
        state: 'Jammu & Kashmir',
        duration: '6 Days / 5 Nights',
        days_count: 6,
        price: '₹36,800',
        price_num: 36800,
        original_price: '₹44,000',
        discount: '16% OFF',
        rating: 4.9,
        review_count: 28,
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88',
        overview: 'Experience the magic of spring as millions of tulips bloom against the snow-capped Zabarwan range.',
        highlights: JSON.stringify(['Private cedar houseboat stay on Nigeen Lake', 'VIP morning entry to Asia’s largest Tulip Garden', 'Day trip to Gulmarg with Phase-1 Gondola tickets']),
        inclusions: JSON.stringify(['5 Nights Premium Accommodation', 'Daily Breakfast & 4-Course Dinner', 'All Sightseeing via Private Innova Crysta', '1-Hour Sunset Shikara Ride']),
        exclusions: JSON.stringify(['Airfare to/from Srinagar', 'Phase-2 Gondola / Pony rides', 'Personal tips']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Srinagar & Nigeen Lake Houseboat', description: 'Warm Kashmiri welcome with spiced Kehwa.' },
          { day: 2, title: 'Tulip Garden & Mughal Terraces', description: 'Wander amidst 1.5 million tulips at the Indira Gandhi Memorial Garden.' },
          { day: 3, title: 'Alpine Splendour of Gulmarg', description: 'Scenic drive to Gulmarg with panoramic views of Mount Apharwat.' },
          { day: 4, title: 'Pahalgam Valley of Shepherds', description: 'Drive along the saffron fields of Pampore to the pristine Lidder river.' },
          { day: 5, title: 'Old City Artisans & Saffron Trail', description: 'Private heritage walk visiting walnut carvers and Pashmina weavers.' },
          { day: 6, title: 'Farewell Kashmir', description: 'Morning lakeside breakfast and private transfer to Srinagar airport.' },
        ]),
        theme: 'Honeymoon',
        featured: true,
      },
      {
        id: 'kerala-backwaters',
        slug: 'kerala-backwaters',
        title: 'Tea Trails, Mist & Backwater Serenity',
        place: 'Kerala',
        state: 'Kerala',
        duration: '7 Days / 6 Nights',
        days_count: 7,
        price: '₹42,900',
        price_num: 42900,
        original_price: '₹51,000',
        discount: '15% OFF',
        rating: 4.95,
        review_count: 34,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=88',
        overview: 'From misty high-altitude tea plantations in Munnar to peaceful canals on a private luxury houseboat.',
        highlights: JSON.stringify(['Private plantation bungalow stay in Munnar', 'Overnight cruise on Alleppey backwaters', 'Ayurvedic wellness rejuvenation treatment']),
        inclusions: JSON.stringify(['6 Nights Accommodation', 'Daily Gourmet Breakfast & Chef house meals', 'Private Air-Conditioned SUV throughout', 'Houseboat full-board stay']),
        exclusions: JSON.stringify(['Airfare to Kochi', 'Alcoholic beverages', 'Personal expenses']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Kochi', description: 'Fort Kochi heritage walk and Kathakali performance.' },
          { day: 2, title: 'Ascent to Munnar Hills', description: 'Drive through rubber and cardamom plantations.' },
          { day: 3, title: 'Tea Estate Trail & National Park', description: 'Tea factory museum and Nilgiri Tahr safari.' },
          { day: 4, title: 'Thekkady Periyar Wildlife Sanctuary', description: 'Spice garden walk and evening lake boat safari.' },
          { day: 5, title: 'Boarding the Alleppey Houseboat', description: 'Private kettuvalam houseboat with chef prepared Karimeen.' },
          { day: 6, title: 'Marari Beach Relaxation', description: 'Boutique coconut grove beachfront hideaway.' },
          { day: 7, title: 'Departure from Kochi', description: 'Souvenir shopping and airport transfer.' },
        ]),
        theme: 'Family',
        featured: true,
      },
      {
        id: 'rajasthan-royals',
        slug: 'rajasthan-royals',
        title: 'Palaces, Dunes & Desert Stars',
        place: 'Rajasthan',
        state: 'Rajasthan',
        duration: '8 Days / 7 Nights',
        days_count: 8,
        price: '₹48,500',
        price_num: 48500,
        original_price: '₹58,000',
        discount: '16% OFF',
        rating: 4.9,
        review_count: 42,
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88',
        overview: 'Live like royalty through the grand forts of Jaipur, blue alleyways of Jodhpur, and golden lakes of Udaipur.',
        highlights: JSON.stringify(['Curated boutique haveli stays', 'Private sunset desert camel safari in Sam dunes', 'Lake Pichola royal cruise in Udaipur']),
        inclusions: JSON.stringify(['7 Nights Heritage Stay', 'Breakfast & Royal Welcome Dinners', 'All Transfers via Luxury SUV', 'All Monument Entry Tickets']),
        exclusions: JSON.stringify(['Domestic flights', 'Camera fees at monuments', 'Tips']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Royal Welcome in Jaipur', description: 'Check in to a restored 18th-century heritage haveli.' },
          { day: 2, title: 'Amer Fort & City Palace', description: 'Elephant-view drive, Sheesh Mahal and Hawa Mahal.' },
          { day: 3, title: 'Blue City of Jodhpur', description: 'Mehrangarh Fort and sunset view from stepwell terrace.' },
          { day: 4, title: 'Thar Desert Glamping in Jaisalmer', description: 'Luxury tents under the desert starlight.' },
          { day: 5, title: 'Golden City Exploration', description: 'Living fort architecture and intricate Jain temples.' },
          { day: 6, title: 'Drive to Lake City Udaipur', description: 'Visit Ranakpur marble temples en route.' },
          { day: 7, title: 'Lake Pichola & Jagmandir Island', description: 'Private boat excursion and sunset dinner.' },
          { day: 8, title: 'Farewell Rajasthan', description: 'Morning stroll around Saheliyon-ki-Bari and departure.' },
        ]),
        theme: 'Heritage',
        featured: true,
      },
      {
        id: 'andaman-paradise',
        slug: 'andaman-paradise',
        title: 'Azure Waters & Coral Reefs',
        place: 'Andaman Islands',
        state: 'Andaman & Nicobar',
        duration: '6 Days / 5 Nights',
        days_count: 6,
        price: '₹42,000',
        price_num: 42000,
        original_price: '₹49,000',
        discount: '14% OFF',
        rating: 4.88,
        review_count: 19,
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88',
        overview: 'Pristine white sand beaches, bioluminescent night kayaking, and world-class scuba diving.',
        highlights: JSON.stringify(['Radhanagar Beach rated Asia’s best', 'Elephant Beach guided snorkelling session', 'Luxury beachfront eco-villa in Havelock']),
        inclusions: JSON.stringify(['5 Nights Beach Villa Accommodation', 'Daily Buffet Breakfast', 'High-Speed Catamaran Ferry Tickets', 'Airport & Jetty Pickups']),
        exclusions: JSON.stringify(['Flights to Port Blair', 'Scuba diving certification courses', 'Water sports insurance']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Port Blair & Cellular Jail', description: 'Historical light and sound show.' },
          { day: 2, title: 'High-Speed Ferry to Havelock Island', description: 'Check-in to luxury beachfront villa.' },
          { day: 3, title: 'Radhanagar Sunset & Elephant Beach', description: 'Snorkelling over live coral gardens.' },
          { day: 4, title: 'Neil Island Tranquility', description: 'Natural bridge rock formations and Bharatpur beach.' },
          { day: 5, title: 'Return to Port Blair & Chidiya Tapu', description: 'Sunset bird-watching point.' },
          { day: 6, title: 'Departure', description: 'Morning breakfast and flight back home.' },
        ]),
        theme: 'Adventure',
        featured: true,
      },
      {
        id: 'sikkim-himalaya',
        slug: 'sikkim-himalaya',
        title: 'Himalayan Monasteries & Glacial Lakes',
        place: 'Sikkim & Darjeeling',
        state: 'Sikkim',
        duration: '6 Days / 5 Nights',
        days_count: 6,
        price: '₹31,500',
        price_num: 31500,
        original_price: '₹37,000',
        discount: '15% OFF',
        rating: 4.85,
        review_count: 22,
        image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=88',
        overview: 'Panoramic views of Mount Kanchenjunga, ancient Buddhist monasteries, and high-altitude glacial lakes.',
        highlights: JSON.stringify(['Sunrise over Kanchenjunga from Tiger Hill', 'Excursion to turquoise Tsomgo Lake at 12,310 ft', 'Private monastery blessing session in Rumtek']),
        inclusions: JSON.stringify(['5 Nights Deluxe Stay', 'Daily Breakfast & Dinner', 'Private 4x4 SUV with Mountain Driver', 'All Permits & Entry Passes']),
        exclusions: JSON.stringify(['Toy train joyride tickets', 'Personal laundry & phone calls', 'Tips']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Bagdogra & Drive to Gangtok', description: 'Scenic drive along Teesta river.' },
          { day: 2, title: 'Tsomgo Lake & Baba Mandir', description: 'High mountain pass near Indo-China border.' },
          { day: 3, title: 'Rumtek Monastery & Flower Show', description: 'Tibetan spiritual traditions and Himalayan fauna.' },
          { day: 4, title: 'Scenic Drive to Darjeeling', description: 'Through fragrant pine and tea estates.' },
          { day: 5, title: 'Tiger Hill Sunrise & Tea Gardens', description: 'Golden dawn illumination on Kanchenjunga.' },
          { day: 6, title: 'Farewell Hills', description: 'Transfer to Bagdogra airport for return journey.' },
        ]),
        theme: 'Scenic',
        featured: true,
      },
    ]

    for (const p of packages) {
      await client.query(
        `INSERT INTO packages (id, slug, title, place, state, duration, days_count, price, price_num, original_price, discount, rating, review_count, image, overview, highlights, inclusions, exclusions, itinerary, theme, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug,
           title = EXCLUDED.title,
           place = EXCLUDED.place,
           state = EXCLUDED.state,
           duration = EXCLUDED.duration,
           days_count = EXCLUDED.days_count,
           price = EXCLUDED.price,
           price_num = EXCLUDED.price_num,
           original_price = EXCLUDED.original_price,
           discount = EXCLUDED.discount,
           rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count,
           image = EXCLUDED.image,
           overview = EXCLUDED.overview,
           highlights = EXCLUDED.highlights,
           inclusions = EXCLUDED.inclusions,
           exclusions = EXCLUDED.exclusions,
           itinerary = EXCLUDED.itinerary,
           theme = EXCLUDED.theme,
           featured = EXCLUDED.featured`,
        [
          p.id, p.slug, p.title, p.place, p.state, p.duration, p.days_count, p.price, p.price_num,
          p.original_price, p.discount, p.rating, p.review_count, p.image, p.overview,
          p.highlights, p.inclusions, p.exclusions, p.itinerary, p.theme, p.featured
        ]
      )
    }

    // 4. Seed Bookings
    console.log('Seeding customer bookings...')
    const bookings = [
      {
        booking_id: 'CT-849201',
        package_name: 'Tulips, Houseboats & High Meadows',
        travel_date: '2026-04-12',
        adults: 2,
        children: 0,
        hotel_type: 'Luxury 5-Star',
        customer_name: 'Aditya & Priya Sharma',
        customer_email: 'aditya.sharma@example.com',
        customer_phone: '+91 98201 44521',
        special_requests: 'Nigeen Lake Cedar houseboat balcony facing sunrise, anniversary champagne setup.',
        total_price: 88320,
        status: 'Confirmed',
        payment_status: 'Fully Paid',
      },
      {
        booking_id: 'CT-773194',
        package_name: 'Palaces, Dunes & Desert Stars',
        travel_date: '2026-03-05',
        adults: 4,
        children: 2,
        hotel_type: 'Deluxe',
        customer_name: 'Vikramaditya Rathore',
        customer_email: 'rathore.v@example.com',
        customer_phone: '+91 94140 88290',
        special_requests: 'Private vintage car transfer from Udaipur airport, inter-connecting haveli suites.',
        total_price: 156000,
        status: 'Voucher Issued',
        payment_status: 'Fully Paid',
      },
      {
        booking_id: 'CT-621809',
        package_name: 'Tea Trails, Mist & Backwater Serenity',
        travel_date: '2026-05-18',
        adults: 2,
        children: 1,
        hotel_type: 'Standard',
        customer_name: 'Deepak & Sneha Kulkarni',
        customer_email: 'deepak.kulkarni@example.com',
        customer_phone: '+91 98902 11983',
        special_requests: 'Ground floor cottage, organic vegan Kerala meal requests on day 3.',
        total_price: 66470,
        status: 'Pending',
        payment_status: 'Deposit Paid',
      },
      {
        booking_id: 'CT-550182',
        package_name: 'Azure Waters & Coral Reefs',
        travel_date: '2026-02-14',
        adults: 2,
        children: 0,
        hotel_type: 'Luxury 5-Star',
        customer_name: 'Rohan Mehra & Tanya Sen',
        customer_email: 'tanya.sen@example.com',
        customer_phone: '+91 97110 33901',
        special_requests: 'Candlelight dinner on Radhanagar beach, scuba diving briefing in Havelock.',
        total_price: 100800,
        status: 'Confirmed',
        payment_status: 'Fully Paid',
      },
    ]

    for (const b of bookings) {
      await client.query(
        `INSERT INTO bookings (booking_id, package_name, travel_date, adults, children, hotel_type, customer_name, customer_email, customer_phone, special_requests, total_price, status, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (booking_id) DO UPDATE SET
           status = EXCLUDED.status,
           payment_status = EXCLUDED.payment_status`,
        [
          b.booking_id, b.package_name, b.travel_date, b.adults, b.children,
          b.hotel_type, b.customer_name, b.customer_email, b.customer_phone,
          b.special_requests, b.total_price, b.status, b.payment_status
        ]
      )
    }

    // 5. Seed Inquiries (CRM Leads)
    console.log('Seeding custom inquiries...')
    const inquiries = [
      {
        id: 'INQ-9012',
        full_name: 'Dr. Siddharth Varma',
        email: 'siddharth.v@gmail.com',
        phone: '+91 98450 12890',
        preferred_destination: 'Kashmir & Ladakh High Passes',
        travel_month: 'June 2026',
        travelers_count: 'Family of 4',
        budget_per_person: '₹60,000 - ₹80,000',
        trip_type: 'Family Vacation',
        notes: 'Looking for high-comfort private SUV transport with oxygen backup for elderly parents.',
        status: 'New',
        assigned_agent: 'Kavita Iyer (Senior Specialist)',
      },
      {
        id: 'INQ-8841',
        full_name: 'Ananya & Kabir Roy',
        email: 'ananya.roy@deloitte.com',
        phone: '+91 99302 77102',
        preferred_destination: 'Udaipur & Jodhpur Luxury Havelis',
        travel_month: 'October 2026',
        travelers_count: 'Couple (Honeymoon)',
        budget_per_person: '₹1,00,000+',
        trip_type: 'Honeymoon',
        notes: 'Require private palace terrace dinners and heritage photographer for 1 half-day.',
        status: 'Quoted',
        assigned_agent: 'Rahul Deshmukh (Heritage Lead)',
      },
      {
        id: 'INQ-7630',
        full_name: 'Aarav Singhania',
        email: 'aarav.singhania@corp.in',
        phone: '+91 98100 44928',
        preferred_destination: 'Andaman Scuba & Private Yacht',
        travel_month: 'December 2026',
        travelers_count: 'Group of 6',
        budget_per_person: '₹75,000 - ₹1,00,000',
        trip_type: 'Adventure Group',
        notes: 'All travelers are certified PADI divers. Looking for deep reef excursions.',
        status: 'Contacted',
        assigned_agent: 'Sameer Sen (Coastal Specialist)',
      },
    ]

    for (const inq of inquiries) {
      await client.query(
        `INSERT INTO inquiries (id, full_name, email, phone, preferred_destination, travel_month, travelers_count, budget_per_person, trip_type, notes, status, assigned_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status,
           assigned_agent = EXCLUDED.assigned_agent`,
        [
          inq.id, inq.full_name, inq.email, inq.phone, inq.preferred_destination,
          inq.travel_month, inq.travelers_count, inq.budget_per_person,
          inq.trip_type, inq.notes, inq.status, inq.assigned_agent
        ]
      )
    }

    // 6. Seed Stays
    console.log('Seeding stays...')
    const stays = [
      {
        id: 'stay-jaipur',
        city: 'Jaipur',
        state: 'Rajasthan',
        type: 'Heritage Stays',
        name: 'Alsisar Haveli & Royal Courtyards',
        price: '₹9,800',
        price_num: 9800,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88',
        amenities: JSON.stringify(['Heritage Architecture', 'Swimming Pool', 'Courtyard Dining', 'Spa & Wellness', 'Free Wi-Fi']),
        description: 'A restored 18th-century Rajput mansion with frescoed ceilings, peaceful interior courtyards, and warm aristocratic hospitality.',
      },
      {
        id: 'stay-goa',
        city: 'Goa',
        state: 'Goa',
        type: 'Beach Retreats',
        name: 'Ahilya by the Sea, Dolphin Bay',
        price: '₹14,500',
        price_num: 14500,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=88',
        amenities: JSON.stringify(['Direct Sea View', 'Infinity Pools', 'Private Beach Access', 'Chef’s Table', 'Lush Tropical Gardens']),
        description: 'An intimate boutique escape perched right on the bay where dolphins play at dawn, blending Portuguese coastal charm with slow luxury.',
      },
      {
        id: 'stay-srinagar',
        city: 'Srinagar',
        state: 'Jammu & Kashmir',
        type: 'Houseboat Stays',
        name: 'Mascot Cedar Luxury Houseboat',
        price: '₹8,200',
        price_num: 8200,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88',
        amenities: JSON.stringify(['Hand-carved Cedar Wood', 'Private Veranda', 'Dedicated Cook & Butler', 'Shikara Pickup', 'Fireplace']),
        description: 'Floating heritage moored on quiet Nigeen Lake, offering warm Kashmiri hospitality, home-cooked Wazwan meals, and tranquil mornings.',
      },
      {
        id: 'stay-munnar',
        city: 'Munnar',
        state: 'Kerala',
        type: 'Plantation Retreats',
        name: 'Windermere Colonial Estate',
        price: '₹11,000',
        price_num: 11000,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88',
        amenities: JSON.stringify(['60-Acre Coffee & Tea Estate', 'Valley Mist Balconies', 'Naturalist Trails', 'Fireplace Lounge', 'Organic Farm Dining']),
        description: 'A serene mountain sanctuary situated high up among cardamom and tea hills, where the clouds drift across your room window.',
      },
      {
        id: 'stay-udaipur',
        city: 'Udaipur',
        state: 'Rajasthan',
        type: 'Palace Stays',
        name: 'Fateh Garh Heritage Sanctuary',
        price: '₹12,400',
        price_num: 12400,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88',
        amenities: JSON.stringify(['Rooftop Infinity Pool', 'Vintage Car Museum', 'Lake Pichola Panoramic Vistas', 'Heritage Spa']),
        description: 'Perched on a ridge overlooking the entire Udaipur basin, Fateh Garh was rebuilt stone by stone using eco-conservation principles.',
      },
    ]

    for (const s of stays) {
      await client.query(
        `INSERT INTO stays (id, city, state, type, name, price, price_num, rating, image, amenities, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           price = EXCLUDED.price,
           price_num = EXCLUDED.price_num,
           image = EXCLUDED.image,
           amenities = EXCLUDED.amenities,
           description = EXCLUDED.description`,
        [s.id, s.city, s.state, s.type, s.name, s.price, s.price_num, s.rating, s.image, s.amenities, s.description]
      )
    }

    // 7. Seed Road Trips
    console.log('Seeding road trips...')
    const roadTrips = [
      {
        id: 'konkan-coast',
        name: 'The Konkan Coastal Highway',
        route: 'Mumbai to Goa via Alibaug, Ganpatipule & Malvan',
        days: '6 Days',
        distance: '580 km',
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=88',
        highlights: JSON.stringify(['Vehicle ferry across Dharamtar Creek', 'Uncrowded white sand beaches of Guhagar & Ganpatipule', 'Authentic Malvani seafood dining & sea fort walks']),
        description: 'A dream coastal road trip with the Arabian Sea by your side, crossing estuaries by vehicle ferry, coconut groves, and sea forts.',
        stops: JSON.stringify(['Mumbai', 'Alibaug', 'Murud Janjira', 'Ganpatipule', 'Tarkarli / Malvan', 'North Goa']),
      },
      {
        id: 'high-roads-ladakh',
        name: 'High Roads of Ladakh',
        route: 'Manali to Leh via Atal Tunnel, Jispa & Baralacha La',
        days: '9 Days',
        distance: '490 km (High Altitude)',
        difficulty: 'Challenging',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=88',
        highlights: JSON.stringify(['Traverse high mountain passes over 16,500 ft', 'Camp by the sapphire blue waters of Pangong Tso', 'World’s highest motorable roads at Khardung La']),
        description: 'The crown jewel of Indian road expeditions. From green Kullu valley through deep rock canyons, moonscapes, and high-altitude Buddhist gompas.',
        stops: JSON.stringify(['Manali', 'Jispa', 'Sarchu', 'Leh', 'Nubra Valley', 'Pangong Lake', 'Leh']),
      },
      {
        id: 'tea-country-trails',
        name: 'Nilgiri & Western Ghats Trail',
        route: 'Kochi to Munnar, Valparai & Ooty',
        days: '5 Days',
        distance: '380 km',
        difficulty: 'Moderate',
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88',
        highlights: JSON.stringify(['40 hairpin bends with views over Anamalai Tiger Reserve', 'Cool cloud-covered rainforest tracks and waterfalls', 'Heritage British bungalows and fresh high-grown Nilgiri tea']),
        description: 'Climb from coastal coconut lowlands into pine forests and emerald carpeted hills with crisp mountain air.',
        stops: JSON.stringify(['Kochi', 'Thattekad Bird Haven', 'Munnar', 'Valparai', 'Pollachi', 'Ooty']),
      },
    ]

    for (const rt of roadTrips) {
      await client.query(
        `INSERT INTO road_trips (id, name, route, days, distance, difficulty, image, highlights, description, stops)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           route = EXCLUDED.route,
           days = EXCLUDED.days,
           distance = EXCLUDED.distance,
           difficulty = EXCLUDED.difficulty,
           image = EXCLUDED.image,
           highlights = EXCLUDED.highlights,
           description = EXCLUDED.description,
           stops = EXCLUDED.stops`,
        [rt.id, rt.name, rt.route, rt.days, rt.distance, rt.difficulty, rt.image, rt.highlights, rt.description, rt.stops]
      )
    }

    // 8. Seed Stories
    console.log('Seeding travel stories...')
    const stories = [
      {
        id: 'story-kashmir-spring',
        title: 'A Houseboat Morning on Nigeen Lake',
        category: 'Slow Travel',
        author: 'Aamir Mir & Priya Sharma',
        date: 'April 2026',
        read_time: '6 min read',
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88',
        snippet: 'Long before the first shikara ripples the mirror water, the smell of woodsmoke and saffron tea drifts across the cedar deck.',
        content: JSON.stringify([
          'In Kashmir, spring arrives not with a calendar date, but with a sudden, quiet shift in the mountain air. On Nigeen Lake, tucked away from the busier waters of Dal, dawn breaks with an ethereal stillness.',
          'Our houseboat, handcrafted from aromatic Himalayan deodar cedar over six decades ago, creaks gently against its mooring rope. Nazir, our host whose grandfather originally laid the vessel’s cedar keel, brings out steaming brass cups of Kahwa.',
          'By 7:30 AM, our shikara glides silently into the blooming tulip fields at Siraj Bagh. Walking through red, yellow, and pastel purple ribbons beneath the Zabarwan range, you realize that true luxury in Kashmir is simply having time to pause.',
        ]),
      },
      {
        id: 'story-kerala-tea',
        title: 'What the Cardamom Hills Taught Us About Time',
        category: 'Field Notes',
        author: 'Devika Menon',
        date: 'February 2026',
        read_time: '5 min read',
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88',
        snippet: 'High in the Western Ghats, life is measured not in hours, but in the arrival of the afternoon mist.',
        content: JSON.stringify([
          'We left the humid plains of Cochin behind at dawn. By midday, as the road curled upwards past spice gardens and banana trees, the temperature dropped ten degrees.',
          'At Windermere Estate, there are no televisions and no blaring alarms. Instead, naturalists guide you along trails through pepper vines, coffee bushes, and tea shrubs.',
          'In the evening, over a home-style supper of appams and coconut stew, the local planter told us stories of early tea pioneers who walked these hills with compass and walking stick.',
        ]),
      },
      {
        id: 'story-rajasthan-road',
        title: 'Across the Thar: A Sandstone Diary',
        category: 'Road Journals',
        author: 'Rohan Mehra',
        date: 'January 2026',
        read_time: '7 min read',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88',
        snippet: 'Driving through Rajasthan reveals that the desert is never empty—it is full of songs, textiles, and courtyards that outlast empires.',
        content: JSON.stringify([
          'There is a particular hour on the Jodhpur-Jaisalmer highway when the landscape turns from scrubland to shimmering gold.',
          'Stopping at a roadside dhabha for hot ginger chai and bajre ki roti, we watched a herd of chinkara deer leap across the horizon. At Sam Sand Dunes, the night air was biting cold, but the bonfire and soulful Manganiyar melodies made the Thar feel like the center of the universe.',
        ]),
      },
    ]

    for (const st of stories) {
      await client.query(
        `INSERT INTO stories (id, title, category, author, date, read_time, image, snippet, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           category = EXCLUDED.category,
           author = EXCLUDED.author,
           image = EXCLUDED.image,
           snippet = EXCLUDED.snippet,
           content = EXCLUDED.content`,
        [st.id, st.title, st.category, st.author, st.date, st.read_time, st.image, st.snippet, st.content]
      )
    }

    // 9. Seed Offers
    console.log('Seeding offers...')
    const offers = [
      {
        id: 'offer-early-summer',
        code: 'CRAZY15',
        title: 'Early Bird Summer Holiday Offer',
        discount_text: 'Flat 15% OFF',
        tag: 'Limited Seats',
        valid_till: 'Valid until 30th April 2026',
        description: 'Book your summer getaway to Kashmir, Ladakh, or Himachal 45 days in advance and enjoy guaranteed luxury room upgrades.',
        min_booking: 'Min. booking ₹50,000',
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=88',
      },
      {
        id: 'offer-honeymoon-perks',
        code: 'ROMANCE',
        title: 'Honeymoon Special Inclusions',
        discount_text: 'Complimentary Perks',
        tag: 'Couples Only',
        valid_till: 'Year-Round',
        description: 'Enjoy free candle-lit dinner, flower bed decoration, private shikara ride, and couple spa credits on all Kerala and Kashmir honeymoon packages.',
        min_booking: 'Applicable on 5+ days trips',
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=88',
      },
      {
        id: 'offer-family-escape',
        code: 'FAMILYFUN',
        title: 'Family Explorer Discount',
        discount_text: 'Free Child Package',
        tag: 'Best for Families',
        valid_till: 'Valid till 31st May 2026',
        description: 'Children under 10 travel free (hotel stay & meals) on all Andaman, Rajasthan, and Golden Triangle family group bookings.',
        min_booking: 'Min. 2 paying adults',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=88',
      },
    ]

    for (const ofr of offers) {
      await client.query(
        `INSERT INTO offers (id, code, title, discount_text, tag, valid_till, description, min_booking, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           discount_text = EXCLUDED.discount_text,
           tag = EXCLUDED.tag,
           valid_till = EXCLUDED.valid_till,
           description = EXCLUDED.description,
           min_booking = EXCLUDED.min_booking,
           image = EXCLUDED.image`,
        [ofr.id, ofr.code, ofr.title, ofr.discount_text, ofr.tag, ofr.valid_till, ofr.description, ofr.min_booking, ofr.image]
      )
    }

    // 10. Seed Hero Slides
    console.log('Seeding hero slides...')
    await client.query('DELETE FROM hero_slides')
    const heroSlides = [
      {
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1800&q=88',
        eyebrow: 'Spring in the valley',
        title: 'See India with new eyes.',
        copy: 'Thoughtfully planned journeys across the places we call home. Handcrafted departures, verified heritage stays, and local hosts.',
        location: 'Tulip season in Kashmir',
        action_route: 'destination/srinagar',
        display_order: 1,
      },
      {
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1800&q=88',
        eyebrow: 'Mist over the tea gardens',
        title: 'Find a slower rhythm in Kerala.',
        copy: 'Hill-country walks, spice-scented kitchens, boutique plantation hideaways and quiet backwater mornings.',
        location: 'Monsoon light in Munnar',
        action_route: 'destination/munnar',
        display_order: 2,
      },
      {
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1800&q=88',
        eyebrow: 'Stories written in sandstone',
        title: 'Royal Rajasthan, beautifully unhurried.',
        copy: 'Courtyard havelis, desert drives, private stepwell dining and evenings under an endless canopy of stars.',
        location: 'Old-city mornings in Jaipur & Udaipur',
        action_route: 'destination/udaipur',
        display_order: 3,
      },
    ]

    for (const hs of heroSlides) {
      await client.query(
        `INSERT INTO hero_slides (image, eyebrow, title, copy, location, action_route, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [hs.image, hs.eyebrow, hs.title, hs.copy, hs.location, hs.action_route, hs.display_order]
      )
    }

    // 11. Seed Reviews & FAQs
    console.log('Seeding reviews and FAQs...')
    const reviews = [
      {
        id: 'rev-1',
        quote: 'Our Kashmir journey with Crazy Tours Travels felt completely personal. The quiet houseboat on Nigeen Lake and family orchard lunch were moments we would never have found ourselves.',
        name: 'Anika & Rohan Sengupta',
        trip: 'Kashmir Spring Tour, April 2025',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'rev-2',
        quote: 'Everything was calm, considered, and impeccably organized—from the first planning call with their travel designer to our drive through Kerala’s tea country. 24/7 on-trip support was outstanding.',
        name: 'Meera & Rajesh Shah',
        trip: 'Kerala Backwaters & Tea Trails, June 2025',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'rev-3',
        quote: 'The Rajasthan road trip balanced royal haveli stays with true local discoveries. Even our teenagers said it was the best vacation our family has ever taken. Crazy Tours Travels is now our go-to!',
        name: 'The Iyer Family',
        trip: 'Royal Rajasthan Circuit, January 2026',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      },
    ]

    for (const r of reviews) {
      await client.query(
        `INSERT INTO reviews (id, quote, name, trip, rating, avatar)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           quote = EXCLUDED.quote,
           rating = EXCLUDED.rating`,
        [r.id, r.quote, r.name, r.trip, r.rating, r.avatar]
      )
    }

    const faqs = [
      {
        question: 'What makes Crazy Tours Travels different from regular booking websites?',
        answer: 'We do not sell cookie-cutter packages. Every journey is curated by travel designers who have personally visited the destinations, stayed in the properties, and verified local drivers and guides. You get human travel design with transparent pricing and 24/7 on-trip concierge assistance.',
        category: 'About Us',
      },
      {
        question: 'Can I customise any tour package on the website?',
        answer: 'Yes, 100%! All our itineraries are flexible starting points. You can add days, upgrade hotels to 5-star heritage properties, swap experiences, or request custom private transport. Click "Plan This Journey" or use our Custom Trip Builder.',
        category: 'Customization',
      },
      {
        question: 'How do bookings and payments work?',
        answer: 'Once you choose or customize your journey, our travel designer confirms availability. You confirm with a standard 25% deposit via secure payment link (Credit Card, Net Banking, UPI, EMI). The remaining balance is payable prior to departure.',
        category: 'Booking & Payment',
      },
      {
        question: 'What is your cancellation and refund policy?',
        answer: 'We offer traveler-friendly policies: cancellations made 30+ days before travel receive a full refund minus minimal non-refundable hotel/airline retainers. In case of unexpected weather or flight disruptions, our 24/7 team arranges seamless rescheduling.',
        category: 'Policies',
      },
    ]

    await client.query('DELETE FROM faqs')
    for (const f of faqs) {
      await client.query(
        `INSERT INTO faqs (question, answer, category) VALUES ($1, $2, $3)`,
        [f.question, f.answer, f.category]
      )
    }

    console.log('✅ PostgreSQL 18: Complete Database Seeding Succeeded!')
  } catch (err) {
    console.error('❌ Error during database seeding:', err)
  } finally {
    client.release()
    await pool.end()
  }
}

runSeed()
