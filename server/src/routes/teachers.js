import { Router } from 'express'
import { pool } from '../config/database.js'
import { allowRoles } from '../middleware/auth.js'

const router = Router()
const mapTeacher = (row) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  subject: row.subject,
  salary: row.salary,
  status: row.status,
})

router.get('/', allowRoles('director', 'administrator'), async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM teachers ORDER BY name ASC')
    res.json({ teachers: result.rows.map(mapTeacher) })
  } catch (error) { next(error) }
})

router.post('/', allowRoles('director', 'administrator'), async (req, res, next) => {
  try {
    const { name, phone = '', subject = '', salary = '', status = 'Faol' } = req.body || {}
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 160) {
      return res.status(400).json({ error: 'O‘qituvchi ismi 1–160 belgidan iborat bo‘lishi kerak.' })
    }
    const result = await pool.query(
      'INSERT INTO teachers (name, phone, subject, salary, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name.trim(), String(phone).slice(0, 40), String(subject).slice(0, 120), String(salary).slice(0, 500), String(status).slice(0, 30)],
    )
    res.status(201).json({ teacher: mapTeacher(result.rows[0]) })
  } catch (error) { next(error) }
})

router.put('/:id', allowRoles('director', 'administrator'), async (req, res, next) => {
  try {
    if (!/^\\d+$/.test(req.params.id)) return res.status(400).json({ error: 'ID noto‘g‘ri.' })
    const { name, phone = '', subject = '', salary = '', status = 'Faol' } = req.body || {}
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 160) {
      return res.status(400).json({ error: 'O‘qituvchi ismi 1–160 belgidan iborat bo‘lishi kerak.' })
    }
    const result = await pool.query(
      'UPDATE teachers SET name=$1, phone=$2, subject=$3, salary=$4, status=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
      [name.trim(), String(phone).slice(0, 40), String(subject).slice(0, 120), String(salary).slice(0, 500), String(status).slice(0, 30), req.params.id],
    )
    if (!result.rowCount) return res.status(404).json({ error: 'O‘qituvchi topilmadi.' })
    res.json({ teacher: mapTeacher(result.rows[0]) })
  } catch (error) { next(error) }
})

router.delete('/:id', allowRoles('director', 'administrator'), async (req, res, next) => {
  try {
    if (!/^\\d+$/.test(req.params.id)) return res.status(400).json({ error: 'ID noto‘g‘ri.' })
    const result = await pool.query('DELETE FROM teachers WHERE id=$1', [req.params.id])
    if (!result.rowCount) return res.status(404).json({ error: 'O‘qituvchi topilmadi.' })
    res.json({ ok: true })
  } catch (error) { next(error) }
})

export default router
