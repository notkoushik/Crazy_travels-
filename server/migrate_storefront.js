import { pool } from './db.js'

export async function migrateStorefront() {
  console.log('--- MIGRATING STOREFRONT EXPERIENCE STUDIO TABLES ---')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 1. Crazy Specials (4 Asymmetric Promotional Cards)
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_specials (
        id VARCHAR(60) PRIMARY KEY,
        slot_index INTEGER NOT NULL UNIQUE,
        badge VARCHAR(120) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price_num INTEGER,
        image TEXT NOT NULL,
        action_route VARCHAR(255) NOT NULL,
        action_label VARCHAR(120) DEFAULT 'See the journey',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // 2. Travel Boards Recommend (Editorial Partner Feature Banner)
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_board_feature (
        id VARCHAR(60) PRIMARY KEY DEFAULT 'main-board-feature',
        kicker VARCHAR(120) DEFAULT 'Selected with local experts',
        section_title VARCHAR(255) DEFAULT 'Travel boards recommend',
        partner_badge VARCHAR(255) NOT NULL,
        headline VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        action_route VARCHAR(255) NOT NULL,
        action_label VARCHAR(120) DEFAULT 'Explore Hampi',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // 3. Brand Pillars ("Expertly planned. Genuinely personal.")
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_brand_pillars (
        id VARCHAR(60) PRIMARY KEY,
        step_number VARCHAR(10) NOT NULL,
        title VARCHAR(120) NOT NULL,
        description TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        stage_image TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // 4. Trust Milestones & Stats ("Why travellers return to us")
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_trust_stats (
        id VARCHAR(60) PRIMARY KEY DEFAULT 'main-trust-stats',
        stat1_value VARCHAR(30) DEFAULT '18',
        stat1_label VARCHAR(60) DEFAULT 'years exploring',
        stat2_value VARCHAR(30) DEFAULT '28',
        stat2_label VARCHAR(60) DEFAULT 'states explored',
        stat3_value VARCHAR(30) DEFAULT '24k',
        stat3_label VARCHAR(60) DEFAULT 'journeys planned',
        stat4_value VARCHAR(30) DEFAULT '4.9',
        stat4_label VARCHAR(60) DEFAULT 'average traveller rating',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // 5. Section Headers & Taglines
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_section_headers (
        section_key VARCHAR(60) PRIMARY KEY,
        kicker VARCHAR(120),
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // 6. Optional extensions on destinations, packages, stays for spotlight curation
    await client.query(`
      ALTER TABLE destinations ADD COLUMN IF NOT EXISTS trending_rank INTEGER DEFAULT 0;
      ALTER TABLE packages ADD COLUMN IF NOT EXISTS home_spotlight_order INTEGER DEFAULT 0;
      ALTER TABLE stays ADD COLUMN IF NOT EXISTS is_home_featured BOOLEAN DEFAULT TRUE;
      ALTER TABLE stays ADD COLUMN IF NOT EXISTS home_display_order INTEGER DEFAULT 0;
    `)

    // ----------------------------------------------------
    // SEED INITIAL CONTENT (Matching live site perfectly)
    // ----------------------------------------------------

    // 1. Seed Specials (4 Slots)
    const initialSpecials = [
      {
        id: 'special-1',
        slot_index: 1,
        badge: 'April departures · Limited season',
        title: 'Kashmir in full bloom',
        description: '6 days of tulip gardens, houseboat evenings and mountain air.',
        price_num: 36800,
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=88',
        action_route: 'destination/srinagar',
        action_label: 'See the journey',
      },
      {
        id: 'special-2',
        slot_index: 2,
        badge: 'September departures',
        title: 'High roads of Ladakh',
        description: 'Monasteries, mountain passes and nights beneath a spectacular sky.',
        price_num: 42000,
        image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=88',
        action_route: 'road-trips',
        action_label: 'Explore the route',
      },
      {
        id: 'special-3',
        slot_index: 3,
        badge: 'Monsoon in Kerala',
        title: 'Monsoon in Kerala',
        description: 'Tea-country mist, restorative stays and slow backwater days.',
        price_num: 28500,
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=700&q=85',
        action_route: 'destination/munnar',
        action_label: 'Build your itinerary',
      },
      {
        id: 'special-4',
        slot_index: 4,
        badge: 'Rajasthan by road',
        title: 'Rajasthan by road',
        description: 'Palace stays, craft towns and golden desert evenings.',
        price_num: 31000,
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=85',
        action_route: 'road-trips',
        action_label: 'See road trips',
      },
    ]

    for (const s of initialSpecials) {
      await client.query(`
        INSERT INTO homepage_specials (id, slot_index, badge, title, description, price_num, image, action_route, action_label)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (slot_index) DO UPDATE SET
          badge = EXCLUDED.badge,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          price_num = EXCLUDED.price_num,
          image = EXCLUDED.image,
          action_route = EXCLUDED.action_route,
          action_label = EXCLUDED.action_label,
          updated_at = NOW();
      `, [s.id, s.slot_index, s.badge, s.title, s.description, s.price_num, s.image, s.action_route, s.action_label])
    }

    // 2. Seed Board Feature
    await client.query(`
      INSERT INTO homepage_board_feature (id, kicker, section_title, partner_badge, headline, description, image, action_route, action_label)
      VALUES (
        'main-board-feature',
        'Selected with local experts',
        'Travel boards recommend',
        'In partnership with local storytellers',
        'Hampi, beyond the monuments',
        'Riverside walks, ancient stories and boulder-lit sunsets—discover Karnataka at a gentler pace.',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=88',
        'destination/hampi',
        'Explore Hampi'
      )
      ON CONFLICT (id) DO NOTHING;
    `)

    // 3. Seed Brand Pillars
    const defaultPillars = [
      {
        id: 'pillar-1',
        step_number: '01',
        title: 'Human expertise',
        description: 'Real travel designers who listen before they plan. No auto-generated templates.',
        display_order: 1,
        stage_image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
      },
      {
        id: 'pillar-2',
        step_number: '02',
        title: 'Built around you',
        description: 'Your pace, preferences and non-negotiables come first.',
        display_order: 2,
        stage_image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
      },
      {
        id: 'pillar-3',
        step_number: '03',
        title: 'Here when needed',
        description: 'Reliable 24/7 on-trip concierge support from first departure to your return home.',
        display_order: 3,
        stage_image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
      },
      {
        id: 'pillar-4',
        step_number: '04',
        title: 'Clear and considered',
        description: 'Certified heritage properties and transparent trip pricing with zero hidden fees.',
        display_order: 4,
        stage_image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
      },
    ]

    for (const p of defaultPillars) {
      await client.query(`
        INSERT INTO homepage_brand_pillars (id, step_number, title, description, display_order, stage_image)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          step_number = EXCLUDED.step_number,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          display_order = EXCLUDED.display_order,
          stage_image = EXCLUDED.stage_image,
          updated_at = NOW();
      `, [p.id, p.step_number, p.title, p.description, p.display_order, p.stage_image])
    }

    // 4. Seed Trust Stats
    await client.query(`
      INSERT INTO homepage_trust_stats (id, stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label, stat4_value, stat4_label)
      VALUES (
        'main-trust-stats',
        '18', 'years exploring',
        '28', 'states explored',
        '24k', 'journeys planned',
        '4.9', 'average traveller rating'
      )
      ON CONFLICT (id) DO NOTHING;
    `)

    // 5. Seed Section Headers
    const headers = [
      {
        section_key: 'trending',
        kicker: 'India, beautifully explored',
        title: 'Trending destinations',
        subtitle: 'Six remarkable places curated for immersive discovery. Each one designed as a deep journey, not a tourist checklist.',
      },
      {
        section_key: 'specials',
        kicker: 'Limited seasonal departures',
        title: 'Crazy Specials & Offers',
        subtitle: 'Handcrafted seasonal breaks with exclusive benefits and private local hosts.',
      },
      {
        section_key: 'soul',
        kicker: 'Made to linger',
        title: 'Journeys with a little more soul',
        subtitle: 'Signature departures celebrating unhurried discovery and living heritage.',
      },
      {
        section_key: 'board',
        kicker: 'Selected with local experts',
        title: 'Travel boards recommend',
        subtitle: 'Curated stories and architectural journeys handpicked by regional explorers.',
      },
      {
        section_key: 'stays',
        kicker: 'Stay somewhere memorable',
        title: 'Explore boutique hotel stays',
        subtitle: 'Heritage havelis, luxury houseboats, and serene plantation estates.',
      },
      {
        section_key: 'pillars',
        kicker: 'Why travel with Crazy Tours Travel',
        title: 'Expertly planned. Genuinely personal.',
        subtitle: 'The craft behind each journey.',
      },
      {
        section_key: 'stats',
        kicker: 'The Crazy Tours Travel difference',
        title: 'Why travellers return to us',
        subtitle: 'Decades of authentic travel design across India.',
      },
    ]

    for (const h of headers) {
      await client.query(`
        INSERT INTO homepage_section_headers (section_key, kicker, title, subtitle)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (section_key) DO UPDATE SET
          kicker = EXCLUDED.kicker,
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          updated_at = NOW();
      `, [h.section_key, h.kicker, h.title, h.subtitle])
    }

    await client.query('COMMIT')
    console.log('✅ Storefront tables created and seeded successfully!')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Migration failed:', err.message)
    throw err
  } finally {
    client.release()
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('migrate_storefront.js')) {
  migrateStorefront()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
