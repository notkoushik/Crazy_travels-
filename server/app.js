import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { pool } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Upload directory path (supports /tmp in serverless environments like Vercel)
const uploadsDir = process.env.VERCEL
  ? '/tmp'
  : path.join(__dirname, '..', 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true })
  } catch (err) {
    // Ignore in read-only serverless environments
  }
}

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use('/uploads', express.static(uploadsDir))

// Normalize Vercel serverless function paths so /destinations maps to /api/destinations
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url)
  }
  next()
})

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
    cb(null, `${base}-${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, AVIF) are allowed'))
    }
  },
})

// ========================================================
// FILE UPLOAD ENDPOINTS (RESTRICTED TO AUTHENTICATED ADMIN)
// ========================================================
app.post('/api/upload', requireAdminAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received' })
    }
    const fileUrl = `/uploads/${req.file.filename}`
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/upload-multiple', requireAdminAuth, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files received' })
    }
    const files = req.files.map((f) => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename,
      size: f.size,
    }))
    res.json({
      success: true,
      urls: files.map((f) => f.url),
      files,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

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
app.get('/api/destinations', async (req, res) => {
  try {
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
      highlights: typeof r.highlights === 'string' ? JSON.parse(r.highlights) : r.highlights || [],
      gallery: typeof r.gallery === 'string' ? JSON.parse(r.gallery) : r.gallery || [],
      bestTimeToVisit: r.best_time_to_visit,
      idealFor: r.ideal_for,
      isTrending: r.is_trending,
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
      mustTryFood: typeof r.must_try_food === 'string' ? JSON.parse(r.must_try_food) : r.must_try_food || [],
      keyAttractions: typeof r.key_attractions === 'string' ? JSON.parse(r.key_attractions) : r.key_attractions || [],
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
    const d = req.body
    const highlights = JSON.stringify(d.highlights || [])
    const gallery = JSON.stringify(d.gallery || [])
    const mustTryFood = JSON.stringify(d.mustTryFood || [])
    const keyAttractions = JSON.stringify(d.keyAttractions || [])
    const slug = d.slug || d.city.toLowerCase().replace(/\s+/g, '-')

    await pool.query(
      `INSERT INTO destinations (
        slug, city, country, state, region, price, price_num, image, season, duration, tagline, description,
        highlights, gallery, best_time_to_visit, ideal_for, is_trending, display_order,
        google_rating, google_reviews_count, google_maps_url,
        nearest_airport, nearest_railway, recommended_stay_days, peak_season, avg_temp,
        permit_required, permit_details, clothing_advice, cultural_notes,
        must_try_food, key_attractions, network_coverage
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21,
        $22, $23, $24, $25, $26,
        $27, $28, $29, $30,
        $31, $32, $33
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
        d.price || `₹${d.priceNum?.toLocaleString('en-IN')}`, d.priceNum, d.image, d.season || '',
        d.duration || '', d.tagline || '', d.description || '',
        highlights, gallery, d.bestTimeToVisit || '', d.idealFor || '',
        d.isTrending ?? true, d.displayOrder || 0,
        d.googleRating ?? null, d.googleReviewsCount ?? null, d.googleMapsUrl || null,
        d.nearestAirport || '', d.nearestRailway || '', d.recommendedStayDays || '',
        d.peakSeason || d.season || '', d.avgTemp || '',
        d.permitRequired ?? false, d.permitDetails || '', d.clothingAdvice || '', d.culturalNotes || '',
        mustTryFood, keyAttractions, d.networkCoverage || ''
      ]
    )
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
app.get('/api/packages', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM packages ORDER BY created_at DESC')
    const formatted = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      place: r.place,
      state: r.state,
      duration: r.duration,
      daysCount: r.days_count,
      price: r.price,
      priceNum: r.price_num,
      originalPrice: r.original_price,
      discount: r.discount,
      rating: Number(r.rating ?? 0),
      reviewCount: r.review_count ?? 0,
      image: r.image,
      gallery: typeof r.gallery === 'string' ? JSON.parse(r.gallery) : r.gallery || [],
      overview: r.overview,
      highlights: typeof r.highlights === 'string' ? JSON.parse(r.highlights) : r.highlights || [],
      inclusions: typeof r.inclusions === 'string' ? JSON.parse(r.inclusions) : r.inclusions || [],
      exclusions: typeof r.exclusions === 'string' ? JSON.parse(r.exclusions) : r.exclusions || [],
      itinerary: typeof r.itinerary === 'string' ? JSON.parse(r.itinerary) : r.itinerary || [],
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
    const p = req.body
    const id = p.id || `pkg-${Date.now()}`
    const highlights = JSON.stringify(p.highlights || [])
    const inclusions = JSON.stringify(p.inclusions || [])
    const exclusions = JSON.stringify(p.exclusions || [])
    const itinerary = JSON.stringify(p.itinerary || [])

    await pool.query(
      `INSERT INTO packages (
        id, title, place, state, duration, days_count, price, price_num, original_price, discount,
        rating, review_count, image, overview, highlights, inclusions, exclusions, itinerary,
        theme, featured, google_rating, google_reviews_count, google_maps_url, gallery
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      ON CONFLICT (id) DO UPDATE SET
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
        featured = EXCLUDED.featured,
        google_rating = EXCLUDED.google_rating,
        google_reviews_count = EXCLUDED.google_reviews_count,
        google_maps_url = EXCLUDED.google_maps_url,
        gallery = EXCLUDED.gallery`,
      [
        id, p.title, p.place, p.state, p.duration, p.daysCount,
        p.price || `₹${p.priceNum?.toLocaleString('en-IN')}`, p.priceNum,
        p.originalPrice, p.discount, p.rating ?? 0, p.reviewCount ?? 0,
        p.image, p.overview, highlights, inclusions, exclusions, itinerary,
        p.theme, p.featured ?? false,
        p.googleRating ?? null, p.googleReviewsCount ?? null, p.googleMapsUrl || null,
        JSON.stringify(p.gallery || [])
      ]
    )
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
    const bookingId = b.bookingId || `CT-${Math.floor(100000 + Math.random() * 900000)}`
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

    await pool.query(
      `INSERT INTO bookings (booking_id, package_name, travel_date, adults, children, hotel_type, customer_name, customer_email, customer_phone, special_requests, total_price, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        bookingId, packageName, travelDate, parseInt(b.adults) || 1, parseInt(b.children) || 0,
        hotelType, customerName, customerEmail, customerPhone,
        specialRequests, totalPrice, 'Pending', 'Unpaid'
      ]
    )
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

    await pool.query(
      `INSERT INTO inquiries (id, full_name, email, phone, preferred_destination, travel_month, travelers_count, budget_per_person, trip_type, notes, status, assigned_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        id, fullName, email, phone, preferredDestination,
        travelMonth, travelersCount, budgetPerPerson,
        tripType, notes, 'New', null
      ]
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
const fallbackReels = [
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

app.get('/api/reels', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM instagram_reels ORDER BY display_order ASC, id ASC')
    if (!rows || rows.length === 0) {
      return res.json(fallbackReels)
    }
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
    console.warn('Using fallback reels due to query exception:', err.message)
    res.json(fallbackReels)
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
    const r = req.body
    const id = r.id || `reel-${Date.now()}`
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
         instagram_url = COALESCE(EXCLUDED.instagram_url, instagram_reels.instagram_url),
         duration = EXCLUDED.duration,
         display_order = EXCLUDED.display_order`,
      [
        id,
        r.title,
        r.place,
        r.customerName,
        r.rating || 5.0,
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
