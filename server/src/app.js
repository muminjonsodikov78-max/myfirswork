import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { rateLimit } from 'express-rate-limit'
import { pool } from './config/database.js'

const app = express()
const PgSession = connectPgSimple(session)
const isProduction = process.env.NODE_ENV === 'production'
const allowedOrigin = process.env.CLIENT_ORIGIN

if (isProduction) app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    // Server-to-server va lokal health tekshiruvlarida Origin bo'lmasligi mumkin.
    if (!origin || origin === allowedOrigin) return callback(null, true)
    return callback(new Error('Ruxsat etilmagan manba'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '100kb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }))

app.use(session({
  name: 'muhsin.sid',
  store: new PgSession({ pool, tableName: 'user_sessions', createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  },
}))

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable' })
  }
})

app.use((error, _req, res, _next) => {
  console.error(error.message)
  res.status(500).json({ error: 'Serverda ichki xatolik yuz berdi' })
})

export default app
