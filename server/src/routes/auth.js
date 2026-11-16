import { Router } from 'express'
import bcrypt from 'bcrypt'
import { rateLimit } from 'express-rate-limit'
import { pool } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Juda ko‘p urinish. 15 daqiqadan keyin qayta urinib ko‘ring.' },
})

router.post('/login', loginLimit, async (req, res, next) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase()
    const password = String(req.body?.password || '')
    if (!/^[a-z0-9._-]{3,50}$/.test(username) || password.length < 1 || password.length > 200) {
      return res.status(400).json({ error: 'Login yoki parol formati noto‘g‘ri' })
    }

    const result = await pool.query(
      'SELECT id, username, password_hash, role, display_name, is_active FROM users WHERE username = $1 LIMIT 1',
      [username],
    )
    const user = result.rows[0]
    const valid = user ? await bcrypt.compare(password, user.password_hash) : false
    if (!user || !valid || !user.is_active) {
      return res.status(401).json({ error: 'Login yoki parol noto‘g‘ri' })
    }

    req.session.regenerate((error) => {
      if (error) return next(error)
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.display_name,
      }
      req.session.save((saveError) => {
        if (saveError) return next(saveError)
        res.json({ user: req.session.user })
      })
    })
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user })
})

router.post('/logout', (req, res, next) => {
  if (!req.session) return res.json({ ok: true })
  req.session.destroy((error) => {
    if (error) return next(error)
    res.clearCookie('muhsin.sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    res.json({ ok: true })
  })
})

export default router
