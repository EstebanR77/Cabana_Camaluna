import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero   from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { createReservation, getReservation } from '../services/api'
import styles from './Reserve.module.css'

/* ── Datos ───────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: 'Selección de estadia' },
  { num: 2, label: 'Información del alojamiento' },
  { num: 3, label: 'Resumen de la reserva' },
  { num: 4, label: 'Reserva confirmada' },
]

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

const DAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

function formatDateForApi(date) {
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/* ── Utilidades de calendario ───────────────────────── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay()
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

/* ── Selector de huéspedes tipo Airbnb ─────────────── */
const GUEST_TYPES = [
  { id: 'adultos',  label: 'Adultos',  desc: 'Edad: 13 o más',    min: 1 },
  { id: 'ninos',    label: 'Niños',    desc: 'De 2 a 12 años',    min: 0 },
  { id: 'bebes',    label: 'Bebés',    desc: 'Menos de 2 años',   min: 0 },
  { id: 'mascotas', label: 'Mascotas', desc: '¿Traes una mascota?', min: 0 },
]

function GuestSelector({ guests, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function adjust(id, delta) {
    const type = GUEST_TYPES.find(t => t.id === id)
    const next = (guests[id] || 0) + delta
    if (next < type.min) return
    // Máximo 5 huéspedes (sin contar bebés ni mascotas)
    const totalPersonas = id !== 'bebes' && id !== 'mascotas'
      ? (id === 'adultos' ? next : (guests.adultos || 1)) + (id === 'ninos' ? next : (guests.ninos || 0))
      : null
    if (totalPersonas !== null && totalPersonas > 5) return
    onChange({ ...guests, [id]: next })
  }

  function getLabel() {
    const adultos = guests.adultos || 1
    const parts = [`${adultos} adulto${adultos !== 1 ? 's' : ''}`]
    if (guests.ninos > 0) parts.push(`${guests.ninos} niño${guests.ninos !== 1 ? 's' : ''}`)
    if (guests.bebes > 0) parts.push(`${guests.bebes} bebé${guests.bebes !== 1 ? 's' : ''}`)
    if (guests.mascotas > 0) parts.push(`${guests.mascotas} mascota${guests.mascotas !== 1 ? 's' : ''}`)
    return parts.join(', ')
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: open ? '1px solid var(--color-green)' : '1px solid rgba(0,0,0,0.18)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.7rem 1rem',
          background: 'var(--color-text-light)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: '0.93rem',
          color: 'var(--color-text-main)',
          transition: 'border-color var(--transition)',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'rgba(0,0,0,0.6)', marginBottom: 2 }}>
            Huéspedes
          </div>
          <div>{getLabel()}</div>
        </div>
        <span style={{ fontSize: 13, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'rgba(0,0,0,0.45)' }}>
          &#8964;
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          width: '100%',
          background: 'var(--color-text-light)',
          border: '1px solid rgba(0,0,0,0.18)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-card)',
          zIndex: 100,
          padding: '0.25rem 1rem 0.75rem',
        }}>
          {GUEST_TYPES.map((type, i) => (
            <div key={type.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 0',
              borderBottom: i < GUEST_TYPES.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{type.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.55)' }}>{type.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <button
                  type="button"
                  onClick={() => adjust(type.id, -1)}
                  disabled={(guests[type.id] || 0) <= type.min}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.2)',
                    background: 'var(--color-page-bg)', cursor: 'pointer',
                    fontSize: 16, lineHeight: 1,
                    color: (guests[type.id] || 0) <= type.min ? 'rgba(0,0,0,0.2)' : 'var(--color-text-main)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-body)',
                  }}
                >−</button>
                <span style={{ minWidth: 20, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                  {guests[type.id] || 0}
                </span>
                <button
                  type="button"
                  onClick={() => adjust(type.id, 1)}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.2)',
                    background: 'var(--color-page-bg)', cursor: 'pointer',
                    fontSize: 16, lineHeight: 1,
                    color: 'var(--color-text-main)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-body)',
                  }}
                >+</button>
              </div>
            </div>
          ))}

          <p style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.55)', margin: '0.6rem 0 0.2rem', lineHeight: 1.4 }}>
            Este alojamiento tiene una capacidad máxima de 5 huéspedes, sin incluir bebés.
            Si vienes con más de 2 mascotas, avísale al anfitrión.
          </p>

          <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.88rem',
                color: 'var(--color-text-main)',
                textDecoration: 'underline',
              }}
            >Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Step 1: Fechas + Huéspedes ───────────────────── */
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

