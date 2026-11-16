import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { pool } from '../src/config/database.js'

try {
  const sqlPath = new URL('../migrations/001_create_users.sql', import.meta.url)
  const sql = await readFile(fileURLToPath(sqlPath), 'utf8')
  await pool.query(sql)
  console.log('001_create_users.sql muvaffaqiyatli bajarildi.')
} catch (error) {
  console.error('Migratsiya bajarilmadi:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
