import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import styles from './AdminLogin.module.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form)
      navigate('/admin/reservas')
    } catch (err) {
      setError(err?.response?.data?.error || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.kicker}>Panel Administrativo</p>
        <h1 className={styles.title}>Administrador</h1>
        <p className={styles.text}>Ingreso al panel de reservas</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Correo o usuario
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin@camaluna.com"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLogin
