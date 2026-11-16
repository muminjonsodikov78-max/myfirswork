import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { pool } from '../src/config/database.js'

const migrationFiles = [
  '../migrations/001_create_users.sql',
  '../migrations/002_create_academic_tables.sql',
]

try {
  for (const relativePath of migrationFiles) {
    const sqlPath = new URL(relativePath, import.meta.url)
    const sql = await readFile(fileURLToPath(sqlPath), 'utf8')
    await pool.query(sql)
    console.log(`${relativePath} muvaffaqiyatli bajarildi.`)
  }
} catch (error) {
  console.error('Migratsiya bajarilmadi:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
