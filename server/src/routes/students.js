import { Router } from 'express'
import { pool } from '../config/database.js'
import { allowRoles } from '../middleware/auth.js'

const router = Router()
const readRoles = ['director', 'administrator', 'teacher', 'cashier']
const writeRoles = ['director', 'administrator']
const mapStudent = (row) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  group: row.group_name,
  payment: row.payment,
  status: row.status,
})

router.get('/', allowRoles(...readRoles), async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY name ASC')
    res.json({ students: result.rows.map(mapStudent) })
  } catch (error) { next(error) }
})

router.post('/', allowRoles(...writeRoles), async (req, res, next) => {
  try {
    const { name, phone = '', group = '', payment = '', status = 'Faol' } = req.body || {}
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 160) {
      return res.status(400).json({ error: 'O‘quvchi ismi 1–160 belgidan iborat bo‘lishi kerak.' })
    }
    const result = await pool.query(
      'INSERT INTO students (name, phone, group_name, payment, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name.trim(), String(phone).slice(0, 40), String(group).slice(0, 120), String(payment).slice(0, 500), String(status).slice(0, 30)],
    )
    res.status(201).json({ student: mapStudent(result.rows[0]) })
  } catch (error) { next(error) }
})

router.put('/:id', allowRoles(...writeRoles), async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'ID noto‘g‘ri.' })
    const { name, phone = '', group = '', payment = '', status = 'Faol' } = req.body || {}
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 160) {
      return res.status(400).json({ error: 'O‘quvchi ismi 1–160 belgidan iborat bo‘lishi kerak.' })
    }
    const result = await pool.query(
      'UPDATE students SET name=$1, phone=$2, group_name=$3, payment=$4, status=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
      [name.trim(), String(phone).slice(0, 40), String(group).slice(0, 120), String(payment).slice(0, 500), String(status).slice(0, 30), req.params.id],
    )
    if (!result.rowCount) return res.status(404).json({ error: 'O‘quvchi topilmadi.' })
    res.json({ student: mapStudent(result.rows[0]) })
  } catch (error) { next(error) }
})

router.delete('/:id', allowRoles(...writeRoles), async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'ID noto‘g‘ri.' })
    const result = await pool.query('DELETE FROM students WHERE id=$1', [req.params.id])
    if (!result.rowCount) return res.status(404).json({ error: 'O‘quvchi topilmadi.' })
    res.json({ ok: true })
  } catch (error) { next(error) }
})

export default router
