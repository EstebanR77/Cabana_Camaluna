import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero   from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { createReservation, getReservationStatus } from '../services/api'
import styles from './Reserve.module.css'

/* ── Datos ───────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: 'Selección de estadia' },
  { num: 2, label: 'Información del alojamiento' },
  { num: 3, label: 'Resumen de la reserva' },
  { num: 4, label: 'Validación' },
]

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

const DAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

/* ── Utilidades de calendario ───────────────────────── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay()
}

function formatDateForApi(date) {
  return date.toISOString().slice(0, 10)
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/* ── Componente Calendar mini ─────────────────────── */
function MiniCalendar({ year, month, onSelect, range }) {
  const days = getDaysInMonth(year, month)
  const first = getFirstDay(year, month)

  return (
    <div className={styles.calendar}>
      <p className={styles.calMonth}>{MONTHS[month]} {year}</p>
      <div className={styles.calGrid}>
        {DAYS.map(d => <span key={d} className={styles.calDayName}>{d}</span>)}
        {Array.from({ length: first }).map((_, i) => <span key={'e'+i} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const isStart = range.start && date.toDateString() === range.start.toDateString()
          const isEnd   = range.end   && date.toDateString() === range.end.toDateString()
          const inRange = range.start && range.end && date > range.start && date < range.end
          return (
            <button
              key={day}
              className={[
                styles.calDay,
                isStart ? styles.calStart : '',
                isEnd   ? styles.calEnd   : '',
                inRange ? styles.calRange : '',
              ].join(' ')}
              onClick={() => onSelect(date)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Step 1: Fechas ───────────────────────────────── */
function Step1({ range, onRangeChange }) {
  const today = new Date()
  const [year]  = useState(today.getFullYear())
  const [month1] = useState(today.getMonth())
  const month2 = (month1 + 1) % 12
  const year2  = month1 === 11 ? year + 1 : year

  function handleSelect(date) {
    if (!range.start || (range.start && range.end)) {
      onRangeChange({ start: date, end: null })
    } else {
      if (date < range.start) {
        onRangeChange({ start: date, end: range.start })
      } else {
        onRangeChange({ start: range.start, end: date })
      }
    }
  }

  return (
    <div className={styles.step}>
      <p className={styles.stepLabel}>Paso 1 — Selección de estadía</p>
      <div className={styles.calendars}>
        <MiniCalendar year={year}  month={month1} range={range} onSelect={handleSelect} />
        <MiniCalendar year={year2} month={month2} range={range} onSelect={handleSelect} />
      </div>
      {range.start && range.end && (
        <div className={styles.rangeInfo}>
          <span>📅 Check-in: <b>{range.start.toLocaleDateString('es-CO')}</b></span>
          <span>📅 Check-out: <b>{range.end.toLocaleDateString('es-CO')}</b></span>
        </div>
      )}
    </div>
  )
}

/* ── Step 2: Info ─────────────────────────────────── */
function Step2({ form, onChange }) {
  return (
    <div className={styles.step}>
      <p className={styles.stepLabel}>Paso 2 — Información del alojamiento</p>
      <div className={styles.formGrid}>
        {[
          { id: 'nombre',    label: 'Nombre completo',  type: 'text'  },
          { id: 'email',     label: 'Correo electrónico', type: 'email'},
          { id: 'telefono',  label: 'Teléfono',          type: 'tel'  },
          { id: 'huespedes', label: 'N° de huéspedes',   type: 'number'},
        ].map(({ id, label, type }) => (
          <div key={id} className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
              className={styles.input}
              type={type}
              value={form[id] || ''}
              onChange={e => onChange(id, e.target.value)}
              placeholder={label}
            />
          </div>
        ))}
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label}>Solicitudes especiales</label>
          <textarea
            className={styles.textarea}
            rows={3}
            value={form.solicitudes || ''}
            onChange={e => onChange('solicitudes', e.target.value)}
            placeholder="¿Alguna solicitud especial?"
          />
        </div>
      </div>
    </div>
  )
}

/* ── Step 3: Resumen ──────────────────────────────── */
function Step3({ range, form, paymentProof, onPaymentProofChange }) {
  const nights = range.start && range.end
    ? Math.round((range.end - range.start) / 86400000)
    : 0
  const pricePerNight = 350000
  const total = nights * pricePerNight

  return (
    <div className={styles.step}>
      <p className={styles.stepLabel}>Paso 3 — Resumen de la reserva</p>
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryKey}>Check-in</p>
          <p className={styles.summaryVal}>{range.start?.toLocaleDateString('es-CO') || '—'}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryKey}>Check-out</p>
          <p className={styles.summaryVal}>{range.end?.toLocaleDateString('es-CO') || '—'}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryKey}>Noches</p>
          <p className={styles.summaryVal}>{nights}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryKey}>Huéspedes</p>
          <p className={styles.summaryVal}>{form.huespedes || '—'}</p>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryTotal}`}>
          <p className={styles.summaryKey}>Total estimado</p>
          <p className={styles.summaryVal}>
            ${total.toLocaleString('es-CO')} COP
          </p>
        </div>
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label className={styles.label}>Comprobante de pago</label>
        <input
          className={styles.input}
          type="file"
          accept="image/*,.pdf"
          onChange={e => onPaymentProofChange(e.target.files?.[0] || null)}
        />
        <p className={styles.summaryKey}>
          El administrador revisará este comprobante antes de confirmar la reserva.
        </p>
        {paymentProof && (
          <p className={styles.summaryVal}>{paymentProof.name}</p>
        )}
      </div>
    </div>
  )
}

/* ── Step 4: Validación ───────────────────────────── */
function Step4({ reservation }) {
  const [status, setStatus] = useState(reservation?.status || 'pending_review')
  const [entryCode, setEntryCode] = useState(reservation?.entryCode || null)
  const [message, setMessage] = useState(
    reservation?.reviewMessage || 'Tu comprobante está en revisión por el administrador.'
  )

  useEffect(() => {
    if (!reservation?.id || status === 'approved' || status === 'rejected') return

    const interval = setInterval(async () => {
      try {
        const { data } = await getReservationStatus(reservation.id)
        setStatus(data.status)
        setEntryCode(data.entryCode || null)
        setMessage(data.reviewMessage || '')
      } catch (err) {
        console.error('No se pudo consultar el estado de la reserva', err)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [reservation?.id, status])

  if (status === 'approved') {
    return (
      <div className={`${styles.step} ${styles.stepConfirmed}`}>
        <div className={styles.confirmedIcon}>✅</div>
        <h3 className={styles.confirmedTitle}>¡Reserva Confirmada!</h3>
        <p className={styles.confirmedText}>
          El administrador aprobó tu comprobante. Pronto nos pondremos en contacto contigo.
        </p>
        {entryCode && (
          <p className={styles.confirmedText}>
            Tu código de entrada es: <b>{entryCode}</b>
          </p>
        )}
        <Link to="/" className={styles.confirmedBtn}>Volver al inicio</Link>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className={`${styles.step} ${styles.stepConfirmed}`}>
        <div className={styles.confirmedIcon}>⚠️</div>
        <h3 className={styles.confirmedTitle}>Comprobante rechazado</h3>
        <p className={styles.confirmedText}>{message}</p>
        <Link to="/reserve" className={styles.confirmedBtn}>Intentar nuevamente</Link>
      </div>
    )
  }

  return (
    <div className={`${styles.step} ${styles.stepConfirmed}`}>
      <div className={styles.confirmedIcon}>⏳</div>
      <h3 className={styles.confirmedTitle}>Comprobante en revisión</h3>
      <p className={styles.confirmedText}>
        {message || 'Tu comprobante fue enviado. Espera la aprobación del administrador para confirmar la reserva.'}
      </p>
      <p className={styles.summaryKey}>Esta pantalla se actualizará automáticamente cuando el administrador revise tu comprobante.</p>
    </div>
  )
}

/* ── Página Reserve ───────────────────────────────── */
function Reserve() {
  const [step, setStep]   = useState(1)
  const [range, setRange] = useState({ start: null, end: null })
  const [form, setForm]   = useState({})
  const [paymentProof, setPaymentProof] = useState(null)
  const [reservation, setReservation] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleFormChange(id, val) {
    setForm(f => ({ ...f, [id]: val }))
  }

  function canNext() {
    if (step === 1) return range.start && range.end
    if (step === 2) return form.nombre && form.email && form.telefono
    if (step === 3) return paymentProof && !isSubmitting
    return true
  }

  async function handleNext() {
    setError('')

    if (step < 3) {
      setStep(s => s + 1)
      return
    }

    if (step === 3) {
      try {
        setIsSubmitting(true)

        const nights = Math.round((range.end - range.start) / 86400000)
        const total = nights * 350000
        const paymentProofData = await fileToDataURL(paymentProof)

        const payload = {
          checkIn: formatDateForApi(range.start),
          checkOut: formatDateForApi(range.end),
          name: form.nombre,
          email: form.email,
          phone: form.telefono,
          guests: form.huespedes,
          notes: form.solicitudes || '',
          total,
          paymentProof: paymentProofData,
          paymentProofName: paymentProof.name
        }

        const { data } = await createReservation(payload)
        setReservation(data.reservation)
        setStep(4)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo enviar la reserva. Intenta nuevamente.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className={styles.page}>

      <RevealBlock variant="heroReveal">
      <Hero
        subtitle="Cabaña Boutique"
        title="Reserva tu estadía"
        description="Elige tus fechas, completa tu información y asegura tu experiencia en Camaluna."
      />
      </RevealBlock>

      {/* Booking section */}
      <RevealBlock as="section" className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Reserva paso a paso</h2>

        {/* Step bar */}
        <div className={styles.stepBar}>
          {STEPS.map(s => (
            <div
              key={s.num}
              className={[
                styles.stepItem,
                step === s.num  ? styles.stepActive    : '',
                step > s.num    ? styles.stepCompleted : '',
              ].join(' ')}
            >
              <div className={styles.stepCircle}>{step > s.num ? '✓' : s.num}</div>
              <span className={styles.stepName}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Contenido del paso */}
        <div className={styles.stepContent}>
          {step === 1 && <Step1 range={range} onRangeChange={setRange} />}
          {step === 2 && <Step2 form={form} onChange={handleFormChange} />}
          {step === 3 && (
            <Step3
              range={range}
              form={form}
              paymentProof={paymentProof}
              onPaymentProofChange={setPaymentProof}
            />
          )}
          {step === 4 && <Step4 reservation={reservation} />}
          {error && <p className={styles.confirmedText}>{error}</p>}
        </div>

        {/* Botones de navegación */}
        {step < 4 && (
          <div className={styles.navBtns}>
            {step > 1 && (
              <button className={styles.btnBack} onClick={() => setStep(s => s - 1)}>
                ← Atrás
              </button>
            )}
            <button
              className={styles.btnNext}
              onClick={handleNext}
              disabled={!canNext()}
            >
              {step === 3 ? (isSubmitting ? 'Enviando...' : 'Enviar comprobante') : 'Continuar →'}
            </button>
          </div>
        )}
      </RevealBlock>

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </div>
  )
}

export default Reserve
