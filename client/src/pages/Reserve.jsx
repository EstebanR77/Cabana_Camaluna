import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { createReservation, getReservation } from '../services/api'
import { useCalendar } from '../hooks/useCalendar'
import {
  buildBlockedDateSet,
  isDateBlocked,
  rangeOverlapsBlocked,
} from '../utils/reservationCalendar'
import { calculateStayPrice, formatCop } from '../utils/reservationPricing'
import { useReservationStatus } from '../context/ReservationStatusContext'
import {
  filterAge,
  filterDocumentNumber,
  filterDocumentType,
  filterEmail,
  filterNotes,
  filterPersonName,
  filterPhone,
  validatePaymentFile,
  validateSingleField,
  validateStep1,
  validateStep2,
  VALID_DOCUMENT_TYPES,
} from '../utils/inputValidation'
import styles from './Reserve.module.css'

const STEPS = [
  { num: 1, label: 'Selección de estadia' },
  { num: 2, label: 'Información del alojamiento' },
  { num: 3, label: 'Realiza tu pago' },
  { num: 4, label: 'Reserva confirmada' },
]

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const GUEST_TYPES = [
  { id: 'adultos', label: 'Adultos', desc: 'Edad: 13 o más', min: 1 },
  { id: 'ninos', label: 'Niños', desc: 'De 2 a 12 años', min: 0 },
  { id: 'bebes', label: 'Bebés', desc: 'Menos de 2 años', min: 0 },
  { id: 'mascotas', label: 'Mascotas', desc: '¿Traes una mascota?', min: 0 },
]

const DOCUMENT_TYPES = VALID_DOCUMENT_TYPES

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

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay()
}

function buildGuestKeys(guests) {
  const keys = []
  for (let i = 0; i < (guests.adultos || 1); i += 1) {
    keys.push(`adulto-${i}`)
  }
  for (let i = 0; i < (guests.ninos || 0); i += 1) {
    keys.push(`nino-${i}`)
  }
  return keys
}

function buildGuestLabel(key) {
  if (key.startsWith('adulto-')) {
    return `Huésped adulto ${Number(key.split('-')[1]) + 1}`
  }
  return `Huésped niño ${Number(key.split('-')[1]) + 1}`
}

function emptyGuestProfile() {
  return {
    nombreCompleto: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    edad: '',
  }
}

