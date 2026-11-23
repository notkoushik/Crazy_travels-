import pg from 'pg'

const { Pool } = pg

// If DATABASE_URL is provided (e.g. Supabase, Neon, or cloud Postgres), use it with SSL
// Otherwise fallback to local PostgreSQL configuration
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '0907',
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432'),
        database: process.env.PGDATABASE || 'crazy_tours_db',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
)

pool.on('connect', () => {
  // Connected to PostgreSQL database (local or Supabase)
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err)
})

