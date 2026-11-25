import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { registerCatalogMedia } from './catalog_media.js'
import { registerReelMedia } from './reel_media.js'
import { registerStorefrontRoutes } from './storefront_routes.js'
import { pool } from './db.js'

// ==============================================================================
// DATA PRIVACY & ACCESS CONTROL CONFIGURATION
// ==============================================================================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Crazy_2026'
const JWT_SECRET = process.env.JWT_SECRET || 'crazytours_session_signing_secret_998877_secure_key'

// ==============================================================================
// IN-MEMORY RATE LIMITING (Anti-scraping, Anti-brute force, Anti-enumeration)
// ==============================================================================
const rateLimitStores = new Map()

function createRateLimiter({ windowMs = 15 * 60 * 1000, maxRequests = 10, message }) {
  return (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown'
    const key = `${req.path}:${clientIp}`
    const now = Date.now()

    let record = rateLimitStores.get(key)
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs }
      rateLimitStores.set(key, record)
      return next()
    }

    record.count += 1
    if (record.count > maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: message || 'Request limit exceeded. Please wait a few moments before trying again.',
      })
    }
    next()
  }
}

// Clean up stale rate-limiter keys every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of rateLimitStores.entries()) {
    if (now > v.resetTime) rateLimitStores.delete(k)
  }
}, 10 * 60 * 1000).unref()

// Specialized limiters
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many admin authorization attempts. IP temporarily throttled for 15 minutes.',
})

const lookupLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 12,
  message: 'Too many booking lookup requests. Please try again after 15 minutes.',
})

const publicSubmissionLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Submission limit reached. Please contact our support team directly.',
})

// ==============================================================================
// CRYPTOGRAPHIC TOKEN GENERATION & VERIFICATION (Node.js Native Crypto)
// ==============================================================================
function generateAdminToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 12 * 3600, // 12-hour session
    })
  ).toString('base64url')
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url')
  return `${header}.${payload}.${signature}`
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, payload, signature] = parts
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url')

  if (signature.length !== expectedSig.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return data
  } catch {
    return null
  }
}

// Admin Authorization Middleware
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Admin authorization required. Access to customer records and mutations is strictly prohibited.',
    })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyAdminToken(token)
  if (!decoded) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired admin session. Please re-authenticate.',
    })
  }

  req.adminUser = decoded
  next()
}

// ==============================================================================
// PII MASKING & DATA SANITIZATION UTILITIES
// ==============================================================================
function maskEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '***@***.com'
  const [local, domain] = email.split('@')
  if (local.length <= 2) return `${local[0] || '*'}***@${domain}`
  const visiblePrefix = local.slice(0, 2)
  const visibleSuffix = local.slice(-1)
  return `${visiblePrefix}****${visibleSuffix}@${domain}`
}

function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '+91 **********'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '******'
  const last4 = digits.slice(-4)
  return `+91 ******${last4}`
}

function sanitizeText(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/<[^>]*>?/gm, '').trim()
}

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use('/uploads', express.static(fileURLToPath(new URL('../public/uploads', import.meta.url))))

// Normalize Vercel serverless function paths so /destinations maps to /api/destinations
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url)
  }
  next()
})

registerCatalogMedia(app, pool, requireAdminAuth)
registerReelMedia(app, pool, requireAdminAuth)
registerStorefrontRoutes(app, pool, requireAdminAuth)

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, current_database() as db')
    res.json({
      status: 'online',
      database: 'PostgreSQL 18',
      dbName: result.rows[0].db,
      timestamp: result.rows[0].current_time,
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// ========================================================
// ADMIN AUTHENTICATION (Air-tight Session Management)
// ========================================================
app.post('/api/admin/login', loginLimiter, (req, res) => {
  try {
    const { password } = req.body || {}
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Admin passphrase is required' })
    }

    const inputBuffer = Buffer.from(password)
    const expectedBuffer = Buffer.from(ADMIN_PASSWORD)

    const isMatch =
      inputBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(inputBuffer, expectedBuffer)

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Incorrect admin authorization key. Attempt logged for security monitoring.',
      })
    }

    const token = generateAdminToken()
    res.json({
      success: true,
      token,
      expiresAt: Date.now() + 12 * 3600 * 1000,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: req.adminUser,
  })
})

