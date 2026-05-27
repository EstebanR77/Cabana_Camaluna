import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero   from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer'
import { createReservation, getReservationById } from '../services/api'
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

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

function fileToBase64(file) {
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className={styles.calendar}>
      <p className={styles.calMonth}>{MONTHS[month]} {year}</p>
      <div className={styles.calGrid}>
        {DAYS.map(d => <span key={d} className={styles.calDayName}>{d}</span>)}
        {Array.from({ length: first }).map((_, i) => <span key={'e'+i} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const disabled = date < today
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
              onClick={() => !disabled && onSelect(date)}
              disabled={disabled}
              type="button"
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
function Step3({ range, form, proofFile, proofPreview, onProofChange }) {
  const nights = range.start && range.end
    ? Math.round((range.end - range.start) / 86400000)
    : 0
  const pricePerNight = 350000
  const total = nights * pricePerNight

  return (
    <div className={styles.step}>
      <p className={styles.stepLabel}>Paso 3 — Resumen y comprobante</p>
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
          <p className={styles.summaryVal}>${total.toLocaleString('es-CO')} COP</p>
        </div>
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label className={styles.label}>Comprobante de pago</label>
        <input
          className={styles.input}
          type="file"
          accept="image/*,.pdf"
          onChange={onProofChange}
        />
        <p className={styles.summaryKey}>El administrador revisará el comprobante para confirmar o rechazar la reserva.</p>
        {proofFile && <p className={styles.summaryVal}>{proofFile.name}</p>}
        {proofPreview && proofPreview.startsWith('data:image/') && (
          <img src={proofPreview} alt="Vista previa del comprobante" style={{ maxWidth: '260px', borderRadius: '12px' }} />
        )}
      </div>
    </div>
  )
}

/* ── Step 4: Estado de validación ───────────────────── */
function Step4({ reservation }) {
  if (!reservation) return null

  if (reservation.status === 'approved') {
    return (
      <div className={`${styles.step} ${styles.stepConfirmed}`}>
        <div className={styles.confirmedIcon}>✅</div>
        <h3 className={styles.confirmedTitle}>¡Reserva confirmada!</h3>
        <p className={styles.confirmedText}>El administrador aprobó tu comprobante.</p>
        {reservation.accessCode && (
          <p className={styles.confirmedText}><b>Código de entrada:</b> {reservation.accessCode}</p>
        )}
        <Link to="/" className={styles.confirmedBtn}>Volver al inicio</Link>
      </div>
    )
  }

  if (reservation.status === 'rejected') {
    return (
      <div className={`${styles.step} ${styles.stepConfirmed}`}>
        <div className={styles.confirmedIcon}>⚠️</div>
        <h3 className={styles.confirmedTitle}>Comprobante rechazado</h3>
        <p className={styles.confirmedText}>Comunícate con Camaluna para revisar el pago o enviar un nuevo comprobante.</p>
        <Link to="/contact" className={styles.confirmedBtn}>Contactar</Link>
      </div>
    )
  }

  return (
    <div className={`${styles.step} ${styles.stepConfirmed}`}>
      <div className={styles.confirmedIcon}>⏳</div>
      <h3 className={styles.confirmedTitle}>Reserva en revisión</h3>
      <p className={styles.confirmedText}>Tu comprobante fue enviado. El administrador lo revisará y confirmará tu reserva.</p>
    </div>
  )
}

/* ── Página Reserve ───────────────────────────────── */
function Reserve() {
  const [step, setStep] = useState(1)
  const [range, setRange] = useState({ start: null, end: null })
  const [form, setForm] = useState({})
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState('')
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFormChange(id, val) {
    setForm(f => ({ ...f, [id]: val }))
  }

  async function handleProofChange(e) {
    const file = e.target.files?.[0]
    setProofFile(file || null)
    setProofPreview(file ? await fileToBase64(file) : '')
  }

  function canNext() {
    if (loading) return false
    if (step === 1) return range.start && range.end && range.end > range.start
    if (step === 2) return form.nombre && form.email && form.telefono
    if (step === 3) return Boolean(proofFile && proofPreview)
    return true
  }

  async function submitReservation() {
    setError('')
    setLoading(true)
    try {
      const payload = {
        checkIn: toISODate(range.start),
        checkOut: toISODate(range.end),
        name: form.nombre,
        email: form.email,
        phone: form.telefono,
        guests: form.huespedes || 1,
        notes: form.solicitudes || '',
        paymentProof: {
          name: proofFile.name,
          type: proofFile.type,
          size: proofFile.size,
          data: proofPreview
        }
      }
      const { data } = await createReservation(payload)
      setReservation(data.reservation)
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo enviar la reserva. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!reservation?.id || reservation.status === 'approved' || reservation.status === 'rejected') return

    const interval = setInterval(async () => {
      try {
        const { data } = await getReservationById(reservation.id)
        setReservation(data.reservation)
      } catch {
        // Mantiene el estado actual si el servidor no responde temporalmente.
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [reservation?.id, reservation?.status])

  return (
    <div className={styles.page}>
      <Hero
        subtitle="Cabaña Boutique"
        title="Reserva tu estadía"
        description="Elige tus fechas, completa tu información y asegura tu experiencia en Camaluna."
        bgImage="/images/reserve-hero.jpg"
      />

      <section className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Reserva paso a paso</h2>

        <div className={styles.stepBar}>
          {STEPS.map(s => (
            <div
              key={s.num}
              className={[
                styles.stepItem,
                step === s.num ? styles.stepActive : '',
                step > s.num ? styles.stepCompleted : '',
              ].join(' ')}
            >
              <div className={styles.stepCircle}>{step > s.num ? '✓' : s.num}</div>
              <span className={styles.stepName}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.stepContent}>
          {step === 1 && <Step1 range={range} onRangeChange={setRange} />}
          {step === 2 && <Step2 form={form} onChange={handleFormChange} />}
          {step === 3 && (
            <Step3
              range={range}
              form={form}
              proofFile={proofFile}
              proofPreview={proofPreview}
              onProofChange={handleProofChange}
            />
          )}
          {step === 4 && <Step4 reservation={reservation} />}
          {error && <p className={styles.confirmedText}>{error}</p>}
        </div>

        {step < 4 && (
          <div className={styles.navBtns}>
            {step > 1 && (
              <button className={styles.btnBack} onClick={() => setStep(s => s - 1)} type="button">
                ← Atrás
              </button>
            )}
            <button
              className={styles.btnNext}
              onClick={() => step === 3 ? submitReservation() : setStep(s => s + 1)}
              disabled={!canNext()}
              type="button"
            >
              {loading ? 'Enviando...' : step === 3 ? 'Enviar comprobante' : 'Continuar →'}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default Reserve
