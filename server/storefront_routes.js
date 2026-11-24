export function registerStorefrontRoutes(app, pool, requireAdminAuth) {
  // ========================================================
  // GET /api/storefront-config (Public Aggregated Payload)
  // ========================================================
  app.get('/api/storefront-config', async (req, res) => {
    try {
      const [specialsRes, boardRes, pillarsRes, statsRes, headersRes] = await Promise.all([
        pool.query('SELECT * FROM homepage_specials ORDER BY slot_index ASC'),
        pool.query('SELECT * FROM homepage_board_feature LIMIT 1'),
        pool.query('SELECT * FROM homepage_brand_pillars ORDER BY display_order ASC'),
        pool.query('SELECT * FROM homepage_trust_stats LIMIT 1'),
        pool.query('SELECT * FROM homepage_section_headers'),
      ])

      const headersMap = {}
      for (const row of headersRes.rows) {
        headersMap[row.section_key] = {
          kicker: row.kicker,
          title: row.title,
          subtitle: row.subtitle,
        }
      }

      res.json({
        success: true,
        specials: specialsRes.rows.map((r) => ({
          id: r.id,
          slotIndex: r.slot_index,
          badge: r.badge,
          title: r.title,
          description: r.description,
          priceNum: r.price_num,
          image: r.image,
          actionRoute: r.action_route,
          actionLabel: r.action_label,
        })),
        boardFeature: boardRes.rows[0]
          ? {
              id: boardRes.rows[0].id,
              kicker: boardRes.rows[0].kicker,
              sectionTitle: boardRes.rows[0].section_title,
              partnerBadge: boardRes.rows[0].partner_badge,
              headline: boardRes.rows[0].headline,
              description: boardRes.rows[0].description,
              image: boardRes.rows[0].image,
              actionRoute: boardRes.rows[0].action_route,
              actionLabel: boardRes.rows[0].action_label,
            }
          : null,
        brandPillars: pillarsRes.rows.map((r) => ({
          id: r.id,
          stepNumber: r.step_number,
          title: r.title,
          description: r.description,
          displayOrder: r.display_order,
          stageImage: r.stage_image,
        })),
        trustStats: statsRes.rows[0]
          ? {
              id: statsRes.rows[0].id,
              stat1Value: statsRes.rows[0].stat1_value,
              stat1Label: statsRes.rows[0].stat1_label,
              stat2Value: statsRes.rows[0].stat2_value,
              stat2Label: statsRes.rows[0].stat2_label,
              stat3Value: statsRes.rows[0].stat3_value,
              stat3Label: statsRes.rows[0].stat3_label,
              stat4Value: statsRes.rows[0].stat4_value,
              stat4Label: statsRes.rows[0].stat4_label,
            }
          : null,
        sectionHeaders: headersMap,
      })
    } catch (err) {
      console.error('Error fetching storefront config:', err)
      res.status(500).json({ error: err.message })
    }
  })

  // ========================================================
  // PUT /api/storefront/specials/:slotIndex (Admin)
  // ========================================================
  app.put('/api/storefront/specials/:slotIndex', requireAdminAuth, async (req, res) => {
    try {
      const slotIndex = parseInt(req.params.slotIndex, 10)
      const { badge, title, description, priceNum, image, actionRoute, actionLabel } = req.body

      const result = await pool.query(
        `UPDATE homepage_specials
         SET badge = COALESCE($1, badge),
             title = COALESCE($2, title),
             description = COALESCE($3, description),
             price_num = COALESCE($4, price_num),
             image = COALESCE($5, image),
             action_route = COALESCE($6, action_route),
             action_label = COALESCE($7, action_label),
             updated_at = NOW()
         WHERE slot_index = $8
         RETURNING *`,
        [badge, title, description, priceNum, image, actionRoute, actionLabel, slotIndex]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Special slot not found' })
      }
      res.json({ success: true, special: result.rows[0] })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // ========================================================
  // PUT /api/storefront/board-feature (Admin)
  // ========================================================
  app.put('/api/storefront/board-feature', requireAdminAuth, async (req, res) => {
    try {
      const { kicker, sectionTitle, partnerBadge, headline, description, image, actionRoute, actionLabel } = req.body

      const result = await pool.query(
        `UPDATE homepage_board_feature
         SET kicker = COALESCE($1, kicker),
             section_title = COALESCE($2, section_title),
             partner_badge = COALESCE($3, partner_badge),
             headline = COALESCE($4, headline),
             description = COALESCE($5, description),
             image = COALESCE($6, image),
             action_route = COALESCE($7, action_route),
             action_label = COALESCE($8, action_label),
             updated_at = NOW()
         WHERE id = 'main-board-feature'
         RETURNING *`,
        [kicker, sectionTitle, partnerBadge, headline, description, image, actionRoute, actionLabel]
      )

      res.json({ success: true, boardFeature: result.rows[0] })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // ========================================================
  // PUT /api/storefront/brand-pillars (Admin)
  // ========================================================
  app.put('/api/storefront/brand-pillars', requireAdminAuth, async (req, res) => {
    try {
      const { stageImage, pillars } = req.body

      if (Array.isArray(pillars)) {
        for (const p of pillars) {
          await pool.query(
            `UPDATE homepage_brand_pillars
             SET step_number = COALESCE($1, step_number),
                 title = COALESCE($2, title),
                 description = COALESCE($3, description),
                 stage_image = COALESCE($4, stage_image),
                 updated_at = NOW()
             WHERE id = $5`,
            [p.stepNumber, p.title, p.description, stageImage || p.stageImage, p.id]
          )
        }
      }

      if (stageImage) {
        await pool.query(`UPDATE homepage_brand_pillars SET stage_image = $1, updated_at = NOW()`, [stageImage])
      }

      const updated = await pool.query('SELECT * FROM homepage_brand_pillars ORDER BY display_order ASC')
      res.json({ success: true, brandPillars: updated.rows })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // ========================================================
  // PUT /api/storefront/trust-stats (Admin)
  // ========================================================
  app.put('/api/storefront/trust-stats', requireAdminAuth, async (req, res) => {
    try {
      const {
        stat1Value, stat1Label,
        stat2Value, stat2Label,
        stat3Value, stat3Label,
        stat4Value, stat4Label,
      } = req.body

      const result = await pool.query(
        `UPDATE homepage_trust_stats
         SET stat1_value = COALESCE($1, stat1_value),
             stat1_label = COALESCE($2, stat1_label),
             stat2_value = COALESCE($3, stat2_value),
             stat2_label = COALESCE($4, stat2_label),
             stat3_value = COALESCE($5, stat3_value),
             stat3_label = COALESCE($6, stat3_label),
             stat4_value = COALESCE($7, stat4_value),
             stat4_label = COALESCE($8, stat4_label),
             updated_at = NOW()
         WHERE id = 'main-trust-stats'
         RETURNING *`,
        [
          stat1Value, stat1Label,
          stat2Value, stat2Label,
          stat3Value, stat3Label,
          stat4Value, stat4Label,
        ]
      )

      res.json({ success: true, trustStats: result.rows[0] })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // ========================================================
  // PUT /api/storefront/section-headers/:sectionKey (Admin)
  // ========================================================
  app.put('/api/storefront/section-headers/:sectionKey', requireAdminAuth, async (req, res) => {
    try {
      const { sectionKey } = req.params
      const { kicker, title, subtitle } = req.body

      const result = await pool.query(
        `INSERT INTO homepage_section_headers (section_key, kicker, title, subtitle, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (section_key) DO UPDATE SET
           kicker = COALESCE(EXCLUDED.kicker, homepage_section_headers.kicker),
           title = COALESCE(EXCLUDED.title, homepage_section_headers.title),
           subtitle = COALESCE(EXCLUDED.subtitle, homepage_section_headers.subtitle),
           updated_at = NOW()
         RETURNING *`,
        [sectionKey, kicker, title, subtitle]
      )

      res.json({ success: true, header: result.rows[0] })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // ========================================================
  // PUT /api/storefront/curated-selection (Admin)
  // ========================================================
  app.put('/api/storefront/curated-selection', requireAdminAuth, async (req, res) => {
    try {
      const { trendingDestinations, soulfulPackages, featuredStays } = req.body

      // 1. Trending destinations order & toggle
      if (Array.isArray(trendingDestinations)) {
        for (const item of trendingDestinations) {
          await pool.query(
            `UPDATE destinations
             SET is_trending = $1, display_order = $2
             WHERE slug = $3`,
            [item.isTrending ?? true, item.displayOrder ?? 0, item.slug]
          )
        }
      }

      // 2. Soulful packages order
      if (Array.isArray(soulfulPackages)) {
        for (const item of soulfulPackages) {
          await pool.query(
            `UPDATE packages
             SET featured = $1, home_spotlight_order = $2
             WHERE id = $3`,
            [item.featured ?? true, item.homeSpotlightOrder ?? 0, item.id]
          )
        }
      }

      // 3. Featured stays order
      if (Array.isArray(featuredStays)) {
        for (const item of featuredStays) {
          await pool.query(
            `UPDATE stays
             SET is_home_featured = $1, home_display_order = $2
             WHERE id = $3`,
            [item.isHomeFeatured ?? true, item.homeDisplayOrder ?? 0, item.id]
          )
        }
      }

      res.json({ success: true, message: 'Curated storefront selections updated.' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })
}
