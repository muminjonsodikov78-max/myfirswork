import { Router } from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../config/database.js'
import { allowRoles } from '../middleware/auth.js'

const router = Router()
const roles = ['administrator', 'teacher', 'cashier', 'parent']

router.get('/', allowRoles('director'), async (_req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, display_name, is_active, created_at FROM users ORDER BY created_at DESC',
    )
    res.json({ users: result.rows })
  } catch (error) {
    next(error)
  }
})

router.post('/', allowRoles('director'), async (req, res, next) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase()
    const password = String(req.body?.password || '')
    const displayName = String(req.body?.displayName || '').trim()
    const role = String(req.body?.role || '')

    if (!/^[a-z0-9._-]{3,50}$/.test(username)) {
      return res.status(400).json({ error: 'Login 3–50 belgidan iborat bo‘lsin.' })
    }
    if (password.length < 12 || password.length > 200) {
      return res.status(400).json({ error: 'Parol 12–200 belgidan iborat bo‘lishi kerak.' })
    }
    if (!displayName || displayName.length > 120) {
      return res.status(400).json({ error: 'Ism 1–120 belgidan iborat bo‘lishi kerak.' })
    }
    if (!roles.includes(role)) {
      return res.status(400).json({ error: 'Tanlangan rol noto‘g‘ri.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role, display_name) VALUES ($1, $2, $3, $4) RETURNING id, username, role, display_name, is_active, created_at',
      [username, passwordHash, role, displayName],
    )
    res.status(201).json({ user: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Bu login band. Boshqa login tanlang.' })
    }
    next(error)
  }
})

export default router
