import { useState } from 'react'
import { motion } from 'framer-motion'
import { createReservation } from '../../services/api'
import { useReservation } from '../../context/ReservationContext'
import styles from './ReservationForm.module.css'

function ReservationForm() {
  const { selectedDates } = useReservation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: 1, notes: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setStatus('Por favor selecciona las fechas en el calendario.')
      return
    }
    setLoading(true)
    try {
      await createReservation({ ...form, ...selectedDates })
      setStatus('¡Reserva enviada con éxito! Te contactaremos pronto.')
      setForm({ name: '', email: '', phone: '', guests: 1, notes: '' })
    } catch {
      setStatus('Error al enviar la reserva. Intenta de nuevo.')
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
      <h3 className={styles.title}>Tus datos</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
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
          <label>Número de huéspedes</label>
          <input name="guests" type="number" min="1" max="6" value={form.guests} onChange={handleChange} required />
        </div>
        <div className={styles.field}>
          <label>Notas adicionales</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Alguna solicitud especial..." rows={3} />
        </div>
        {selectedDates.checkIn && selectedDates.checkOut && (
          <div className={styles.summary}>
            <p>📅 Check-in: <strong>{new Date(selectedDates.checkIn).toLocaleDateString('es-CO')}</strong></p>
            <p>📅 Check-out: <strong>{new Date(selectedDates.checkOut).toLocaleDateString('es-CO')}</strong></p>
          </div>
        )}
        {status && <p className={styles.status}>{status}</p>}
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Enviando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </motion.div>
  )
}

export default ReservationForm
