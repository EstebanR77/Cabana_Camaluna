import { useEffect, useState } from 'react'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { approveReservation, getAdminReservations, rejectReservation } from '../services/api'
import styles from './AdminReservations.module.css'

function statusLabel(status) {
  const labels = {
    pending_review: 'Pendiente de revisi\u00f3n',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    pending: 'Pendiente',
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
      <RevealBlock as="section" className={styles.panel}>
        <p className={styles.kicker}>Panel privado</p>
        <h2 className={styles.title}>Reservas recibidas</h2>

        {loading && <p className={styles.message}>Cargando reservas...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.list}>
          {reservations.length === 0 && !loading && (
            <div className={styles.empty}>
              {'A\u00fan no hay comprobantes por revisar.'}
            </div>
          )}

          {reservations.map(reservation => (
            <article key={reservation.id} className={styles.card}>
              <header className={styles.cardHeader}>
                <div>
                  <h3>{reservation.name}</h3>
                  <p>{statusLabel(reservation.status)}</p>
                </div>
                {reservation.status === 'pending_review' && (
                  <span className={styles.badge}>{'Revisi\u00f3n'}</span>
                )}
              </header>

              <div className={styles.summary}>
                <div>
                  <span>Entrada</span>
                  <strong>{reservation.checkIn}</strong>
                </div>
                <div>
                  <span>Salida</span>
                  <strong>{reservation.checkOut}</strong>
                </div>
                <div>
                  <span>{'Tel\u00e9fono'}</span>
                  <strong>{reservation.phone}</strong>
                </div>
                <div>
                  <span>Correo</span>
                  <strong>{reservation.email}</strong>
                </div>
                <div>
                  <span>{'Hu\u00e9spedes'}</span>
                  <strong>{reservation.guests}</strong>
                </div>
                {reservation.accessCode && (
                  <div className={styles.highlight}>
                    <span>{'C\u00f3digo de entrada'}</span>
                    <strong>{reservation.accessCode}</strong>
                  </div>
                )}
              </div>

              {reservation.notes && (
                <p className={styles.message}>Notas: {reservation.notes}</p>
              )}

              {reservation.paymentProof?.dataUrl && (
                <div className={styles.proof}>
                  <p>Comprobante</p>
                  {reservation.paymentProof.fileType?.includes('pdf') ? (
                    <a href={reservation.paymentProof.dataUrl} target="_blank" rel="noreferrer">
                      Ver comprobante PDF
                    </a>
                  ) : (
                    <img
                      src={reservation.paymentProof.dataUrl}
                      alt={`Comprobante de ${reservation.name}`}
                    />
                  )}
                </div>
              )}

              {reservation.status === 'pending_review' && (
                <div className={styles.actions}>
                  <button className={styles.reject} type="button" onClick={() => handleReject(reservation.id)}>
                    Rechazar
                  </button>
                  <button type="button" onClick={() => handleApprove(reservation.id)}>
                    Aceptar comprobante
                  </button>
                </div>
              )}
            </article>
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
