import { useEffect, useState } from 'react'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { approveReservation, getAdminReservations, rejectReservation } from '../services/api'
import styles from './Reserve.module.css'

function statusLabel(status) {
  const labels = {
    pending_review: 'Pendiente de revisión',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    pending: 'Pendiente'
  }

  return labels[status] || status || 'Sin estado'
}

function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadReservations() {
    setError('')

    try {
      const { data } = await getAdminReservations()
      setReservations(data.reservations || [])
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudieron cargar las reservas.')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id) {
    setError('')

    try {
      await approveReservation(id)
      await loadReservations()
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo aprobar la reserva.')
    }
  }

  async function handleReject(id) {
    setError('')

    try {
      await rejectReservation(id)
      await loadReservations()
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo rechazar la reserva.')
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  return (
    <div className={styles.page}>
      <RevealBlock as="section" className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Reservas recibidas</h2>

        {loading && <p className={styles.confirmedText}>Cargando reservas...</p>}
        {error && <p className={styles.confirmedText}>{error}</p>}

        <div className={styles.stepContent}>
          {reservations.length === 0 && !loading && (
            <div className={styles.step}>
              <p className={styles.confirmedText}>Aún no hay comprobantes por revisar.</p>
            </div>
          )}

          {reservations.map(reservation => (
            <div key={reservation.id} className={styles.step}>
              <p className={styles.stepLabel}>
                {reservation.name} — {statusLabel(reservation.status)}
              </p>

              <div className={styles.summary}>
                <div className={styles.summaryCard}>
                  <p className={styles.summaryKey}>Entrada</p>
                  <p className={styles.summaryVal}>{reservation.checkIn}</p>
                </div>
                <div className={styles.summaryCard}>
                  <p className={styles.summaryKey}>Salida</p>
                  <p className={styles.summaryVal}>{reservation.checkOut}</p>
                </div>
                <div className={styles.summaryCard}>
                  <p className={styles.summaryKey}>Teléfono</p>
                  <p className={styles.summaryVal}>{reservation.phone}</p>
                </div>
                <div className={styles.summaryCard}>
                  <p className={styles.summaryKey}>Correo</p>
                  <p className={styles.summaryVal}>{reservation.email}</p>
                </div>
                <div className={styles.summaryCard}>
                  <p className={styles.summaryKey}>Huéspedes</p>
                  <p className={styles.summaryVal}>{reservation.guests}</p>
                </div>
                {reservation.accessCode && (
                  <div className={`${styles.summaryCard} ${styles.summaryTotal}`}>
                    <p className={styles.summaryKey}>Código de entrada</p>
                    <p className={styles.summaryVal}>{reservation.accessCode}</p>
                  </div>
                )}
              </div>

              {reservation.notes && (
                <p className={styles.confirmedText}>Notas: {reservation.notes}</p>
              )}

              {reservation.paymentProof?.dataUrl && (
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>Comprobante</label>
                  {reservation.paymentProof.fileType?.includes('pdf') ? (
                    <a className={styles.confirmedBtn} href={reservation.paymentProof.dataUrl} target="_blank" rel="noreferrer">
                      Ver comprobante PDF
                    </a>
                  ) : (
                    <img
                      src={reservation.paymentProof.dataUrl}
                      alt={`Comprobante de ${reservation.name}`}
                      style={{ maxWidth: '100%', borderRadius: '12px' }}
                    />
                  )}
                </div>
              )}

              {reservation.status === 'pending_review' && (
                <div className={styles.navBtns}>
                  <button className={styles.btnBack} type="button" onClick={() => handleReject(reservation.id)}>
                    Rechazar
                  </button>
                  <button className={styles.btnNext} type="button" onClick={() => handleApprove(reservation.id)}>
                    Aceptar comprobante
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </div>
  )
}

export default AdminReservations
