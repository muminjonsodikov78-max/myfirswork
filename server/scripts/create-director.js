import 'dotenv/config'
import readline from 'node:readline'
import bcrypt from 'bcrypt'
import { pool } from '../src/config/database.js'

function ask(question, defaultValue = '') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close()
    resolve(answer.trim() || defaultValue)
  }))
}

function askHidden(question) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin
    if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
      reject(new Error('Parolni yashirin kiritish uchun oddiy terminaldan ishga tushiring.'))
      return
    }
    let value = ''
    process.stdout.write(question)
    stdin.setRawMode(true)
    stdin.resume()
    const onData = (chunk) => {
      const char = chunk.toString('utf8')
      if (char === '\\u0003') {
        cleanup()
        reject(new Error('Bekor qilindi'))
      } else if (char === '\\r' || char === '\\n') {
        cleanup()
        process.stdout.write('\\n')
        resolve(value)
      } else if (char === '\\u007f' || char === '\\b') {
        value = value.slice(0, -1)
      } else if (char >= ' ' && char <= '~') {
        value += char
      }
    }
    function cleanup() {
      stdin.removeListener('data', onData)
      stdin.setRawMode(false)
      stdin.pause()
    }
    stdin.on('data', onData)
  })
}

try {
  const username = (await ask('Direktor login [director]: ', 'director')).toLowerCase()
  if (!/^[a-z0-9._-]{3,50}$/.test(username)) throw new Error('Login 3–50 belgidan iborat bo‘lsin (a-z, 0-9, ., _, -).')
  const password = await askHidden('Direktor paroli (kamida 12 belgi, ekranda ko‘rinmaydi): ')
  if (password.length < 12 || password.length > 200) throw new Error('Parol 12–200 belgidan iborat bo‘lishi kerak.')
  const confirmation = await askHidden('Parolni qayta kiriting: ')
  if (password !== confirmation) throw new Error('Parollar mos kelmadi.')
  const displayName = await ask('Direktorning ko‘rinadigan ismi [Direktor]: ', 'Direktor')
  const hash = await bcrypt.hash(password, 12)
  await pool.query(
    'INSERT INTO users (username, password_hash, role, display_name) VALUES ($1, $2, $3, $4)',
    [username, hash, 'director', displayName],
  )
  console.log('Direktor hisobi yaratildi. Parol bazada xesh ko‘rinishida saqlanadi.')
} catch (error) {
  console.error('Hisob yaratilmadi:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