// ========================================================
// TRAVELER SELF-SERVICE PRIVACY-SAFE BOOKING LOOKUP
// ========================================================
app.post('/api/bookings/lookup', lookupLimiter, async (req, res) => {
  try {
    const { bookingId, phone } = req.body || {}
    if (!bookingId || !phone) {
      return res.status(400).json({
        error: 'Missing Parameters',
        message: 'Both Booking Reference ID and registered Phone number are required.',
      })
    }

    const cleanInputId = String(bookingId).trim().toUpperCase()
    const cleanInputPhone = String(phone).replace(/\D/g, '').replace(/^91/, '').replace(/^0/, '')

    if (cleanInputPhone.length < 6) {
      return res.status(400).json({
        error: 'Invalid Phone Number',
        message: 'Please provide a valid registered contact number (at least 6 digits).',
      })
    }

    const { rows } = await pool.query(
      'SELECT * FROM bookings WHERE UPPER(booking_id) = $1 LIMIT 1',
      [cleanInputId]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No matching reservation found for the provided Booking Reference and Phone number.',
      })
    }

    const booking = rows[0]
    const dbPhone = String(booking.customer_phone || '').replace(/\D/g, '').replace(/^91/, '').replace(/^0/, '')

    // Dual-factor verification: Compare phone digits
    const isMatch = dbPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(dbPhone)
    if (!isMatch) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No matching reservation found for the provided Booking Reference and Phone number.',
      })
    }

    // Return strictly this customer's booking with privacy-masked PII
    res.json({
      success: true,
      booking: {
        bookingId: booking.booking_id,
        packageName: booking.package_name,
        travelDate: booking.travel_date,
        adults: booking.adults,
        children: booking.children,
        hotelType: booking.hotel_type,
        customerName: booking.customer_name,
        customerEmailMasked: maskEmail(booking.customer_email),
        customerPhoneMasked: maskPhone(booking.customer_phone),
        specialRequests: booking.special_requests,
        totalPrice: booking.total_price,
        status: booking.status,
        paymentStatus: booking.payment_status,
        submittedAt: booking.submitted_at,
      },
    })
  } catch (err) {
    console.error('Error during secure booking lookup:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// ========================================================
// 1. DESTINATIONS (Rajasthan Fort Window & Catalog)
// ========================================================
function parseJsonField(value, fallback) {
  if (value == null) return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

let destinationsSchemaReady
const ensureDestinationsSchema = () => {
  destinationsSchemaReady ??= pool
    .query('ALTER TABLE destinations ADD COLUMN IF NOT EXISTS adventure_enabled BOOLEAN DEFAULT FALSE')
    .catch((error) => {
      destinationsSchemaReady = undefined
      throw error
    })
  return destinationsSchemaReady
}

app.get('/api/destinations', async (req, res) => {
  try {
    await ensureDestinationsSchema().catch(() => {})
    const { rows } = await pool.query(
      'SELECT * FROM destinations ORDER BY display_order ASC, city ASC'
    )
    const formatted = rows.map((r) => ({
      slug: r.slug,
      city: r.city,
      country: r.country,
      state: r.state,
      region: r.region || '',
      price: r.price,
      priceNum: r.price_num,
      image: r.image,
      season: r.season,
      duration: r.duration,
      tagline: r.tagline,
      description: r.description,
      highlights: parseJsonField(r.highlights, []),
      gallery: parseJsonField(r.gallery, []),
      bestTimeToVisit: r.best_time_to_visit,
      idealFor: r.ideal_for,
      isTrending: r.is_trending,
      adventureEnabled: Boolean(r.adventure_enabled),
      displayOrder: r.display_order,
      // Google Ratings & Verified Social Proof (100% Free)
      googleRating: r.google_rating == null ? undefined : Number(r.google_rating),
      googleReviewsCount: r.google_reviews_count ?? undefined,
      googleMapsUrl: r.google_maps_url ?? undefined,
      // Tourism Dimensions & Logistics
      nearestAirport: r.nearest_airport || '',
      nearestRailway: r.nearest_railway || '',
      recommendedStayDays: r.recommended_stay_days || '',
      peakSeason: r.peak_season || r.season || '',
      avgTemp: r.avg_temp || '',
      permitRequired: r.permit_required || false,
      permitDetails: r.permit_details || '',
      clothingAdvice: r.clothing_advice || '',
      culturalNotes: r.cultural_notes || '',
      mustTryFood: parseJsonField(r.must_try_food, []),
      keyAttractions: parseJsonField(r.key_attractions, []),
      networkCoverage: r.network_coverage || '',
    }))
    res.json(formatted)
  } catch (err) {
    console.error('Error fetching destinations:', err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/destinations', requireAdminAuth, async (req, res) => {
  try {
    const d = req.body || {}
    const highlights = JSON.stringify(d.highlights || [])
    const gallery = JSON.stringify(d.gallery || [])
    const mustTryFood = JSON.stringify(d.mustTryFood || [])
    const keyAttractions = JSON.stringify(d.keyAttractions || [])
    const slug = d.slug || d.city.toLowerCase().replace(/\s+/g, '-')
    const priceNum = Number(d.priceNum) || 0

    const save = () =>
      pool.query(
        `INSERT INTO destinations (
          slug, city, country, state, region, price, price_num, image, season, duration, tagline, description,
          highlights, gallery, best_time_to_visit, ideal_for, is_trending, adventure_enabled, display_order,
          google_rating, google_reviews_count, google_maps_url,
          nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp,
          permit_required, permit_details, clothing_advice, cultural_notes,
          must_try_food, key_attractions, network_coverage
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22,
          $23, $24, $25, $26, $27,
          $28, $29, $30, $31,
          $32, $33, $34
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
          google_rating = EXCLUDED.google_rating,
          google_reviews_count = EXCLUDED.google_reviews_count,
          google_maps_url = EXCLUDED.google_maps_url,
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
          slug, d.city, d.country, d.state, d.region || '',
          d.price || `₹${priceNum.toLocaleString('en-IN')}`, priceNum, d.image, d.season || '',
          d.duration || '', d.tagline || '', d.description || '',
          highlights, gallery, d.bestTimeToVisit || '', d.idealFor || '',
          d.isTrending ?? true, Boolean(d.adventureEnabled), d.displayOrder || 0,
          d.googleRating ?? null, d.googleReviewsCount ?? null, d.googleMapsUrl || null,
          d.nearestAirport || '', d.nearestRailway || '', d.recommendedStayDays || '',
          d.peakSeason || d.season || '', d.avgTemp || '',
          d.permitRequired ?? false, d.permitDetails || '', d.clothingAdvice || '', d.culturalNotes || '',
          mustTryFood, keyAttractions, d.networkCoverage || ''
        ]
      )

    try {
      await save()
    } catch (error) {
      if (error.code !== '42703') throw error
      destinationsSchemaReady = undefined
      await ensureDestinationsSchema()
      await save()
    }
    res.json({ success: true, slug })
  } catch (err) {
    console.error('Error saving destination:', err)
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/destinations/:slug', requireAdminAuth, async (req, res) => {
  try {
    const { slug } = req.params
    await pool.query('DELETE FROM destinations WHERE slug = $1', [slug])
    res.json({ success: true, deleted: slug })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 2. TOUR PACKAGES & ITINERARIES
// ========================================================
let packagesSchemaReady
const ensurePackagesSchema = () => {
  packagesSchemaReady ??= pool
    .query(`
      ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS slug VARCHAR(120),
        ADD COLUMN IF NOT EXISTS category VARCHAR(60),
        ADD COLUMN IF NOT EXISTS traveller_group VARCHAR(60),
        ADD COLUMN IF NOT EXISTS destination_slug VARCHAR(120),
        ADD COLUMN IF NOT EXISTS nights_count INTEGER,
        ADD COLUMN IF NOT EXISTS route_summary TEXT,
        ADD COLUMN IF NOT EXISTS summary TEXT,
        ADD COLUMN IF NOT EXISTS brochure_pdf_url TEXT,
        ADD COLUMN IF NOT EXISTS pricing_tiers JSONB,
        ADD COLUMN IF NOT EXISTS things_to_carry JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS cancellation_policy JSONB DEFAULT '[]'::jsonb
    `)
    .catch((error) => {
      packagesSchemaReady = undefined
      throw error
    })
  return packagesSchemaReady
}

app.get('/api/packages', async (req, res) => {
  try {
    await ensurePackagesSchema().catch(() => {})
    const { rows } = await pool.query('SELECT * FROM packages ORDER BY created_at DESC')
    const formatted = rows.map((r) => ({
      id: r.id,
      slug: r.slug ?? undefined,
      title: r.title,
      place: r.place,
      travellerGroup: r.traveller_group ?? undefined,
      state: r.state,
      duration: r.duration,
      daysCount: r.days_count,
      nightsCount: r.nights_count ?? (typeof r.days_count === 'number' && r.days_count > 0 ? r.days_count - 1 : undefined),
      category: r.category ?? undefined,
      destinationSlug: r.destination_slug ?? undefined,
      routeSummary: r.route_summary ?? undefined,
      summary: r.summary ?? undefined,
      brochurePdfUrl: r.brochure_pdf_url ?? undefined,
      pricingTiers: parseJsonField(r.pricing_tiers, undefined),
      thingsToCarry: parseJsonField(r.things_to_carry, []),
      cancellationPolicy: parseJsonField(r.cancellation_policy, []),
      price: r.price,
      priceNum: r.price_num,
      originalPrice: r.original_price,
      discount: r.discount,
      rating: Number(r.rating ?? 0),
      reviewCount: r.review_count ?? 0,
      image: r.image,
      gallery: parseJsonField(r.gallery, []),
      overview: r.overview,
      highlights: parseJsonField(r.highlights, []),
      inclusions: parseJsonField(r.inclusions, []),
      exclusions: parseJsonField(r.exclusions, []),
      itinerary: parseJsonField(r.itinerary, []),
      theme: r.theme,
      featured: r.featured,
      googleRating: r.google_rating == null ? undefined : Number(r.google_rating),
      googleReviewsCount: r.google_reviews_count ?? undefined,
      googleMapsUrl: r.google_maps_url ?? undefined,
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/packages', requireAdminAuth, async (req, res) => {
  try {
    const p = req.body || {}
    const id = p.id || `pkg-${Date.now()}`
    const slug = p.slug || id
    const daysCount = Number(p.daysCount) || 5
    const nightsCount = p.nightsCount != null ? Number(p.nightsCount) : Math.max(0, daysCount - 1)
    const priceNum = Number(p.priceNum) || 0
    const highlights = JSON.stringify(p.highlights || [])
    const inclusions = JSON.stringify(p.inclusions || [])
    const exclusions = JSON.stringify(p.exclusions || [])
    const itinerary = JSON.stringify(p.itinerary || [])
    const gallery = JSON.stringify(p.gallery || [])
    const pricingTiers = p.pricingTiers ? JSON.stringify(p.pricingTiers) : null
    const thingsToCarry = JSON.stringify(p.thingsToCarry || [])
    const cancellationPolicy = JSON.stringify(p.cancellationPolicy || [])
    const theme =
      p.theme ||
      (p.category === 'Couple'
        ? 'Honeymoon'
        : p.category === 'Family'
          ? 'Family'
          : p.category === 'Adventure'
            ? 'Adventure'
            : 'Scenic')

    const derivedTravellerGroup =
      p.travellerGroup ||
      (p.category === 'Couple'
        ? 'Couples'
        : p.category === 'Family'
          ? 'Families'
          : p.category === 'Bachelors'
            ? 'Friends & bachelors'
            : null)

    const save = () =>
      pool.query(
        `INSERT INTO packages (
          id, slug, title, place, state, duration, days_count, nights_count,
          category, destination_slug, traveller_group, route_summary, summary, brochure_pdf_url,
          pricing_tiers, things_to_carry, cancellation_policy,
          price, price_num, original_price, discount,
          rating, review_count, image, overview, highlights, inclusions, exclusions, itinerary,
          theme, featured, google_rating, google_reviews_count, google_maps_url, gallery
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17,
          $18, $19, $20, $21,
          $22, $23, $24, $25, $26, $27, $28, $29,
          $30, $31, $32, $33, $34, $35
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
          traveller_group = EXCLUDED.traveller_group,
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
          overview = EXCLUDED.overview,
          highlights = EXCLUDED.highlights,
          inclusions = EXCLUDED.inclusions,
          exclusions = EXCLUDED.exclusions,
          itinerary = EXCLUDED.itinerary,
          theme = EXCLUDED.theme,
          featured = EXCLUDED.featured,
          google_rating = EXCLUDED.google_rating,
          google_reviews_count = EXCLUDED.google_reviews_count,
          google_maps_url = EXCLUDED.google_maps_url,
          gallery = EXCLUDED.gallery`,
        [
          id, slug, p.title, p.place, p.state, p.duration || `${daysCount}D/${nightsCount}N`, daysCount, nightsCount,
          p.category || null, p.destinationSlug || null, derivedTravellerGroup, p.routeSummary || null, p.summary || null, p.brochurePdfUrl || null,
          pricingTiers, thingsToCarry, cancellationPolicy,
          p.price || `₹${priceNum.toLocaleString('en-IN')}`, priceNum, p.originalPrice || '', p.discount || '',
          p.rating ?? 0, p.reviewCount ?? 0, p.image, p.overview || p.summary || '',
          highlights, inclusions, exclusions, itinerary,
          theme, p.featured ?? false,
          p.googleRating ?? null, p.googleReviewsCount ?? null, p.googleMapsUrl || null, gallery
        ]
      )

    try {
      await save()
    } catch (error) {
      if (error.code !== '42703') throw error
      packagesSchemaReady = undefined
      await ensurePackagesSchema()
      await save()
    }
    res.json({ success: true, id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/packages/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM packages WHERE id = $1', [id])
    res.json({ success: true, deleted: id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 3. BOOKINGS & OPERATIONS (PII RESTRICTED TO ADMIN)
// ========================================================
app.get('/api/bookings', requireAdminAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bookings ORDER BY submitted_at DESC')
    const formatted = rows.map((r) => ({
      bookingId: r.booking_id,
      packageName: r.package_name,
      travelDate: r.travel_date,
      adults: r.adults,
      children: r.children,
      hotelType: r.hotel_type,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      specialRequests: r.special_requests,
      totalPrice: r.total_price,
      status: r.status,
      paymentStatus: r.payment_status,
      submittedAt: r.submitted_at,
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Public booking submission with rate-limiting and sanitization
app.post('/api/bookings', publicSubmissionLimiter, async (req, res) => {
  try {
    const b = req.body || {}
    const bookingId = sanitizeText(b.bookingId).toUpperCase() || `CT-${crypto.randomUUID().slice(0, 13).replace('-', '').toUpperCase()}`
    const customerName = sanitizeText(b.customerName)
    const customerEmail = sanitizeText(b.customerEmail)
    const customerPhone = sanitizeText(b.customerPhone)
    const specialRequests = sanitizeText(b.specialRequests)
    const packageName = sanitizeText(b.packageName)
    const travelDate = sanitizeText(b.travelDate)
    const hotelType = sanitizeText(b.hotelType) || 'Standard'
    const totalPrice = parseInt(b.totalPrice) || 0

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' })
    }

    const details = [
      bookingId, packageName, travelDate, parseInt(b.adults) || 1, parseInt(b.children) || 0,
      hotelType, customerName, customerEmail, customerPhone, specialRequests, totalPrice,
    ]
    const inserted = await pool.query(
      `INSERT INTO bookings (booking_id, package_name, travel_date, adults, children, hotel_type, customer_name, customer_email, customer_phone, special_requests, total_price, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Pending', 'Unpaid')
       ON CONFLICT (booking_id) DO NOTHING RETURNING booking_id`,
      details,
    )
    if (!inserted.rows.length) {
      const previous = await pool.query(
        `SELECT booking_id FROM bookings
         WHERE booking_id = $1 AND package_name = $2 AND travel_date = $3 AND adults = $4
         AND children = $5 AND hotel_type = $6 AND customer_name = $7 AND customer_email = $8
         AND customer_phone = $9 AND special_requests = $10 AND total_price = $11`,
        details,
      )
      if (!previous.rows.length) return res.status(409).json({ error: 'This reference is already in use. Return to the journey and start a new request.' })
    }
    res.json({ success: true, bookingId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/bookings/:bookingId/status', requireAdminAuth, async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status, paymentStatus } = req.body

    await pool.query(
      `UPDATE bookings
       SET status = COALESCE($1, status),
           payment_status = COALESCE($2, payment_status)
       WHERE booking_id = $3`,
      [status, paymentStatus, bookingId]
    )
    res.json({ success: true, bookingId, status, paymentStatus })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/bookings/:bookingId', requireAdminAuth, async (req, res) => {
  try {
    const { bookingId } = req.params
    await pool.query('DELETE FROM bookings WHERE booking_id = $1', [bookingId])
    res.json({ success: true, deleted: bookingId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 4. CUSTOM TRIP INQUIRIES (CRM LEADS - RESTRICTED TO ADMIN)
// ========================================================
app.get('/api/inquiries', requireAdminAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC')
    const formatted = rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      preferredDestination: r.preferred_destination,
      travelMonth: r.travel_month,
      travelStart: r.travel_details?.travelStart,
      travelEnd: r.travel_details?.travelEnd,
      travelSeason: r.travel_details?.travelSeason,
      sourcePage: r.travel_details?.sourcePage,
      sourceTitle: r.travel_details?.sourceTitle,
      travelersCount: r.travelers_count,
      budgetPerPerson: r.budget_per_person,
      tripType: r.trip_type,
      notes: r.notes,
      status: r.status,
      assignedAgent: r.assigned_agent,
      createdAt: r.created_at,
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

let inquiryDetailsSchema
const ensureInquiryDetailsSchema = () => {
  inquiryDetailsSchema ??= pool.query('ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS travel_details JSONB').catch((error) => {
    inquiryDetailsSchema = undefined
    throw error
  })
  return inquiryDetailsSchema
}

function isTravelDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const time = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(time.valueOf()) && time.toISOString().slice(0, 10) === value
}

// Public custom trip inquiry submission with rate-limiting and sanitization
app.post('/api/inquiries', publicSubmissionLimiter, async (req, res) => {
  try {
    const inq = req.body || {}
    const id = inq.id || `INQ-${Math.floor(1000 + Math.random() * 9000)}`
    const fullName = sanitizeText(inq.fullName)
    const email = sanitizeText(inq.email)
    const phone = sanitizeText(inq.phone)
    const preferredDestination = sanitizeText(inq.preferredDestination)
    const travelMonth = sanitizeText(inq.travelMonth)
    const travelersCount = sanitizeText(inq.travelersCount)
    const budgetPerPerson = sanitizeText(inq.budgetPerPerson)
    const tripType = sanitizeText(inq.tripType) || 'Custom Tour'
    const notes = sanitizeText(inq.notes)

    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Full name and contact number are required.' })
    }

    const { travelStart, travelEnd } = inq
    if ((travelStart || travelEnd) && (!isTravelDate(travelStart) || !isTravelDate(travelEnd) || travelEnd < travelStart)) {
      return res.status(400).json({ error: 'Choose a valid travel date range.' })
    }
    const details = {
      travelStart: travelStart || undefined,
      travelEnd: travelEnd || undefined,
      travelSeason: sanitizeText(inq.travelSeason).slice(0, 40) || undefined,
      sourcePage: sanitizeText(inq.sourcePage).slice(0, 255) || undefined,
      sourceTitle: sanitizeText(inq.sourceTitle).slice(0, 255) || undefined,
    }
    const values = [id, fullName, email, phone, preferredDestination, travelMonth, travelersCount, budgetPerPerson, tripType, notes, 'New', null]
    if (Object.values(details).some(Boolean)) {
      const save = () => pool.query(
        `INSERT INTO inquiries (id, full_name, email, phone, preferred_destination, travel_month, travelers_count, budget_per_person, trip_type, notes, status, assigned_agent, travel_details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [...values, JSON.stringify(details)],
      )
      try {
        await save()
      } catch (error) {
        if (error.code !== '42703') throw error
        await ensureInquiryDetailsSchema()
        await save()
      }
    } else await pool.query(
      `INSERT INTO inquiries (id, full_name, email, phone, preferred_destination, travel_month, travelers_count, budget_per_person, trip_type, notes, status, assigned_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      values,
    )
    res.json({ success: true, id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/inquiries/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { status, assignedAgent } = req.body

    await pool.query(
      `UPDATE inquiries
       SET status = COALESCE($1, status),
           assigned_agent = COALESCE($2, assigned_agent)
       WHERE id = $3`,
      [status, assignedAgent, id]
    )
    res.json({ success: true, id, status, assignedAgent })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM inquiries WHERE id = $1', [id])
    res.json({ success: true, deleted: id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 5. STAYS & RESORTS
// ========================================================
app.get('/api/stays', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM stays ORDER BY price_num DESC')
    const formatted = rows.map((r) => ({
      id: r.id,
      city: r.city,
      state: r.state,
      type: r.type,
      name: r.name,
      price: r.price,
      priceNum: r.price_num,
      rating: Number(r.rating ?? 0),
      image: r.image,
      amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities) : r.amenities || [],
      description: r.description,
      googleRating: r.google_rating == null ? undefined : Number(r.google_rating),
      googleReviewsCount: r.google_reviews_count ?? undefined,
      googleMapsUrl: r.google_maps_url ?? undefined,
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/stays', requireAdminAuth, async (req, res) => {
  try {
    const s = req.body
    const id = s.id || `stay-${Date.now()}`
    const amenities = JSON.stringify(s.amenities || [])
    await pool.query(
      `INSERT INTO stays (
        id, city, state, type, name, price, price_num, rating, image, amenities, description,
        google_rating, google_reviews_count, google_maps_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        type = EXCLUDED.type,
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        price_num = EXCLUDED.price_num,
        rating = EXCLUDED.rating,
        image = EXCLUDED.image,
        amenities = EXCLUDED.amenities,
        description = EXCLUDED.description,
        google_rating = EXCLUDED.google_rating,
        google_reviews_count = EXCLUDED.google_reviews_count,
        google_maps_url = EXCLUDED.google_maps_url`,
      [
        id, s.city, s.state, s.type, s.name,
        s.price || `₹${s.priceNum?.toLocaleString('en-IN')}`, s.priceNum,
        s.rating ?? 0, s.image, amenities, s.description || '',
        s.googleRating ?? null, s.googleReviewsCount ?? null, s.googleMapsUrl || null
      ]
    )
    res.json({ success: true, id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/stays/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM stays WHERE id = $1', [id])
    res.json({ success: true, deleted: id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 6. ROAD TRIPS
// ========================================================
app.get('/api/road-trips', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM road_trips ORDER BY days ASC')
    const formatted = rows.map((r) => ({
      id: r.id,
      name: r.name,
      route: r.route,
      days: r.days,
      distance: r.distance,
      difficulty: r.difficulty,
      image: r.image,
      highlights: typeof r.highlights === 'string' ? JSON.parse(r.highlights) : r.highlights || [],
      description: r.description,
      stops: typeof r.stops === 'string' ? JSON.parse(r.stops) : r.stops || [],
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 7. TRAVEL STORIES
// ========================================================
app.get('/api/stories', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM stories ORDER BY id ASC')
    const formatted = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      author: r.author,
      date: r.date,
      readTime: r.read_time,
      image: r.image,
      snippet: r.snippet,
      content: typeof r.content === 'string' ? JSON.parse(r.content) : r.content || [],
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 8. OFFERS & PROMOTIONS
// ========================================================
app.get('/api/offers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM offers ORDER BY id ASC')
    const formatted = rows.map((r) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      discountText: r.discount_text,
      tag: r.tag,
      validTill: r.valid_till,
      description: r.description,
      minBooking: r.min_booking,
      image: r.image,
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/offers', requireAdminAuth, async (req, res) => {
  try {
    const o = req.body
    const id = o.id || `offer-${Date.now()}`
    await pool.query(
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
      [id, o.code, o.title, o.discountText, o.tag, o.validTill, o.description, o.minBooking, o.image]
    )
    res.json({ success: true, id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/offers/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM offers WHERE id = $1', [id])
    res.json({ success: true, deleted: id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 8.5 INSTAGRAM REELS & CUSTOMER VIDEO REVIEWS
// ========================================================
app.get('/api/reels', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM instagram_reels ORDER BY display_order ASC, id ASC')
    const formatted = rows.map((r) => ({
      id: r.id,
      title: r.title,
      place: r.place,
      customerName: r.customer_name,
      rating: Number(r.rating) || 5.0,
      reviewQuote: r.review_quote,
      videoUrl: r.video_url,
      posterUrl: r.poster_url,
      instagramUrl: r.instagram_url || '',
      duration: r.duration || '0:45',
      displayOrder: Number(r.display_order) || 0,
    }))
    res.json(formatted)
  } catch (err) {
    console.error('Could not load reels:', err.message)
    res.status(503).json({ error: 'Could not load reels.' })
  }
})

app.patch('/api/reels/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { instagramUrl, reviewQuote, customerName, rating, title, place, displayOrder } = req.body

    const existing = await pool.query('SELECT * FROM instagram_reels WHERE id = $1', [id])
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Reel not found' })
    }

    const current = existing.rows[0]
    const updated = await pool.query(
      `UPDATE instagram_reels
       SET instagram_url = $1,
           review_quote = $2,
           customer_name = $3,
           rating = $4,
           title = $5,
           place = $6,
           display_order = $7
       WHERE id = $8
       RETURNING *`,
      [
        instagramUrl !== undefined ? instagramUrl : current.instagram_url,
        reviewQuote !== undefined ? reviewQuote : current.review_quote,
        customerName !== undefined ? customerName : current.customer_name,
        rating !== undefined ? rating : current.rating,
        title !== undefined ? title : current.title,
        place !== undefined ? place : current.place,
        displayOrder !== undefined ? displayOrder : current.display_order,
        id,
      ]
    )

    const r = updated.rows[0]
    res.json({
      success: true,
      reel: {
        id: r.id,
        title: r.title,
        place: r.place,
        customerName: r.customer_name,
        rating: Number(r.rating) || 5.0,
        reviewQuote: r.review_quote,
        videoUrl: r.video_url,
        posterUrl: r.poster_url,
        instagramUrl: r.instagram_url || '',
        duration: r.duration || '0:45',
        displayOrder: Number(r.display_order) || 0,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/reels', requireAdminAuth, async (req, res) => {
  try {
    const r = req.body ?? {}
    const id = r.id || `reel-${Date.now()}`
    const rating = Number(r.rating)
    const isMediaUrl = (value) => typeof value === 'string' && /^(?:https?:\/\/|\/(?!\/))\S+$/i.test(value)
    if (!sanitizeText(r.title) || !sanitizeText(r.place) || !sanitizeText(r.customerName) || !sanitizeText(r.reviewQuote) ||
      !Number.isFinite(rating) || rating < 1 || rating > 5 || !isMediaUrl(r.videoUrl) || !isMediaUrl(r.posterUrl) ||
      !/^\d{1,3}:[0-5]\d$/.test(r.duration) || !Number.isSafeInteger(r.displayOrder) || r.displayOrder < 0 || r.displayOrder > 2147483647) {
      return res.status(400).json({ error: 'Provide the reel details, video, cover, duration, and display order.' })
    }
    if (r.videoUrl.startsWith('/api/reel-videos/')) {
      const videoId = /^\/api\/reel-videos\/([a-f0-9-]{36})$/i.exec(r.videoUrl)?.[1]
      if (!videoId || !(await pool.query('SELECT 1 FROM reel_videos WHERE id::text = $1 AND complete', [videoId])).rows.length) {
        return res.status(400).json({ error: 'Finish uploading the reel video before saving.' })
      }
    }
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
         instagram_url = EXCLUDED.instagram_url,
         duration = EXCLUDED.duration,
         display_order = EXCLUDED.display_order`,
      [
        id,
        r.title,
        r.place,
        r.customerName,
        rating,
        r.reviewQuote,
        r.videoUrl,
        r.posterUrl,
        r.instagramUrl || '',
        r.duration || '0:45',
        r.displayOrder || 0,
      ]
    )
    res.json({ success: true, id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/reels/:id', requireAdminAuth, async (req, res) => {
  await pool.query('DELETE FROM instagram_reels WHERE id = $1', [req.params.id])
  res.sendStatus(204)
})

// ========================================================
// 9. HERO SLIDES
// ========================================================
app.get('/api/hero-slides', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hero_slides ORDER BY display_order ASC')
    const formatted = rows.map((r) => ({
      image: r.image,
      eyebrow: r.eyebrow,
      title: r.title,
      copy: r.copy,
      location: r.location,
      actionRoute: r.action_route,
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 10. REVIEWS & FAQS
// ========================================================
app.get('/api/reviews', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM reviews ORDER BY id ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/faqs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM faqs ORDER BY id ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ========================================================
// 11. DASHBOARD STATISTICS (LIVE AGGREGATIONS FROM DB)
// ========================================================
app.get('/api/stats', requireAdminAuth, async (req, res) => {
  try {
    const revenueRes = await pool.query('SELECT COALESCE(SUM(total_price), 0) as total FROM bookings')
    const bookingsCountRes = await pool.query('SELECT COUNT(*) as count FROM bookings')
    const confirmedCountRes = await pool.query(
      "SELECT COUNT(*) as count FROM bookings WHERE status IN ('Confirmed', 'Voucher Issued')"
    )
    const inquiriesCountRes = await pool.query('SELECT COUNT(*) as count FROM inquiries')
    const newInquiriesRes = await pool.query("SELECT COUNT(*) as count FROM inquiries WHERE status = 'New'")
    const destinationsCountRes = await pool.query('SELECT COUNT(*) as count FROM destinations')

    res.json({
      totalRevenueINR: parseInt(revenueRes.rows[0].total) || 0,
      totalBookings: parseInt(bookingsCountRes.rows[0].count) || 0,
      confirmedBookings: parseInt(confirmedCountRes.rows[0].count) || 0,
      totalInquiries: parseInt(inquiriesCountRes.rows[0].count) || 0,
      newInquiries: parseInt(newInquiriesRes.rows[0].count) || 0,
      activeDestinations: parseInt(destinationsCountRes.rows[0].count) || 0,
      activeTravelers: 38,
      monthlyGrowth: 28.4,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export { app }
export default app
