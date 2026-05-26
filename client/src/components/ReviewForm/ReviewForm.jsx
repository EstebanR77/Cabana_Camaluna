import { useEffect, useMemo, useState } from 'react'
import styles from './ReviewForm.module.css'

const REVIEW_MAX_LENGTH = 500
const NAME_MAX_LENGTH = 70
const initialForm = {
  name: '',
  stayDate: '',
  text: '',
  stars: 0,
}

function getTodayValue() {
  return new Date().toISOString().split('T')[0]
}

function hasUnsafeCharacters(value) {
  return /[<>{}$\\]/.test(value)
}

function validateForm(form) {
  const errors = {}
  const cleanName = form.name.trim()
  const cleanText = form.text.trim()

  if (!cleanName) {
    errors.name = 'Escribe tu nombre.'
  } else if (cleanName.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres.'
  } else if (cleanName.length > NAME_MAX_LENGTH) {
    errors.name = `El nombre no puede superar ${NAME_MAX_LENGTH} caracteres.`
  } else if (hasUnsafeCharacters(cleanName)) {
    errors.name = 'Evita caracteres como <, >, {, } o $.'
  }

  if (!form.stayDate) {
    errors.stayDate = 'Selecciona la fecha de estadía.'
  } else if (new Date(`${form.stayDate}T00:00:00`) > new Date()) {
    errors.stayDate = 'La fecha de estadía no puede ser futura.'
  }

  if (!cleanText) {
    errors.text = 'Escribe tu reseña.'
  } else if (cleanText.length < 20) {
    errors.text = 'La reseña debe tener al menos 20 caracteres.'
  } else if (cleanText.length > REVIEW_MAX_LENGTH) {
    errors.text = `La reseña no puede superar ${REVIEW_MAX_LENGTH} caracteres.`
  } else if (hasUnsafeCharacters(cleanText)) {
    errors.text = 'Evita caracteres como <, >, {, } o $.'
  }

  if (!form.stars) {
    errors.stars = 'Selecciona una valoración.'
  }

  return errors
}

function ReviewForm({ onSubmit, isSubmitting = false }) {
  const [form, setForm] = useState(initialForm)
  const [hoveredStars, setHoveredStars] = useState(0)
  const [displayStars, setDisplayStars] = useState(0)
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState('')
  const today = useMemo(() => getTodayValue(), [])

  useEffect(() => {
    setDisplayStars(hoveredStars || form.stars)
  }, [hoveredStars, form.stars])

  const updateField = (field, value) => {
    let nextValue = value

    if (field === 'text') {
      nextValue = value.slice(0, REVIEW_MAX_LENGTH)
    } else if (field === 'name') {
      nextValue = value.slice(0, NAME_MAX_LENGTH)
    }

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setAlert('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      setAlert('Revisa los campos marcados en rojo antes de enviar tu reseña.')
      return
    }

    const saved = await onSubmit({
      name: form.name.trim(),
      stayDate: form.stayDate,
      text: form.text.trim(),
      stars: form.stars,
    })

    if (saved) {
      setForm(initialForm)
      setHoveredStars(0)
      setErrors({})
      setAlert('')
    }
  }

  return (
    <section className={styles.shell}>
      <div className={styles.header}>
        <h2 className={styles.title}>¿Estuviste aquí? Comparte tu experiencia</h2>
        <p className={styles.subtitle}>Historias, momentos y experiencias compartidas por nuestros huéspedes.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <label className={`${styles.field} ${errors.name ? styles.fieldError : ''}`}>
            <span>Nombre</span>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Escribe tu nombre completo"
              maxLength={NAME_MAX_LENGTH}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <small>{errors.name}</small>}
          </label>

          <label className={`${styles.field} ${errors.stayDate ? styles.fieldError : ''}`}>
            <span>Fecha de estadía</span>
            <input
              type="date"
              value={form.stayDate}
              onChange={(event) => updateField('stayDate', event.target.value)}
              max={today}
              aria-invalid={Boolean(errors.stayDate)}
            />
            {errors.stayDate && <small>{errors.stayDate}</small>}
          </label>
        </div>

        <label className={`${styles.field} ${errors.text ? styles.fieldError : ''}`}>
          <span>Tu reseña</span>
          <textarea
            value={form.text}
            onChange={(event) => updateField('text', event.target.value)}
            rows={5}
            maxLength={REVIEW_MAX_LENGTH}
            aria-invalid={Boolean(errors.text)}
          />
          <span className={styles.counter}>{form.text.length}/{REVIEW_MAX_LENGTH}</span>
          {errors.text && <small>{errors.text}</small>}
        </label>

        <div className={`${styles.rating} ${errors.stars ? styles.ratingError : ''}`}>
          <span>Tu valoración</span>
          <div className={styles.starButtons}>
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1
              return (
                <button
                  key={value}
                  type="button"
                  className={value <= displayStars ? styles.starActive : ''}
                  onMouseEnter={() => setHoveredStars(value)}
                  onMouseLeave={() => setHoveredStars(0)}
                  onFocus={() => setHoveredStars(value)}
                  onBlur={() => setHoveredStars(0)}
                  onClick={() => updateField('stars', value)}
                  aria-label={`${value} estrellas`}
                  aria-pressed={form.stars === value}
                >
                  ★
                </button>
              )
            })}
          </div>
          {errors.stars && <small>{errors.stars}</small>}
        </div>

        {alert && <p className={styles.alert} role="alert">{alert}</p>}

        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Enviar reseña'}
        </button>
      </form>
    </section>
  )
}

export default ReviewForm
