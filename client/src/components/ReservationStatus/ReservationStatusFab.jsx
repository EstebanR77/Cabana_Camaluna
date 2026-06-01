import { useEffect, useState } from 'react'
import { lookupReservation } from '../../services/api'
import styles from './ReservationStatusFab.module.css'

const WHATSAPP_URL = 'https://wa.me/573107777579?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20mi%20reserva%20cancelada%20en%20Camaluna.'

function MaterialIcon({ name, className = '' }) {
  return (
    <span className={`${styles.materialIcon} ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}

function validateForm(holderName, requestCode) {
  const errors = {}
  const name = holderName.trim()
  const code = requestCode.trim()

  if (!name) {
    errors.holderName = 'Ingresa el nombre del titular.'
  } else if (name.length < 2) {
    errors.holderName = 'El nombre debe tener al menos 2 caracteres.'
  }

  if (!code) {
    errors.requestCode = 'Ingresa el código de solicitud.'
  } else if (!/^\d{8,20}$/.test(code)) {
    errors.requestCode = 'El código debe ser numérico (como el que recibiste al reservar).'
  }

  return errors
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function ReservationResult({ reservation }) {
  const { status, accessCode, checkIn, checkOut } = reservation

  if (status === 'approved') {
    return (
      <div className={`${styles.resultBox} ${styles.resultSuccess}`}>
        <MaterialIcon name="check_circle" className={styles.resultIcon} />
        <h3 className={styles.resultTitle}>Reserva confirmada</h3>
        <p className={styles.resultText}>
          Tu estadía del {formatDate(checkIn)} al {formatDate(checkOut)} está confirmada.
        </p>
        {accessCode && (
          <p className={styles.accessCode}>
            Código de entrada: <strong>{accessCode}</strong>
          </p>
        )}
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className={`${styles.resultBox} ${styles.resultCancelled}`}>
        <MaterialIcon name="cancel" className={styles.resultIcon} />
        <h3 className={styles.resultTitle}>Reserva cancelada</h3>
        <p className={styles.resultText}>
          Tu solicitud fue cancelada o rechazada. Escríbenos por WhatsApp y con gusto te ayudamos.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.whatsappBtn}
        >
          <MaterialIcon name="chat" />
          Contactar por WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div className={`${styles.resultBox} ${styles.resultPending}`}>
      <MaterialIcon name="hourglass_top" className={styles.resultIcon} />
      <h3 className={styles.resultTitle}>Esperando confirmación del administrador</h3>
      <p className={styles.resultText}>
        Recibimos tu solicitud del {formatDate(checkIn)} al {formatDate(checkOut)}.
        Te avisaremos cuando el comprobante sea revisado.
      </p>
    </div>
  )
}

function ReservationStatusFab() {
  const [modalOpen, setModalOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [holderName, setHolderName] = useState('')
  const [requestCode, setRequestCode] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [lookupResult, setLookupResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isHovering) {
      setShowTooltip(false)
      return undefined
    }

    const timer = window.setTimeout(() => setShowTooltip(true), 400)
    return () => window.clearTimeout(timer)
  }, [isHovering])

  useEffect(() => {
    if (!modalOpen) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [modalOpen])

  function resetForm() {
    setHolderName('')
    setRequestCode('')
    setFieldErrors({})
    setLookupResult(null)
    setError('')
    setLoading(false)
  }

  function openModal() {
    resetForm()
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setIsHovering(false)
    setShowTooltip(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLookupResult(null)

    const errors = validateForm(holderName, requestCode)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    try {
      const { data } = await lookupReservation({
        name: holderName.trim(),
        requestCode: requestCode.trim(),
      })
      setLookupResult(data.reservation)
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'No pudimos consultar la reserva. Verifica los datos e intenta de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.fabWrap}>
        <span
          className={`${styles.tooltip} ${showTooltip && !modalOpen ? styles.tooltipVisible : ''}`}
          role="tooltip"
        >
          Conozca el estado de su reserva
        </span>

        <button
          type="button"
          className={styles.fabButton}
          onClick={openModal}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onFocus={() => setIsHovering(true)}
          onBlur={() => setIsHovering(false)}
          aria-label="Consultar estado de reserva"
          aria-expanded={modalOpen}
        >
          <MaterialIcon name="event_available" className={styles.fabIcon} />
        </button>
      </div>

      {modalOpen && (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={closeModal}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-status-title"
            onClick={event => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="reservation-status-title" className={styles.modalTitle}>
                <MaterialIcon name="search" className={styles.titleIcon} />
                Estado de su reserva
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeModal}
                aria-label="Cerrar consulta de reserva"
              >
                <MaterialIcon name="close" />
              </button>
            </div>

            <p className={styles.modalIntro}>
              Busque con el nombre del titular y el código de solicitud que recibió al enviar su reserva.
            </p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="reservation-holder-name">Nombre del titular</label>
                <input
                  id="reservation-holder-name"
                  type="text"
                  name="holderName"
                  value={holderName}
                  onChange={event => setHolderName(event.target.value)}
                  placeholder="Ej. María García"
                  autoComplete="name"
                  disabled={loading}
                />
                {fieldErrors.holderName && (
                  <p className={styles.fieldError}>{fieldErrors.holderName}</p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="reservation-request-code">Código de solicitud</label>
                <input
                  id="reservation-request-code"
                  type="text"
                  name="requestCode"
                  inputMode="numeric"
                  value={requestCode}
                  onChange={event => setRequestCode(event.target.value.replace(/\D/g, ''))}
                  placeholder="Ej. 1717000000000"
                  autoComplete="off"
                  disabled={loading}
                />
                {fieldErrors.requestCode && (
                  <p className={styles.fieldError}>{fieldErrors.requestCode}</p>
                )}
              </div>

              {error && <p className={styles.formError}>{error}</p>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar reserva'}
              </button>
            </form>

            {lookupResult && <ReservationResult reservation={lookupResult} />}
          </div>
        </div>
      )}
    </>
  )
}

export default ReservationStatusFab