/* ── Step 2: Info — formularios por huésped ─────── */
function Step2({ form, onChange, guests, onGuestsChange }) {
  return (
    <div className={styles.step}>
      <p className={styles.stepLabel}>Paso 2 — Información del alojamiento</p>

      <div className={styles.formGrid}>
        {[
          { id: 'nombre',   label: 'Nombre completo', type: 'text'  },
          { id: 'email',    label: 'Correo electrónico', type: 'email' },
          { id: 'telefono', label: 'Teléfono',         type: 'tel'   },
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

        <div className={styles.field}>
          <label className={styles.label}>Huéspedes</label>
          <GuestSelector guests={guests} onChange={onGuestsChange} />
        </div>

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

/* ── Step 3: Resumen + comprobante ─────────────────── */
function Step3({ range, form, guests, paymentFile, onPaymentFile }) {
  const nights = range.start && range.end
    ? Math.round((range.end - range.start) / 86400000)
    : 0
  const pricePerNight = 350000
  const total = nights * pricePerNight
  const totalPersonas = (guests.adultos || 1) + (guests.ninos || 0)

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
          <p className={styles.summaryVal}>
            {totalPersonas} persona{totalPersonas !== 1 ? 's' : ''}
            {guests.bebes > 0 ? `, ${guests.bebes} bebé${guests.bebes !== 1 ? 's' : ''}` : ''}
            {guests.mascotas > 0 ? `, ${guests.mascotas} mascota${guests.mascotas !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryTotal}`}>
          <p className={styles.summaryKey}>Total estimado</p>
          <p className={styles.summaryVal}>
            ${total.toLocaleString('es-CO')} COP
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <p className={styles.summaryKey} style={{ marginBottom: '0.5rem', fontWeight: 700 }}>
          Política de anticipo
        </p>
        <p className={styles.summaryKey}>
          Se requiere el <b>50% de anticipo</b> (${(total / 2).toLocaleString('es-CO')} COP) por transferencia bancaria para confirmar la reserva.
        </p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <p className={styles.summaryKey} style={{ marginBottom: '0.5rem', fontWeight: 700 }}>
          Medios de pago
        </p>
        <p className={styles.summaryKey}>
          Nequi / Daviplata: <b>310 777 7579</b><br />
          Bancolombia — Cuenta de ahorros: <b>123-456789-00</b>
        </p>
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`} style={{ marginTop: '1.5rem' }}>
        <label className={styles.label}>Comprobante de pago</label>
        <input
          className={styles.input}
          type="file"
          accept="image/*,.pdf"
          onChange={e => onPaymentFile(e.target.files?.[0] || null)}
        />
        <p className={styles.summaryKey}>
          {paymentFile ? `Archivo seleccionado: ${paymentFile.name}` : 'Sube el comprobante para que el administrador pueda revisarlo.'}
        </p>
      </div>
    </div>
  )
}

/* ── Estados finales ──────────────────────────────── */
function WaitingReview({ reservation, onRefresh }) {
  return (
    <div className={`${styles.step} ${styles.stepConfirmed}`}>
      <div className={styles.confirmedIcon}>⏳</div>
      <h3 className={styles.confirmedTitle}>Comprobante enviado</h3>
      <p className={styles.confirmedText}>
        Tu reserva quedó en revisión. El administrador debe aceptar el comprobante antes de confirmar la estadía.
      </p>
      <button className={styles.confirmedBtn} type="button" onClick={onRefresh}>
        Consultar estado
      </button>
      {reservation?.id && <p className={styles.summaryKey}>Código de solicitud: {reservation.id}</p>}
    </div>
  )
}

function RejectedReservation() {
  return (
    <div className={`${styles.step} ${styles.stepConfirmed}`}>
      <div className={styles.confirmedIcon}>⚠️</div>
      <h3 className={styles.confirmedTitle}>Comprobante rechazado</h3>
      <p className={styles.confirmedText}>
        El administrador rechazó el comprobante. Comunícate con Camaluna para revisar el pago o realizar una nueva solicitud.
      </p>
      <Link to="/contact" className={styles.confirmedBtn}>Contactar</Link>
    </div>
  )
}

function Step4({ reservation }) {
  return (
    <div className={`${styles.step} ${styles.stepConfirmed}`}>
      <div className={styles.confirmedIcon}>📅</div>
      <h3 className={styles.confirmedTitle}>¡Reserva Confirmada!</h3>
      <p className={styles.confirmedText}>
        Tu comprobante fue aprobado. Pronto nos pondremos en contacto contigo.
      </p>
      {reservation?.accessCode && (
        <p className={styles.confirmedText}>
          Código de entrada: <b>{reservation.accessCode}</b>
        </p>
      )}
      <Link to="/" className={styles.confirmedBtn}>Volver al inicio</Link>
    </div>
  )
}

/* ── Página Reserve ───────────────────────────────── */
function Reserve() {
  const [step, setStep]   = useState(1)
  const [range, setRange] = useState({ start: null, end: null })
  const [guests, setGuests] = useState({ adultos: 1, ninos: 0, bebes: 0, mascotas: 0 })
  const [form, setForm]   = useState({})
  const [paymentFile, setPaymentFile] = useState(null)
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFormChange(id, val) {
    setForm(f => ({ ...f, [id]: val }))
  }

  function canNext() {
    if (step === 1) return range.start && range.end
    if (step === 2) return form.nombre && form.email && form.telefono
    if (step === 3) return Boolean(paymentFile) && !loading
    return true
  }

  async function refreshReservation() {
    if (!reservation?.id) return
    try {
      const { data } = await getReservation(reservation.id)
      setReservation(data.reservation)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo consultar el estado de la reserva.')
    }
  }

  async function submitReservation() {
    setError('')
    setLoading(true)
    try {
      const paymentDataUrl = await fileToDataUrl(paymentFile)
      const totalPersonas = (guests.adultos || 1) + (guests.ninos || 0)

      const payload = {
        checkIn:  formatDateForApi(range.start),
        checkOut: formatDateForApi(range.end),
        name:     form.nombre,
        email:    form.email,
        phone:    form.telefono,
        guests:   totalPersonas,
        guestDetails: guests,
        notes:    form.solicitudes || '',
        paymentProof: {
          fileName: paymentFile.name,
          fileType: paymentFile.type,
          dataUrl:  paymentDataUrl,
        },
      }

      const { data } = await createReservation(payload)
      setReservation(data.reservation)
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo enviar la reserva.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!reservation?.id || reservation.status !== 'pending_review') return
    const interval = setInterval(refreshReservation, 5000)
    return () => clearInterval(interval)
  }, [reservation?.id, reservation?.status])

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

        {error && <p className={styles.confirmedText}>{error}</p>}

        {/* Contenido del paso */}
        <div className={styles.stepContent}>
          {step === 1 && (
            <Step1
              range={range}
              onRangeChange={setRange}
            />
          )}
          {step === 2 && (
            <Step2
              form={form}
              onChange={handleFormChange}
              guests={guests}
              onGuestsChange={setGuests}
            />
          )}
          {step === 3 && (
            <Step3
              range={range}
              form={form}
              guests={guests}
              paymentFile={paymentFile}
              onPaymentFile={setPaymentFile}
            />
          )}
          {step === 4 && reservation?.status === 'pending_review' && (
            <WaitingReview reservation={reservation} onRefresh={refreshReservation} />
          )}
          {step === 4 && reservation?.status === 'rejected' && <RejectedReservation />}
          {step === 4 && reservation?.status === 'approved' && <Step4 reservation={reservation} />}
          {step === 4 && !reservation && <Step4 />}
        </div>

        {/* Botones de navegación */}
        {step < 4 && (
          <div className={styles.navBtns}>
            {step > 1 && (
              <button className={styles.btnBack} type="button" onClick={() => setStep(s => s - 1)}>
                ← Atrás
              </button>
            )}
            <button
              className={styles.btnNext}
              type="button"
              onClick={step === 3 ? submitReservation : () => setStep(s => s + 1)}
              disabled={!canNext()}
            >
              {loading ? 'Enviando...' : step === 3 ? 'Enviar comprobante' : 'Continuar →'}
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
