import { pool } from './db.js'

const destinationUpdates = [
  {
    slug: 'manali',
    image: '/catalog-photos/destinations/manali.jpg',
    gallery: [
      '/catalog-photos/destinations/manali.jpg',
      '/catalog-photos/destinations/manali_2.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
    ],
  },
  {
    slug: 'kasol',
    image: '/catalog-photos/destinations/kasol.jpg',
    gallery: [
      '/catalog-photos/destinations/kasol.jpg',
      '/catalog-photos/destinations/Kasol_2.jpg',
      '/catalog-photos/destinations/kasol_3.jpg',
      '/catalog-photos/destinations/Kasol_4.jpg',
    ],
  },
  {
    slug: 'shimla',
    image: '/catalog-photos/destinations/himalays.jpg',
    gallery: [
      '/catalog-photos/destinations/himalays.jpg',
      '/Video/optimized/destination_golden_peaks_poster.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
      '/Video/optimized/hero_soul_travel_poster.jpg',
    ],
  },
]

const packageUpdates = [
  // Couples / Honeymoon (6 packages — 6 unique covers)
  {
    id: 'manali-couple-kullu-manali-3d2n',
    image: '/catalog-photos/groups/couple.jpg',
    gallery: [
      '/catalog-photos/groups/couple.jpg',
      '/catalog-photos/destinations/manali.jpg',
      '/catalog-photos/groups/Couple_3.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
    ],
  },
  {
    id: 'manali-couple-kasol-manali-4d3n',
    image: '/catalog-photos/groups/Couple_3.jpg',
    gallery: [
      '/catalog-photos/groups/Couple_3.jpg',
      '/catalog-photos/destinations/manali_2.jpg',
      '/catalog-photos/groups/couple.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
    ],
  },
  {
    id: 'kasol-couple-kasol-manali-kasol-stay-4d3n',
    image: '/catalog-photos/groups/Couple_4.jpg',
    gallery: [
      '/catalog-photos/groups/Couple_4.jpg',
      '/catalog-photos/destinations/kasol.jpg',
      '/catalog-photos/groups/Couple_2.jpg',
      '/catalog-photos/destinations/Kasol_2.jpg',
    ],
  },
  {
    id: 'shimla-couple-shimla-manali-4d3n',
    image: '/catalog-photos/groups/Couple_2.jpg',
    gallery: [
      '/catalog-photos/groups/Couple_2.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/couple.jpg',
      '/Video/optimized/destination_golden_peaks_poster.jpg',
    ],
  },
  {
    id: 'shimla-couple-shimla-manali-5d4n',
    image: '/catalog-photos/destinations/manali_2.jpg',
    gallery: [
      '/catalog-photos/destinations/manali_2.jpg',
      '/catalog-photos/groups/Couple_4.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Couple_2.jpg',
    ],
  },
  {
    id: 'shimla-couple-shimla-manali-kasol-kasol-stay-5d4n',
    image: '/catalog-photos/destinations/Kasol_2.jpg',
    gallery: [
      '/catalog-photos/destinations/Kasol_2.jpg',
      '/catalog-photos/groups/Couple_3.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Couple_4.jpg',
    ],
  },

  // Families (6 packages — 6 unique covers)
  {
    id: 'manali-family-kullu-manali-3d2n',
    image: '/catalog-photos/groups/Family.jpg',
    gallery: [
      '/catalog-photos/groups/Family.jpg',
      '/catalog-photos/destinations/manali.jpg',
      '/catalog-photos/groups/Family_2.jpg',
      '/Video/optimized/destination_himachal_poster.jpg',
    ],
  },
  {
    id: 'manali-family-kasol-manali-4d3n',
    image: '/catalog-photos/groups/Family_2.jpg',
    gallery: [
      '/catalog-photos/groups/Family_2.jpg',
      '/catalog-photos/destinations/manali_2.jpg',
      '/catalog-photos/groups/Family.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
    ],
  },
  {
    id: 'kasol-family-kasol-manali-kasol-stay-4d3n',
    image: '/catalog-photos/groups/Family_3.jpg',
    gallery: [
      '/catalog-photos/groups/Family_3.jpg',
      '/catalog-photos/destinations/kasol.jpg',
      '/catalog-photos/groups/Family.jpg',
      '/Video/optimized/destination_kinnaur_poster.jpg',
    ],
  },
  {
    id: 'shimla-family-shimla-manali-4d3n',
    image: '/catalog-photos/groups/Family_4.jpg',
    gallery: [
      '/catalog-photos/groups/Family_4.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Family_2.jpg',
      '/Video/optimized/destination_golden_peaks_poster.jpg',
    ],
  },
  {
    id: 'shimla-family-shimla-manali-5d4n',
    image: '/catalog-photos/destinations/kasol_3.jpg',
    gallery: [
      '/catalog-photos/destinations/kasol_3.jpg',
      '/catalog-photos/groups/Family_4.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Family.jpg',
    ],
  },
  {
    id: 'shimla-family-shimla-manali-kasol-kasol-stay-5d4n',
    image: '/Video/optimized/destination_golden_peaks_poster.jpg',
    gallery: [
      '/Video/optimized/destination_golden_peaks_poster.jpg',
      '/catalog-photos/groups/Family_3.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Family_2.jpg',
    ],
  },

  // Friends & Bachelors (6 packages — 6 unique covers)
  {
    id: 'manali-bachelors-kullu-manali-3d2n',
    image: '/catalog-photos/groups/Friends_3.jpg',
    gallery: [
      '/catalog-photos/groups/Friends_3.jpg',
      '/catalog-photos/destinations/manali.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
      '/catalog-photos/groups/frineds_2.jpg',
    ],
  },
  {
    id: 'manali-bachelors-kasol-manali-4d3n',
    image: '/catalog-photos/groups/frineds_2.jpg',
    gallery: [
      '/catalog-photos/groups/frineds_2.jpg',
      '/catalog-photos/destinations/manali_2.jpg',
      '/catalog-photos/groups/Friends_3.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
    ],
  },
  {
    id: 'kasol-bachelors-kasol-manali-kasol-stay-4d3n',
    image: '/catalog-photos/groups/Friends_4.jpg',
    gallery: [
      '/catalog-photos/groups/Friends_4.jpg',
      '/catalog-photos/destinations/kasol.jpg',
      '/catalog-photos/destinations/Kasol_4.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
    ],
  },
  {
    id: 'shimla-bachelors-shimla-manali-4d3n',
    image: '/catalog-photos/groups/Friends_5.jpg',
    gallery: [
      '/catalog-photos/groups/Friends_5.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Friends_3.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
    ],
  },
  {
    id: 'shimla-bachelors-shimla-manali-5d4n',
    image: '/Video/optimized/destination_adventure_poster.jpg',
    gallery: [
      '/Video/optimized/destination_adventure_poster.jpg',
      '/catalog-photos/groups/Friends_5.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Friends_4.jpg',
    ],
  },
  {
    id: 'shimla-bachelors-shimla-manali-kasol-kasol-stay-5d4n',
    image: '/catalog-photos/destinations/Kasol_4.jpg',
    gallery: [
      '/catalog-photos/destinations/Kasol_4.jpg',
      '/catalog-photos/groups/frineds_2.jpg',
      '/catalog-photos/destinations/himalays.jpg',
      '/catalog-photos/groups/Friends_5.jpg',
    ],
  },
]

