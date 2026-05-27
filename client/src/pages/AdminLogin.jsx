import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { login } from '../services/api'
import styles from './Reserve.module.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form)
      navigate('/admin/reservas')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <RevealBlock as="section" className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Administrador</h2>
        <form className={styles.step} onSubmit={handleSubmit}>
          <p className={styles.stepLabel}>Ingreso al panel de reservas</p>

          {error && <p className={styles.confirmedText}>{error}</p>}

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Correo o usuario</label>
              <input
                className={styles.input}
                type="text"
                value={form.username}
                onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="admin@camaluna.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <input
                className={styles.input}
                type="password"
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className={styles.navBtns}>
            <button className={styles.btnNext} type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </RevealBlock>

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </div>
  )
}

export default AdminLogin