function MaterialIcon({ name, className = '' }) {
  return (
    <span className={`${styles.materialIcon} ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}

function FieldError({ error, id }) {
  if (!error) return null
  return (
    <p className={styles.fieldError} id={id} role="alert">
      {error}
    </p>
  )
}

function fieldClass(baseClass, error) {
  return error ? `${baseClass} ${styles.inputInvalid}` : baseClass
}

function CopyCodeButton({ code, label = 'Copiar código' }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return undefined
    const timer = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    if (!code) return

    try {
      await navigator.clipboard.writeText(String(code))
      setCopied(true)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = String(code)
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
    }
  }

  return (
    <button
      type="button"
      className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
      onClick={handleCopy}
    >
      {copied ? '¡Copiado!' : label}
    </button>
  )
}

function UploadProofButton({ file, onFileChange, fileError }) {
  const inputRef = useRef(null)

  function handleFileSelect(selected) {
    if (!selected) {
      onFileChange(null, '')
      return
    }
    const validationError = validatePaymentFile(selected)
    if (validationError) {
      onFileChange(null, validationError)
      return
    }
    onFileChange(selected, '')
  }

  return (
    <div className={styles.uploadZone}>
      <input
        ref={inputRef}
        id="payment-proof-input"
        className={styles.uploadInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        onChange={event => handleFileSelect(event.target.files?.[0] || null)}
      />
      <button
        type="button"
        className={`${styles.uploadBtn} ${file ? styles.uploadBtnHasFile : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        <MaterialIcon name={file ? 'check_circle' : 'upload'} />
        {' '}
        {file ? 'Cambiar comprobante' : 'Subir comprobante'}
      </button>
      {file && (
        <p className={styles.uploadFileName} title={file.name}>
          {file.name}
        </p>
      )}
      {fileError && <p className={styles.rangeWarning}>{fileError}</p>}
    </div>
  )
}

function MiniCalendar({ year, month, onSelect, range, blockedSet }) {
  const days = getDaysInMonth(year, month)
  const first = getFirstDay(year, month)

  return (
    <div className={styles.calendar}>
      <p className={styles.calMonth}>{MONTHS[month]} {year}</p>
      <div className={styles.calGrid}>
        {DAYS.map(day => (
          <span key={day} className={styles.calDayName}>{day}</span>
        ))}
        {Array.from({ length: first }).map((_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1
          const date = new Date(year, month, day)
          const blocked = isDateBlocked(date, blockedSet)
          const isStart = range.start && date.toDateString() === range.start.toDateString()
          const isEnd = range.end && date.toDateString() === range.end.toDateString()
          const inRange = range.start && range.end && date > range.start && date < range.end

          return (
            <button
              key={day}
              type="button"
              disabled={blocked}
              className={[
                styles.calDay,
                blocked ? styles.calBlocked : '',
                isStart ? styles.calStart : '',
                isEnd ? styles.calEnd : '',
                inRange ? styles.calRange : '',
              ].filter(Boolean).join(' ')}
              onClick={() => !blocked && onSelect(date)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function GuestSelector({ guests, onChange }) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, width: 280 })
  const ref = useRef(null)
  const menuRef = useRef(null)

  const updateMenuPosition = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMenuStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 280),
    })
  }, [])

  useEffect(() => {
    if (!open) return undefined
    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [open, updateMenuPosition])

  useEffect(() => {
    if (!open) return undefined

    function handleClick(event) {
      const target = event.target
      if (
        ref.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function adjust(id, delta) {
    const type = GUEST_TYPES.find(item => item.id === id)
    const next = (guests[id] || 0) + delta
    if (next < type.min) return

    const totalPersonas = id !== 'bebes' && id !== 'mascotas'
      ? (id === 'adultos' ? next : (guests.adultos || 1)) +
        (id === 'ninos' ? next : (guests.ninos || 0))
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

  const dropdownMenu = open ? (
    <div
      ref={menuRef}
      className={styles.guestDropdownPortal}
      style={{
        top: menuStyle.top,
        left: menuStyle.left,
        width: menuStyle.width,
      }}
      role="listbox"
    >
      {GUEST_TYPES.map(type => (
        <div key={type.id} className={styles.guestRow}>
          <div>
            <div className={styles.guestRowTitle}>{type.label}</div>
            <div className={styles.guestRowDesc}>{type.desc}</div>
          </div>
          <div className={styles.guestCounter}>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => adjust(type.id, -1)}
              disabled={(guests[type.id] || 0) <= type.min}
            >
              −
            </button>
            <span>{guests[type.id] || 0}</span>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => adjust(type.id, 1)}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <p className={styles.guestNote}>
        Capacidad máxima de 5 huéspedes, sin incluir bebés. Si traes más de 2 mascotas, avísale al anfitrión.
      </p>
      <button type="button" className={styles.guestCloseBtn} onClick={() => setOpen(false)}>
        Cerrar
      </button>
    </div>
  ) : null

  return (
    <div
      ref={ref}
      className={`${styles.guestSelectorWrap} ${open ? styles.guestSelectorWrapOpen : ''}`}
    >
      <button
        type="button"
        className={`${styles.guestTrigger} ${open ? styles.guestTriggerOpen : ''}`}
        onClick={() => {
          setOpen(value => {
            const next = !value
            if (next) updateMenuPosition()
            return next
          })
        }}
        aria-expanded={open}
      >
        <span>{getLabel()}</span>
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>

      {dropdownMenu && createPortal(dropdownMenu, document.body)}
    </div>
  )
}

function Step1({
  stepLabelRef,
  range,
  onRangeChange,
  titular,
  onTitularFieldChange,
  onTitularBlur,
  guests,
  onGuestsChange,
  blockedSet,
  pricing,
  rangeError,
  fieldErrors,
}) {
  const today = new Date()
  const [year] = useState(today.getFullYear())
  const [month1] = useState(today.getMonth())
  const month2 = (month1 + 1) % 12
  const year2 = month1 === 11 ? year + 1 : year

  function handleSelect(date) {
    if (!range.start || (range.start && range.end)) {
      onRangeChange({ start: date, end: null })
      return
    }

    const nextRange = date < range.start
      ? { start: date, end: range.start }
      : { start: range.start, end: date }

    if (rangeOverlapsBlocked(nextRange.start, nextRange.end, blockedSet)) {
      onRangeChange({ start: date, end: null })
      return
    }

    onRangeChange(nextRange)
  }

  return (
    <div className={styles.step}>
      <p ref={stepLabelRef} className={styles.stepLabel} tabIndex={-1}>
        Paso 1 — Selección de estadía
      </p>

      <FieldError error={fieldErrors.fechas} id="error-fechas" />

      <div className={styles.calendars}>
        <MiniCalendar
          year={year}
          month={month1}
          range={range}
          onSelect={handleSelect}
          blockedSet={blockedSet}
        />
        <MiniCalendar
          year={year2}
          month={month2}
          range={range}
          onSelect={handleSelect}
          blockedSet={blockedSet}
        />
      </div>

      {rangeError && <p className={styles.rangeWarning}>{rangeError}</p>}

      {range.start && range.end && !rangeError && (
        <div className={styles.rangeInfo}>
          <span>Check-in: <b>{range.start.toLocaleDateString('es-CO')}</b></span>
          <span>Check-out: <b>{range.end.toLocaleDateString('es-CO')}</b></span>
        </div>
      )}

      <section className={styles.titularSection} aria-label="Datos del titular">
        <h3 className={styles.titularTitle}>Titular</h3>

        <div className={styles.titularRow}>
          <div className={styles.field}>
            <input
              className={fieldClass(styles.input, fieldErrors['titular.nombres'])}
              type="text"
              value={titular.nombres}
              onChange={event => onTitularFieldChange('nombres', event.target.value)}
              onBlur={() => onTitularBlur('titular.nombres')}
              placeholder="Nombres"
              autoComplete="given-name"
              maxLength={50}
              aria-invalid={Boolean(fieldErrors['titular.nombres'])}
              aria-describedby={fieldErrors['titular.nombres'] ? 'error-titular-nombres' : undefined}
            />
            <FieldError error={fieldErrors['titular.nombres']} id="error-titular-nombres" />
          </div>
          <div className={styles.field}>
            <input
              className={fieldClass(styles.input, fieldErrors['titular.apellidos'])}
              type="text"
              value={titular.apellidos}
              onChange={event => onTitularFieldChange('apellidos', event.target.value)}
              onBlur={() => onTitularBlur('titular.apellidos')}
              placeholder="Apellidos"
              autoComplete="family-name"
              maxLength={50}
              aria-invalid={Boolean(fieldErrors['titular.apellidos'])}
              aria-describedby={fieldErrors['titular.apellidos'] ? 'error-titular-apellidos' : undefined}
            />
            <FieldError error={fieldErrors['titular.apellidos']} id="error-titular-apellidos" />
          </div>
        </div>

        <div className={styles.splitField}>
          <span className={styles.splitFieldLabel}>Huéspedes</span>
          <div className={styles.splitFieldControl}>
            <GuestSelector guests={guests} onChange={onGuestsChange} />
          </div>
        </div>

        <div className={styles.priceField}>
          <span className={styles.splitFieldLabel}>Precios por temporada</span>
          <div>
            <p className={styles.priceValue}>
              {pricing.nights > 0 ? formatCop(pricing.total) : 'Selecciona fechas'}
            </p>
            {pricing.nights > 0 && (
              <p className={styles.priceHint}>
                {pricing.nights} noche{pricing.nights !== 1 ? 's' : ''} · {pricing.seasonLabel}
                {' · '}Promedio {formatCop(pricing.avgPerNight)}/noche
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function Step2({
  stepLabelRef,
  form,
  onChange,
  onBlur,
  guests,
  guestProfiles,
  onGuestProfileChange,
  fieldErrors,
}) {
  const guestKeys = buildGuestKeys(guests)

  return (
    <div className={styles.step}>
      <p ref={stepLabelRef} className={styles.stepLabel} tabIndex={-1}>
        Paso 2 — Información del alojamiento
      </p>

      <div className={styles.formGrid}>
        {[
          { id: 'email', label: 'Correo electrónico', type: 'email' },
          { id: 'telefono', label: 'Teléfono', type: 'tel' },
        ].map(({ id, label, type }) => (
          <div key={id} className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
              className={fieldClass(styles.input, fieldErrors[id])}
              type={type}
              value={form[id] || ''}
              onChange={event => onChange(id, event.target.value)}
              onBlur={() => onBlur(id)}
              placeholder={label}
              maxLength={id === 'email' ? 120 : 20}
              aria-invalid={Boolean(fieldErrors[id])}
              aria-describedby={fieldErrors[id] ? `error-${id}` : undefined}
            />
            <FieldError error={fieldErrors[id]} id={`error-${id}`} />
          </div>
        ))}

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label}>Solicitudes especiales</label>
          <textarea
            className={fieldClass(styles.textarea, fieldErrors.solicitudes)}
            rows={3}
            value={form.solicitudes || ''}
            onChange={event => onChange('solicitudes', event.target.value)}
            onBlur={() => onBlur('solicitudes')}
            placeholder="¿Alguna solicitud especial?"
            maxLength={500}
            aria-invalid={Boolean(fieldErrors.solicitudes)}
            aria-describedby={fieldErrors.solicitudes ? 'error-solicitudes' : undefined}
          />
          <FieldError error={fieldErrors.solicitudes} id="error-solicitudes" />
        </div>
      </div>

      {guestKeys.map(key => {
        const profile = guestProfiles[key] || emptyGuestProfile()
        return (
          <div key={key} className={styles.guestFormBlock}>
            <h4 className={styles.guestFormTitle}>{buildGuestLabel(key)}</h4>
            <div className={styles.guestFormGrid}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Nombre completo</label>
                <input
                  className={fieldClass(styles.input, fieldErrors[`${key}.nombreCompleto`])}
                  type="text"
                  value={profile.nombreCompleto}
                  onChange={event => onGuestProfileChange(key, 'nombreCompleto', event.target.value)}
                  onBlur={() => onBlur(`${key}.nombreCompleto`)}
                  placeholder="Nombre completo"
                  maxLength={80}
                  aria-invalid={Boolean(fieldErrors[`${key}.nombreCompleto`])}
                />
                <FieldError
                  error={fieldErrors[`${key}.nombreCompleto`]}
                  id={`error-${key}-nombre`}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Tipo de documento</label>
                <select
                  className={fieldClass(styles.select, fieldErrors[`${key}.tipoDocumento`])}
                  value={profile.tipoDocumento}
                  onChange={event => onGuestProfileChange(key, 'tipoDocumento', event.target.value)}
                  onBlur={() => onBlur(`${key}.tipoDocumento`)}
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <FieldError
                  error={fieldErrors[`${key}.tipoDocumento`]}
                  id={`error-${key}-tipo`}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Número de documento</label>
                <input
                  className={fieldClass(styles.input, fieldErrors[`${key}.numeroDocumento`])}
                  type="text"
                  value={profile.numeroDocumento}
                  onChange={event => onGuestProfileChange(key, 'numeroDocumento', event.target.value)}
                  onBlur={() => onBlur(`${key}.numeroDocumento`)}
                  placeholder="Número de documento"
                  maxLength={16}
                  aria-invalid={Boolean(fieldErrors[`${key}.numeroDocumento`])}
                />
                <FieldError
                  error={fieldErrors[`${key}.numeroDocumento`]}
                  id={`error-${key}-documento`}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Edad</label>
                <input
                  className={fieldClass(styles.input, fieldErrors[`${key}.edad`])}
                  type="text"
                  inputMode="numeric"
                  value={profile.edad}
                  onChange={event => onGuestProfileChange(key, 'edad', event.target.value)}
                  onBlur={() => onBlur(`${key}.edad`)}
                  placeholder={key.startsWith('nino-') ? '2 a 12 años' : '13 años o más'}
                  maxLength={3}
                  aria-invalid={Boolean(fieldErrors[`${key}.edad`])}
                />
                <FieldError error={fieldErrors[`${key}.edad`]} id={`error-${key}-edad`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Step3({
  stepLabelRef,
  range,
  titular,
  guests,
  pricing,
  paymentFile,
  paymentFileError,
  onPaymentFile,
}) {
  const totalPersonas = (guests.adultos || 1) + (guests.ninos || 0)
  const titularName = `${titular.nombres} ${titular.apellidos}`.trim()
  const deposit = Math.round(pricing.total / 2)

  return (
    <div className={`${styles.step} ${styles.paymentStep}`}>
      <p ref={stepLabelRef} className={styles.stepLabel} tabIndex={-1}>
        Paso 3 — Realiza tu pago
      </p>
      <header className={styles.paymentHeader}>
        <h3 className={styles.paymentTitle}>Realiza tu pago</h3>
        <p className={styles.paymentSubtitle}>
          Realiza el pago correspondiente para asegurar tu reserva.
        </p>
      </header>

      <div className={styles.summaryCompact}>
        <div className={styles.summaryChip}>
          <p className={styles.summaryKey}>Titular</p>
          <p className={styles.summaryVal}>{titularName || '—'}</p>
        </div>
        <div className={styles.summaryChip}>
          <p className={styles.summaryKey}>Huéspedes</p>
          <p className={styles.summaryVal}>{totalPersonas}</p>
        </div>
        <div className={styles.summaryChip}>
          <p className={styles.summaryKey}>Check-in</p>
          <p className={styles.summaryVal}>{range.start?.toLocaleDateString('es-CO') || '—'}</p>
        </div>
        <div className={styles.summaryChip}>
          <p className={styles.summaryKey}>Check-out</p>
          <p className={styles.summaryVal}>{range.end?.toLocaleDateString('es-CO') || '—'}</p>
        </div>
        <div className={`${styles.summaryChip} ${styles.summaryChipTotal}`}>
          <p className={styles.summaryKey}>Total · {pricing.nights} noche{pricing.nights !== 1 ? 's' : ''}</p>
          <p className={styles.summaryVal}>{formatCop(pricing.total)}</p>
        </div>
      </div>

      <div className={styles.infoCardStack}>
        <article className={styles.infoCard}>
          <h4 className={styles.infoCardTitle}>Política de anticipo</h4>
          <p className={styles.infoCardText}>
            La reserva se confirma una vez validado el pago.
            <span className={styles.infoCardHighlight}>
              Anticipo del 50%: {formatCop(deposit)}
            </span>
          </p>
        </article>

        <article className={styles.infoCard}>
          <h4 className={styles.infoCardTitle}>Medios de pago</h4>
          <p className={styles.infoCardText}>
            Transferencia, Nequi y pagos digitales disponibles.
          </p>
          <ul className={styles.paymentMethodsList}>
            <li>Nequi / Daviplata: <strong>310 777 7579</strong></li>
            <li>Bancolombia — Ahorros: <strong>123-456789-00</strong></li>
          </ul>
        </article>

        <article className={styles.infoCard}>
          <h4 className={styles.infoCardTitle}>Comprobante de pago</h4>
          <p className={styles.infoCardText}>
            Adjunta el soporte de pago para continuar.
          </p>
          <UploadProofButton
            file={paymentFile}
            fileError={paymentFileError}
            onFileChange={onPaymentFile}
          />
        </article>
      </div>
    </div>
  )
}

function WaitingReview({ reservation, titularName, onOpenStatusModal, isPolling }) {
  return (
    <div className={styles.statusFlow}>
      <div className={`${styles.statusIconWrap} ${styles.statusIconWrapPulse}`}>
        <MaterialIcon name="hourglass_top" />
      </div>

      <h3 className={styles.statusTitle}>Comprobante enviado</h3>
      <p className={styles.statusSubtitle}>
        Tu reserva quedó en revisión. Guarda tu código de solicitud y consulta el estado cuando quieras.
        {isPolling ? ' Estamos verificando el estado automáticamente.' : ''}
      </p>

      {reservation?.id && (
        <div className={styles.codeCard}>
          <p className={styles.codeLabel}>Código de solicitud</p>
          <p className={styles.codeValue}>{reservation.id}</p>
          <CopyCodeButton code={reservation.id} label="Copiar código de reserva" />
        </div>
      )}

      <button
        type="button"
        className={styles.actionBtn}
        onClick={() => onOpenStatusModal({
          holderName: titularName,
          requestCode: reservation?.id || '',
        })}
      >
        <MaterialIcon name="search" />
        {' '}Consultar estado de la reserva
      </button>
    </div>
  )
}

function RejectedReservation() {
  return (
    <div className={styles.statusFlow}>
      <div className={styles.statusIconWrap}>
        <MaterialIcon name="cancel" />
      </div>

      <h3 className={styles.statusTitle}>Comprobante rechazado</h3>
      <p className={styles.statusSubtitle}>
        El administrador no pudo validar el pago. Escríbenos para revisar tu caso o intenta una nueva reserva.
      </p>

      <Link to="/contact" className={styles.actionBtn}>
        Contactar a Camaluna
      </Link>
    </div>
  )
}

function Step4({ reservation }) {
  return (
    <div className={styles.statusFlow}>
      <div className={`${styles.statusIconWrap} ${styles.statusIconWrapSuccess}`}>
        <MaterialIcon name="check_circle" />
      </div>

      <h3 className={styles.statusTitle}>¡Reserva confirmada!</h3>
      <p className={styles.statusSubtitle}>
        Tu comprobante fue aprobado. Te esperamos en Camaluna para una estadía inolvidable.
      </p>

      {reservation?.accessCode && (
        <div className={styles.codeCard}>
          <p className={styles.codeLabel}>Código de entrada</p>
          <p className={styles.codeValue}>{reservation.accessCode}</p>
          <CopyCodeButton code={reservation.accessCode} label="Copiar código de entrada" />
        </div>
      )}

      <Link to="/" className={styles.actionBtn}>
        Volver al inicio
      </Link>
    </div>
  )
}

function Reserve() {
  const { openStatusModal } = useReservationStatus()
  const { reservedDates } = useCalendar()
  const blockedSet = useMemo(
    () => buildBlockedDateSet(reservedDates),
    [reservedDates]
  )

  const [step, setStep] = useState(1)
  const [range, setRange] = useState({ start: null, end: null })
  const [rangeError, setRangeError] = useState('')
  const [titular, setTitular] = useState({ nombres: '', apellidos: '' })
  const [guests, setGuests] = useState({ adultos: 1, ninos: 0, bebes: 0, mascotas: 0 })
  const [guestProfiles, setGuestProfiles] = useState({})
  const [form, setForm] = useState({})
  const [paymentFile, setPaymentFile] = useState(null)
  const [paymentFileError, setPaymentFileError] = useState('')
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [stepAnimKey, setStepAnimKey] = useState(0)
  const [isPollingStatus, setIsPollingStatus] = useState(false)
  const stepTitleRef = useRef(null)

  const pricing = useMemo(
    () => calculateStayPrice(range.start, range.end),
    [range.start, range.end]
  )

  useEffect(() => {
    const keys = buildGuestKeys(guests)
    setGuestProfiles(previous => {
      const next = {}
      keys.forEach(key => {
        next[key] = previous[key] || emptyGuestProfile()
      })
      return next
    })
  }, [guests.adultos, guests.ninos])

  useEffect(() => {
    if (!range.start || !range.end) {
      setRangeError('')
      return
    }
    if (rangeOverlapsBlocked(range.start, range.end, blockedSet)) {
      setRangeError('Las fechas seleccionadas incluyen días ya reservados. Elige otro rango.')
      setRange({ start: range.start, end: null })
      return
    }
    setRangeError('')
  }, [range.start, range.end, blockedSet])

  function scrollToStepTitle() {
    window.requestAnimationFrame(() => {
      if (!stepTitleRef.current) return
      const navbarOffset = 110
      const top = stepTitleRef.current.getBoundingClientRect().top + window.scrollY - navbarOffset
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      stepTitleRef.current.focus({ preventScroll: true })
    })
  }

  function getFieldValue(fieldKey) {
    if (fieldKey === 'titular.nombres') return titular.nombres
    if (fieldKey === 'titular.apellidos') return titular.apellidos
    if (fieldKey === 'email') return form.email
    if (fieldKey === 'telefono') return form.telefono
    if (fieldKey === 'solicitudes') return form.solicitudes
    if (fieldKey.includes('.')) {
      const dotIndex = fieldKey.indexOf('.')
      const guestKey = fieldKey.slice(0, dotIndex)
      const field = fieldKey.slice(dotIndex + 1)
      return guestProfiles[guestKey]?.[field] ?? ''
    }
    return ''
  }

  function setFieldError(fieldKey, message) {
    setFieldErrors(previous => {
      const next = { ...previous }
      if (message) next[fieldKey] = message
      else delete next[fieldKey]
      return next
    })
  }

  function validateField(fieldKey) {
    const message = validateSingleField(fieldKey, getFieldValue(fieldKey))
    setFieldError(fieldKey, message)
    return !message
  }

  function collectStepErrors(currentStep) {
    if (currentStep === 1) {
      return validateStep1({ range, rangeError, titular, pricing })
    }
    if (currentStep === 2) {
      return validateStep2({ form, guests, guestProfiles })
    }
    if (currentStep === 3) {
      const errors = {}
      const fileError = validatePaymentFile(paymentFile)
      if (fileError) errors.comprobante = fileError
      return errors
    }
    return {}
  }

  function handleFormChange(id, value) {
    let sanitized = value
    if (id === 'email') sanitized = filterEmail(value)
    if (id === 'telefono') sanitized = filterPhone(value)
    if (id === 'solicitudes') sanitized = filterNotes(value)

    setForm(previous => ({ ...previous, [id]: sanitized }))

    if (fieldErrors[id]) {
      const message = validateSingleField(id, sanitized)
      setFieldError(id, message)
    }
  }

  function handleFieldBlur(fieldKey) {
    validateField(fieldKey)
  }

  function handleTitularFieldChange(field, value) {
    const sanitized = filterPersonName(value)
    const next = {
      ...titular,
      [field]: sanitized,
    }
    setTitular(next)
    if (fieldErrors[`titular.${field}`]) {
      validateField(`titular.${field}`)
    }
  }

  function handleGuestProfileChange(key, field, value) {
    let sanitized = value
    if (field === 'nombreCompleto') sanitized = filterPersonName(value, 80)
    if (field === 'numeroDocumento') sanitized = filterDocumentNumber(value)
    if (field === 'edad') sanitized = filterAge(value)
    if (field === 'tipoDocumento') sanitized = filterDocumentType(value)

    setGuestProfiles(previous => ({
      ...previous,
      [key]: {
        ...(previous[key] || emptyGuestProfile()),
        [field]: sanitized,
      },
    }))

    const fieldKey = `${key}.${field}`
    if (fieldErrors[fieldKey]) {
      validateField(fieldKey)
    }
  }

  function handleNextStep() {
    setSubmitError('')

    if (step === 3) {
      const errors = collectStepErrors(3)
      setFieldErrors(errors)
      if (errors.comprobante) {
        setPaymentFileError(errors.comprobante)
        scrollToStepTitle()
        return
      }
      submitReservation()
      return
    }

    const errors = collectStepErrors(step)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      scrollToStepTitle()
      return
    }

    setFieldErrors({})
    setStep(current => current + 1)
  }

  function handleBackStep() {
    setFieldErrors({})
    setSubmitError('')
    setStep(current => current - 1)
  }

  function canProceed() {
    if (step === 3) return !loading
    return true
  }

  async function refreshReservation() {
    if (!reservation?.id) return
    try {
      const { data } = await getReservation(reservation.id)
      setReservation(data.reservation)
    } catch {
      /* La consulta en segundo plano no debe mostrar error en la tarjeta superior */
    }
  }

  async function submitReservation() {
    setSubmitError('')
    setLoading(true)

    const fileValidation = validatePaymentFile(paymentFile)
    if (fileValidation) {
      setPaymentFileError(fileValidation)
      setLoading(false)
      return
    }

    try {
      const paymentDataUrl = await fileToDataUrl(paymentFile)
      const totalPersonas = (guests.adultos || 1) + (guests.ninos || 0)
      const guestKeys = buildGuestKeys(guests)
      const guestRoster = guestKeys.map(key => ({
        key,
        label: buildGuestLabel(key),
        ...guestProfiles[key],
      }))

      const safeFileName = paymentFile.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)

      const payload = {
        checkIn: formatDateForApi(range.start),
        checkOut: formatDateForApi(range.end),
        name: `${filterPersonName(titular.nombres)} ${filterPersonName(titular.apellidos)}`.trim(),
        email: filterEmail(form.email).trim(),
        phone: filterPhone(form.telefono).trim(),
        guests: totalPersonas,
        guestDetails: guests,
        guestRoster: guestRoster.map(entry => ({
          ...entry,
          nombreCompleto: filterPersonName(entry.nombreCompleto, 80),
          numeroDocumento: filterDocumentNumber(entry.numeroDocumento),
          edad: filterAge(String(entry.edad)),
        })),
        holderFirstName: filterPersonName(titular.nombres),
        holderLastName: filterPersonName(titular.apellidos),
        estimatedTotal: pricing.total,
        notes: filterNotes(form.solicitudes || ''),
        paymentProof: {
          fileName: safeFileName,
          fileType: paymentFile.type,
          dataUrl: paymentDataUrl,
        },
      }

      const { data } = await createReservation(payload)
      setReservation(data.reservation)
      setStep(4)
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'No se pudo enviar la reserva.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setStepAnimKey(key => key + 1)
    scrollToStepTitle()
  }, [step])

  useEffect(() => {
    if (!reservation?.id || reservation.status !== 'pending_review') {
      setIsPollingStatus(false)
      return undefined
    }

    setIsPollingStatus(true)
    const interval = window.setInterval(refreshReservation, 5000)
    return () => {
      window.clearInterval(interval)
      setIsPollingStatus(false)
    }
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

      <RevealBlock as="section" className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Reserva paso a paso</h2>

        <div className={styles.stepBar}>
          {STEPS.map(item => (
            <div
              key={item.num}
              className={[
                styles.stepItem,
                step === item.num ? styles.stepActive : '',
                step > item.num ? styles.stepCompleted : '',
              ].join(' ')}
            >
              <div className={styles.stepCircle}>{step > item.num ? '✓' : item.num}</div>
              <span className={styles.stepName}>{item.label}</span>
            </div>
          ))}
        </div>

        {submitError && step < 4 && (
          <p className={styles.rangeWarning}>{submitError}</p>
        )}

        <div key={stepAnimKey} className={`${styles.stepContent} ${styles.stepEnter}`}>
          {step === 1 && (
            <Step1
              stepLabelRef={stepTitleRef}
              range={range}
              onRangeChange={setRange}
              titular={titular}
              onTitularFieldChange={handleTitularFieldChange}
              onTitularBlur={handleFieldBlur}
              guests={guests}
              onGuestsChange={setGuests}
              blockedSet={blockedSet}
              pricing={pricing}
              rangeError={rangeError}
              fieldErrors={fieldErrors}
            />
          )}
          {step === 2 && (
            <Step2
              stepLabelRef={stepTitleRef}
              form={form}
              onChange={handleFormChange}
              onBlur={handleFieldBlur}
              guests={guests}
              guestProfiles={guestProfiles}
              onGuestProfileChange={handleGuestProfileChange}
              fieldErrors={fieldErrors}
            />
          )}
          {step === 3 && (
            <Step3
              stepLabelRef={stepTitleRef}
              range={range}
              titular={titular}
              guests={guests}
              pricing={pricing}
              paymentFile={paymentFile}
              paymentFileError={paymentFileError || fieldErrors.comprobante}
              onPaymentFile={(file, errorMessage = '') => {
                setPaymentFile(file)
                setPaymentFileError(errorMessage)
                if (!errorMessage) setFieldError('comprobante', '')
              }}
            />
          )}
          {step === 4 && reservation?.status === 'pending_review' && (
            <WaitingReview
              reservation={reservation}
              titularName={`${titular.nombres} ${titular.apellidos}`.trim()}
              onOpenStatusModal={openStatusModal}
              isPolling={isPollingStatus}
            />
          )}
          {step === 4 && reservation?.status === 'rejected' && <RejectedReservation />}
          {step === 4 && reservation?.status === 'approved' && <Step4 reservation={reservation} />}
          {step === 4 && !reservation && <Step4 />}
        </div>

        {step < 4 && (
          <div className={styles.navBtns}>
            {step > 1 && (
              <button className={styles.btnBack} type="button" onClick={handleBackStep}>
                ← Atrás
              </button>
            )}
            <button
              className={styles.btnNext}
              type="button"
              onClick={handleNextStep}
              disabled={!canProceed()}
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
