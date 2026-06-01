import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { filterEmail, validateEmail } from '../utils/inputValidation'
import styles from './AdminLogin.module.css'

function MaterialIcon({ name }) {
  return (
    <span className={styles.materialIcon} aria-hidden="true">
      {name}
    </span>
  )
}

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    document.title = 'Administrador | Camaluna'
    return () => {
      document.title = 'Camaluna'
    }
  }, [])

  useEffect(() => {
    if (!error) return undefined
    const timer = window.setTimeout(() => setError(''), 6000)
    return () => window.clearTimeout(timer)
  }, [error])

  function handleUsernameChange(value) {
    const username = filterEmail(value)
    setForm(previous => ({ ...previous, username }))
    if (fieldErrors.username) {
      const message = validateEmail(username)
      setFieldErrors(previous => {
        const next = { ...previous }
        if (message) next.username = message
        else delete next.username
        return next
      })
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const usernameError = validateEmail(form.username)
    const passwordError = !form.password.trim()
      ? 'Ingresa tu contraseña.'
      : form.password.length < 4
        ? 'La contraseña debe tener al menos 4 caracteres.'
        : ''

    const nextErrors = {}
    if (usernameError) nextErrors.username = usernameError
    if (passwordError) nextErrors.password = passwordError

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    login({ username: form.username.trim(), password: form.password })
      .then(() => navigate('/admin/reservas'))
      .catch(err => {
        setError(err?.response?.data?.error || 'No se pudo iniciar sesión. Verifica tus datos.')
      })
      .finally(() => setLoading(false))
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.card}>
          <div className={styles.brandRow}>
            <div className={styles.brandIcon}>
              <MaterialIcon name="admin_panel_settings" />
            </div>
            <div>
              <p className={styles.kicker}>Panel administrativo</p>
              <h1 className={styles.title}>Administrador</h1>
            </div>
          </div>

          <p className={styles.subtitle}>
            Ingresa tus credenciales para revisar comprobantes y gestionar reservas de Camaluna.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="admin-username">
                Correo o usuario
              </label>
              <input
                id="admin-username"
                className={`${styles.input} ${fieldErrors.username ? styles.inputInvalid : ''}`}
                name="username"
                type="email"
                value={form.username}
                onChange={event => handleUsernameChange(event.target.value)}
                onBlur={() => {
                  const message = validateEmail(form.username)
                  setFieldErrors(previous => {
                    const next = { ...previous }
                    if (message) next.username = message
                    else delete next.username
                    return next
                  })
                }}
                placeholder="admin@camaluna.com"
                autoComplete="username"
                maxLength={120}
              />
              {fieldErrors.username && (
                <p className={styles.fieldError} role="alert">{fieldErrors.username}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="admin-password">
                Contraseña
              </label>
              <div className={styles.passwordWrap}>
                <input
                  id="admin-password"
                  className={`${styles.input} ${fieldErrors.password ? styles.inputInvalid : ''}`}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={event => {
                    setForm(previous => ({ ...previous, password: event.target.value }))
                    if (fieldErrors.password) {
                      setFieldErrors(previous => {
                        const next = { ...previous }
                        delete next.password
                        return next
                      })
                    }
                  }}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  maxLength={64}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} />
                </button>
              </div>
              {fieldErrors.password && (
                <p className={styles.fieldError} role="alert">{fieldErrors.password}</p>
              )}
            </div>

            {error && <p className={styles.alert} role="alert">{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar al panel'}
            </button>
          </form>

          <Link to="/" className={styles.backLink}>
            <MaterialIcon name="arrow_back" />
            Volver al sitio
          </Link>
        </section>
      </div>
    </main>
  )
}

export default AdminLogin
