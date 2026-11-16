import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Muhsin Ta’lim ilovasida xato:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', padding: '32px', background: '#fff7f7', color: '#7f1d1d', fontFamily: 'Arial, sans-serif' }}>
          <section style={{ maxWidth: '900px', margin: '40px auto', padding: '28px', border: '1px solid #fecaca', borderRadius: '16px', background: 'white' }}>
            <h1 style={{ marginTop: 0 }}>Ilovada xatolik aniqlandi</h1>
            <p>Oq ekran o‘rniga xato tafsiloti ko‘rsatildi. Quyidagi yozuvni menga yuboring.</p>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: '16px', background: '#fff1f2', borderRadius: '10px', fontSize: '14px' }}>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
            <button onClick={() => window.location.reload()} style={{ padding: '11px 18px', border: 0, borderRadius: '8px', background: '#7f1d1d', color: 'white', cursor: 'pointer' }}>Sahifani qayta yuklash</button>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
