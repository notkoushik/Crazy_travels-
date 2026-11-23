import app from './app.js'

const PORT = process.env.API_PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Crazy Tours PostgreSQL API Server running at http://localhost:${PORT}`)
})
