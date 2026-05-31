import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { login } from '../services/api'
import styles from './AdminLogin.module.css'

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
      setError(err.response?.data?.error || 'No se pudo iniciar sesi\u00f3n.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <RevealBlock as="section" className={styles.card}>
        <p className={styles.kicker}>Panel privado</p>
        <h2 className={styles.title}>Administrador</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.text}>Ingreso al panel de reservas</p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Correo o usuario</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="admin@camaluna.com"
              />
            </div>

            <div className={styles.field}>
              <label>{'Contrase\u00f1a'}</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder={'Contrase\u00f1a'}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={loading}>
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