async function run() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const d of destinationUpdates) {
      await client.query(
        'UPDATE destinations SET image = $1, gallery = $2::jsonb WHERE slug = $3',
        [d.image, JSON.stringify(d.gallery), d.slug]
      )
    }
    for (const p of packageUpdates) {
      await client.query(
        'UPDATE packages SET image = $1, gallery = $2::jsonb WHERE id = $3',
        [p.image, JSON.stringify(p.gallery), p.id]
      )
    }
    await client.query('COMMIT')

    const destRes = await client.query('SELECT slug, image FROM destinations ORDER BY display_order')
    const pkgRes = await client.query('SELECT id, destination_slug, traveller_group, image FROM packages ORDER BY id')

    console.log('=== UPDATED DESTINATIONS ===')
    destRes.rows.forEach((r) => console.log(r.slug, '->', r.image))
    console.log('=== UPDATED PACKAGES ===')
    pkgRes.rows.forEach((r) => console.log(r.id, '|', r.traveller_group, '->', r.image))

    const uniqueImages = new Set([...destRes.rows.map((r) => r.image), ...pkgRes.rows.map((r) => r.image)])
    console.log(`Total rows: ${destRes.rows.length + pkgRes.rows.length}, Unique cover images: ${uniqueImages.size}`)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Failed to update photos:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

run()
