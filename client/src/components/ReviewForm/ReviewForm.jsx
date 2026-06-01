import { useEffect, useMemo, useState } from 'react'
import {
  filterReviewName,
  filterReviewText,
  validateReviewForm,
  validateReviewName,
  validateReviewStayDate,
  validateReviewText,
  validateReviewStars,
} from '../../utils/inputValidation'
import styles from './ReviewForm.module.css'

const initialForm = {
  name: '',
  stayDate: '',
  text: '',
  stars: 0,
}

function getTodayValue() {
  return new Date().toISOString().split('T')[0]
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

  function setFieldError(field, message) {
    setErrors(previous => {
      const next = { ...previous }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  function updateField(field, value) {
    let nextValue = value

    if (field === 'text') {
      nextValue = filterReviewText(value)
    } else if (field === 'name') {
      nextValue = filterReviewName(value)
    } else if (field === 'stars') {
      nextValue = Number(value) || 0
    }

    setForm(current => ({
      ...current,
      [field]: nextValue,
    }))
    setFieldError(field, '')
    setAlert('')
  }

  function handleBlur(field) {
    let message = ''
    if (field === 'name') message = validateReviewName(form.name)
    if (field === 'stayDate') message = validateReviewStayDate(form.stayDate)
    if (field === 'text') message = validateReviewText(form.text)
    if (field === 'stars') message = validateReviewStars(form.stars)
    setFieldError(field, message)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateReviewForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setAlert('Revisa los campos marcados en rojo antes de enviar tu reseña.')
      return
    }

    const payload = {
      name: filterReviewName(form.name).trim(),
      stayDate: form.stayDate,
      text: filterReviewText(form.text).trim(),
      stars: Number(form.stars),
    }

    const saved = await onSubmit(payload)

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
              onChange={event => updateField('name', event.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Escribe tu nombre completo"
              autoComplete="name"
              maxLength={70}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <small role="alert">{errors.name}</small>}
          </label>

          <label className={`${styles.field} ${errors.stayDate ? styles.fieldError : ''}`}>
            <span>Fecha de estadía</span>
            <input
              type="date"
              value={form.stayDate}
              onChange={event => updateField('stayDate', event.target.value)}
              onBlur={() => handleBlur('stayDate')}
              max={today}
              aria-invalid={Boolean(errors.stayDate)}
            />
            {errors.stayDate && <small role="alert">{errors.stayDate}</small>}
          </label>
        </div>

        <label className={`${styles.field} ${errors.text ? styles.fieldError : ''}`}>
          <span>Tu reseña</span>
          <textarea
            value={form.text}
            onChange={event => updateField('text', event.target.value)}
            onBlur={() => handleBlur('text')}
            rows={5}
            maxLength={500}
            placeholder="Cuéntanos tu experiencia en Camaluna..."
            aria-invalid={Boolean(errors.text)}
          />
          <span className={styles.counter}>{form.text.length}/500</span>
          {errors.text && <small role="alert">{errors.text}</small>}
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
                  onBlur={() => {
                    setHoveredStars(0)
                    handleBlur('stars')
                  }}
                  onClick={() => updateField('stars', value)}
                  aria-label={`${value} estrellas`}
                  aria-pressed={form.stars === value}
                >
                  ★
                </button>
              )
            })}
          </div>
          {errors.stars && <small role="alert">{errors.stars}</small>}
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
