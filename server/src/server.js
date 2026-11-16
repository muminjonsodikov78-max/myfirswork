import 'dotenv/config'
import app from './app.js'
import { pool } from './config/database.js'

const port = Number(process.env.PORT || 3001)

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET kamida 32 belgidan iborat bo‘lishi kerak')
}

const server = app.listen(port, () => {
  console.log(`Muhsin Talimi API http://localhost:${port} manzilida ishga tushdi`)
})

async function shutdown() {
  server.close(async () => {
    await pool.end()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
