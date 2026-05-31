import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { createReservation, getReservation } from '../../services/api'
import { useReservation } from '../../context/ReservationContext'
import styles from './ReservationForm.module.css'

const MAX_GUESTS = 5

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function buildGuestForms(guestCounts) {
  const total = guestCounts.adults + guestCounts.children
  return Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    type: index < guestCounts.adults ? 'Adulto' : 'Niño',
    fullName: '',
    document: '',
    age: ''
  }))
}

function ReservationForm() {
  const { selectedDates } = useReservation()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [guestCounts, setGuestCounts] = useState({ adults: 1, children: 0, babies: 0, pets: 0 })
  const [guestForms, setGuestForms] = useState(buildGuestForms({ adults: 1, children: 0, babies: 0, pets: 0 }))
  const [proofFile, setProofFile] = useState(null)
  const [reservation, setReservation] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const totalGuests = useMemo(
    () => guestCounts.adults + guestCounts.children,
    [guestCounts.adults, guestCounts.children]
  )

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function updateGuestCount(field, action) {
    setGuestCounts(prev => {
      const next = { ...prev }
      const current = next[field]
      const totalWithoutBabies = next.adults + next.children

      if (action === 'increment') {
        if ((field === 'adults' || field === 'children') && totalWithoutBabies >= MAX_GUESTS) return prev
        next[field] = current + 1
      } else {
        const min = field === 'adults' ? 1 : 0
        next[field] = Math.max(min, current - 1)
      }

      if (field === 'adults' || field === 'children') {
        setGuestForms(buildGuestForms(next))
      }

      return next
    })
  }

  function handleGuestFormChange(index, field, value) {
    setGuestForms(prev => prev.map((guest, i) => (
      i === index ? { ...guest, [field]: value } : guest
    )))
  }

  function validateStepOne() {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setStatus('Selecciona primero las fechas de entrada y salida en el calendario.')
      return false
    }
    setStatus('')
    return true
  }

  function validateStepTwo() {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setStatus('Completa nombre, correo y teléfono.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('Ingresa un correo electrónico válido.')
      return false
    }
    const incompleteGuest = guestForms.some(g => !g.fullName.trim())
    if (incompleteGuest) {
      setStatus('Ingresa al menos el nombre de cada huésped.')
      return false
    }
    setStatus('')
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStepTwo()) return
    if (!proofFile) {
      setStatus('Sube el comprobante de pago antes de enviar la reserva.')
      return
    }

    setLoading(true)
    setStatus('')
    try {
      const proofBase64 = await fileToBase64(proofFile)
      const response = await createReservation({
        ...selectedDates,
        ...form,
        guests: totalGuests,
        guestCounts,
        guestDetails: guestForms,
        paymentProof: {
          name: proofFile.name,
          type: proofFile.type,
          size: proofFile.size,
          data: proofBase64
        }
      })

      const savedReservation = response.data?.reservation || response.reservation
      setReservation(savedReservation)
      setStep(4)
      setStatus('Tu comprobante fue enviado. La reserva queda en espera de validación del administrador.')
    } catch (error) {
      setStatus(error?.response?.data?.error || 'Error al enviar la reserva. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshReservationStatus() {
    if (!reservation?.id) return
    setLoading(true)
    try {
      const response = await getReservation(reservation.id)
      const updated = response.data?.reservation || response.reservation
      setReservation(updated)
      if (updated.status === 'approved') {
        setStatus('Tu reserva fue confirmada.')
      } else if (updated.status === 'rejected') {
        setStatus('Tu comprobante fue rechazado. Comunícate con Camaluna para validar la información.')
      } else {
        setStatus('Tu comprobante sigue en revisión.')
      }
    } catch {
      setStatus('No se pudo consultar el estado de la reserva.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className={styles.title}>Reserva paso a paso</h3>

      {step === 1 && (
        <div className={styles.form}>
          <div className={styles.field}>
            <label>Huéspedes</label>
            <details>
              <summary>{totalGuests} huésped{totalGuests === 1 ? '' : 'es'}</summary>
              <div>
                <GuestCounter
                  title="Adultos"
                  subtitle="Edad: 13 o más"
                  value={guestCounts.adults}
                  onMinus={() => updateGuestCount('adults', 'decrement')}
                  onPlus={() => updateGuestCount('adults', 'increment')}
                />
                <GuestCounter
                  title="Niños"
                  subtitle="De 2 a 12 años"
                  value={guestCounts.children}
                  onMinus={() => updateGuestCount('children', 'decrement')}
                  onPlus={() => updateGuestCount('children', 'increment')}
                />
                <GuestCounter
                  title="Bebés"
                  subtitle="Menos de 2 años"
                  value={guestCounts.babies}
                  onMinus={() => updateGuestCount('babies', 'decrement')}
                  onPlus={() => updateGuestCount('babies', 'increment')}
                />
                <GuestCounter
                  title="Mascotas"
                  subtitle="Animales de compañía"
                  value={guestCounts.pets}
                  onMinus={() => updateGuestCount('pets', 'decrement')}
                  onPlus={() => updateGuestCount('pets', 'increment')}
                />
                <p>Capacidad máxima: {MAX_GUESTS} huéspedes, sin incluir bebés.</p>
              </div>
            </details>
          </div>

          {selectedDates.checkIn && selectedDates.checkOut && (
            <div className={styles.summary}>
              <p>📅 Check-in: <strong>{new Date(selectedDates.checkIn).toLocaleDateString('es-CO')}</strong></p>
              <p>📅 Check-out: <strong>{new Date(selectedDates.checkOut).toLocaleDateString('es-CO')}</strong></p>
            </div>
          )}

          {status && <p className={styles.status}>{status}</p>}
          <button type="button" className={styles.btn} onClick={() => validateStepOne() && setStep(2)}>
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.form}>
          <div className={styles.field}>
            <label>Nombre completo</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
          </div>
          <div className={styles.field}>
            <label>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" required />
          </div>
          <div className={styles.field}>
            <label>Teléfono / WhatsApp</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+57 300 000 0000" required />
          </div>
          <div className={styles.field}>
            <label>Notas adicionales</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Alguna solicitud especial..." rows={3} />
          </div>

          {guestForms.map((guest, index) => (
            <div className={styles.summary} key={guest.id}>
              <p><strong>{guest.type} {guest.id}</strong></p>
              <div className={styles.field}>
                <label>Nombre del huésped</label>
                <input value={guest.fullName} onChange={(e) => handleGuestFormChange(index, 'fullName', e.target.value)} placeholder="Nombre completo" required />
              </div>
              <div className={styles.field}>
                <label>Documento</label>
                <input value={guest.document} onChange={(e) => handleGuestFormChange(index, 'document', e.target.value)} placeholder="Opcional" />
              </div>
              <div className={styles.field}>
                <label>Edad</label>
                <input type="number" min="0" value={guest.age} onChange={(e) => handleGuestFormChange(index, 'age', e.target.value)} placeholder="Opcional" />
              </div>
            </div>
          ))}

          {status && <p className={styles.status}>{status}</p>}
          <button type="button" className={styles.btn} onClick={() => validateStepTwo() && setStep(3)}>
            Continuar al pago
          </button>
          <button type="button" onClick={() => setStep(1)}>Volver</button>
        </div>
      )}

      {step === 3 && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.summary}>
            <p><strong>Resumen</strong></p>
            <p>Huéspedes: {totalGuests}</p>
            <p>Adultos: {guestCounts.adults} · Niños: {guestCounts.children} · Bebés: {guestCounts.babies} · Mascotas: {guestCounts.pets}</p>
            <p>El administrador revisará el comprobante y aprobará o rechazará la reserva.</p>
          </div>
          <div className={styles.field}>
            <label>Comprobante de pago</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} required />
          </div>
          {status && <p className={styles.status}>{status}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar comprobante'}
          </button>
          <button type="button" onClick={() => setStep(2)}>Volver</button>
        </form>
      )}

      {step === 4 && (
        <div className={styles.form}>
          <div className={styles.summary}>
            {reservation?.status === 'approved' ? (
              <>
                <p><strong>Reserva confirmada</strong></p>
                <p>Código de entrada: <strong>{reservation.accessCode}</strong></p>
              </>
            ) : reservation?.status === 'rejected' ? (
              <>
                <p><strong>Reserva rechazada</strong></p>
                <p>Comunícate con Camaluna para revisar tu comprobante.</p>
              </>
            ) : (
              <>
                <p><strong>Reserva en espera</strong></p>
                <p>Tu comprobante está pendiente de revisión por el administrador.</p>
                <p>Referencia: {reservation?.id}</p>
              </>
            )}
          </div>
          {status && <p className={styles.status}>{status}</p>}
          <button type="button" className={styles.btn} onClick={refreshReservationStatus} disabled={loading}>
            {loading ? 'Consultando...' : 'Consultar estado'}
          </button>
        </div>
      )}
    </motion.div>
  )
}

function GuestCounter({ title, subtitle, value, onMinus, onPlus }) {
  return (
    <div>
      <p><strong>{title}</strong></p>
      <p>{subtitle}</p>
      <button type="button" onClick={onMinus}>−</button>
      <span> {value} </span>
      <button type="button" onClick={onPlus}>+</button>
      <hr />
    </div>
  )
}

export default ReservationForm
