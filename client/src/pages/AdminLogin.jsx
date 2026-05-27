import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form)
      navigate('/admin/reservas')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '70vh', padding: '4rem 1.5rem', background: 'var(--color-page-bg)' }}>
      <section style={{ maxWidth: 420, margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '18px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ color: 'var(--color-green)', fontWeight: 700, letterSpacing: '.08em' }}>PANEL DE ADMINISTRACIÓN</p>
        <h1 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.5rem' }}>Ingreso administrador</h1>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label>
            <span>Correo o usuario</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin@camaluna.com"
              style={{ width: '100%', padding: '.8rem', marginTop: '.4rem', border: '1px solid #ccc', borderRadius: '10px' }}
            />
          </label>

          <label>
            <span>Contraseña</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              style={{ width: '100%', padding: '.8rem', marginTop: '.4rem', border: '1px solid #ccc', borderRadius: '10px' }}
            />
          </label>

          {error && <p style={{ color: '#9b2c2c' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '.85rem 1rem', border: 0, borderRadius: '10px', background: 'var(--color-green-dark)', color: 'white', cursor: 'pointer' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLogin
