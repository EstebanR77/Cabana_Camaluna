import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import Footer from '../components/Footer/Footer'
import styles from './Reserve.module.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ username, password })
      navigate('/admin/reservas')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Administrador</h2>
        <div className={styles.stepContent}>
          <form className={styles.step} onSubmit={handleSubmit}>
            <p className={styles.stepLabel}>Ingreso administrativo</p>
            <div className={styles.field}>
              <label className={styles.label}>Correo o usuario</label>
              <input className={styles.input} value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p className={styles.confirmedText}>{error}</p>}
            <button className={styles.btnNext} disabled={loading || !username || !password} type="submit">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default AdminLogin
