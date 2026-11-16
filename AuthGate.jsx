import { useEffect, useState } from 'react'
import App from './App.jsx'
import './AuthGate.css'

const ROLE_NAMES = {
  director: 'Direktor',
  administrator: 'Administrator',
  teacher: 'O‘qituvchi',
  cashier: 'Kassir',
  parent: 'Ota-ona',
}

export default function AuthGate() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null
        const data = await response.json()
        return data.user || null
      })
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch(() => {
        if (active) setError('Serverga ulanib bo‘lmadi. Backend serverini ishga tushiring.')
      })
      .finally(() => {
        if (active) setChecking(false)
      })
    return () => { active = false }
  }, [])

  async function handleLogin(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Tizimga kirib bo‘lmadi')
      setUser(data.user)
      setPassword('')
    } catch (err) {
      setError(err.message || 'Serverga ulanib bo‘lmadi')
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } finally {
      setUser(null)
      setPassword('')
    }
  }

  if (checking) {
    return <div className="auth-loading">Muhsin Ta’lim Markazi yuklanmoqda...</div>
  }

  if (!user) {
    return (
      <main className="auth-page">
        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-logo">M</div>
          <p className="auth-eyebrow">MUHSIN TA’LIM MARKAZI</p>
          <h1>Tizimga kirish</h1>
          <p className="auth-description">Davom etish uchun login va parolingizni kiriting.</p>
          <label htmlFor="auth-username">Login</label>
          <input id="auth-username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} maxLength={50} />
          <label htmlFor="auth-password">Parol</label>
          <input id="auth-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required maxLength={200} />
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button type="submit" disabled={busy}>{busy ? 'Tekshirilmoqda...' : 'Kirish'}</button>
        </form>
      </main>
    )
  }

  return (
    <>
      <div className="auth-user-chip">
        <span>{user.displayName || user.username} · {ROLE_NAMES[user.role] || user.role}</span>
        <button type="button" onClick={handleLogout}>Chiqish</button>
      </div>
      <App />
    </>
  )
}
