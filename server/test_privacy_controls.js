import http from 'http'
import app from './app.js'

const server = http.createServer(app)

server.listen(5099, async () => {
  console.log('Testing privacy endpoints on port 5099...')
  let passed = 0
  let failed = 0

  async function test(name, fn) {
    try {
      await fn()
      console.log(`  ✓ ${name}`)
      passed++
    } catch (err) {
      console.error(`  ✗ ${name}:`, err.message)
      failed++
    }
  }

  try {
    // 1. Unauthenticated GET /api/bookings must be BLOCKED (401)
    await test('Unauthenticated GET /api/bookings returns 401', async () => {
      const res = await fetch('http://localhost:5099/api/bookings')
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
    })

    // 2. Unauthenticated GET /api/inquiries must be BLOCKED (401)
    await test('Unauthenticated GET /api/inquiries returns 401', async () => {
      const res = await fetch('http://localhost:5099/api/inquiries')
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
    })

    // 3. Unauthenticated GET /api/stats must be BLOCKED (401)
    await test('Unauthenticated GET /api/stats returns 401', async () => {
      const res = await fetch('http://localhost:5099/api/stats')
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
    })

    // 4. Public catalog GET /api/destinations must be OPEN (200 or 500 if db disconnected, not 401)
    await test('Public catalog GET /api/destinations is not blocked by auth', async () => {
      const res = await fetch('http://localhost:5099/api/destinations')
      if (res.status === 401) throw new Error('Public catalog should not require admin auth')
    })

    // 5. Admin login with incorrect password must FAIL (401)
    await test('POST /api/admin/login with invalid key returns 401', async () => {
      const res = await fetch('http://localhost:5099/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'wrong_password_123' }),
      })
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
    })

    // 6. Admin login with correct password succeeds and issues token
    let adminToken = ''
    await test('POST /api/admin/login with valid key returns 200 + token', async () => {
      const res = await fetch('http://localhost:5099/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'crazytours_admin_secure_2026' }),
      })
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
      const data = await res.json()
      if (!data.token) throw new Error('No token returned in login response')
      adminToken = data.token
    })

    // 7. Verify token endpoint succeeds
    await test('GET /api/admin/verify with valid token returns authenticated: true', async () => {
      const res = await fetch('http://localhost:5099/api/admin/verify', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
      const data = await res.json()
      if (!data.authenticated) throw new Error('Token verification failed')
    })

    // 8. Booking lookup with incomplete params returns 400
    await test('POST /api/bookings/lookup without phone returns 400', async () => {
      const res = await fetch('http://localhost:5099/api/bookings/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: 'CT-123456' }),
      })
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`)
    })

    // 9. Unauthenticated mutation POST /api/destinations must be BLOCKED (401)
    await test('Unauthenticated mutation POST /api/destinations returns 401', async () => {
      const res = await fetch('http://localhost:5099/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: 'Test' }),
      })
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
    })

    console.log(`\nResults: ${passed} passed, ${failed} failed.`)
  } finally {
    server.close(() => {
      process.exit(failed > 0 ? 1 : 0)
    })
  }
})
