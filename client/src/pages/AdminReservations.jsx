import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { approveReservation, getAdminReservations, logout, rejectReservation } from '../services/api'
import Footer from '../components/Footer/Footer'
import styles from './Reserve.module.css'

function statusText(status) {
  if (status === 'approved') return 'Aprobada'
  if (status === 'rejected') return 'Rechazada'
  return 'Pendiente de revisión'
}

function AdminReservations() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadReservations() {
    setError('')
    try {
      const { data } = await getAdminReservations()
      setReservations(data.reservations || [])
      setSelected(current => {
        if (!current) return data.reservations?.[0] || null
        return data.reservations?.find(r => r.id === current.id) || data.reservations?.[0] || null
      })
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin')
      else setError(err.response?.data?.error || 'No se pudieron cargar las reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
    const interval = setInterval(loadReservations, 4000)
    return () => clearInterval(interval)
  }, [])

  async function handleApprove(id) {
    const { data } = await approveReservation(id)
    setSelected(data.reservation)
    await loadReservations()
  }

  async function handleReject(id) {
    const { data } = await rejectReservation(id)
    setSelected(data.reservation)
    await loadReservations()
  }

  async function handleLogout() {
    await logout()
    navigate('/admin')
  }

  return (
    <div className={styles.page}>
      <section className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Comprobantes de reserva</h2>
        <div className={styles.navBtns}>
          <button className={styles.btnBack} type="button" onClick={handleLogout}>Cerrar sesión</button>
        </div>

        {error && <p className={styles.confirmedText}>{error}</p>}

        <div className={styles.stepContent}>
          <div className={styles.step}>
            <p className={styles.stepLabel}>Reservas recibidas</p>
            {loading && <p className={styles.summaryKey}>Cargando reservas...</p>}
            {!loading && reservations.length === 0 && <p className={styles.summaryKey}>No hay reservas registradas.</p>}
            {reservations.map(reservation => (
              <button
                key={reservation.id}
                className={styles.btnBack}
                type="button"
                onClick={() => setSelected(reservation)}
              >
                {reservation.name} — {statusText(reservation.status)}
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className={styles.stepContent} style={{ marginTop: '1.5rem' }}>
            <div className={styles.step}>
              <p className={styles.stepLabel}>Detalle de reserva</p>
              <div className={styles.summary}>
                <div className={styles.summaryCard}><p className={styles.summaryKey}>Cliente</p><p className={styles.summaryVal}>{selected.name}</p></div>
                <div className={styles.summaryCard}><p className={styles.summaryKey}>Correo</p><p className={styles.summaryVal}>{selected.email}</p></div>
                <div className={styles.summaryCard}><p className={styles.summaryKey}>Teléfono</p><p className={styles.summaryVal}>{selected.phone}</p></div>
                <div className={styles.summaryCard}><p className={styles.summaryKey}>Huéspedes</p><p className={styles.summaryVal}>{selected.guests}</p></div>
                <div className={styles.summaryCard}><p className={styles.summaryKey}>Check-in</p><p className={styles.summaryVal}>{selected.checkIn}</p></div>
                <div className={styles.summaryCard}><p className={styles.summaryKey}>Check-out</p><p className={styles.summaryVal}>{selected.checkOut}</p></div>
                <div className={`${styles.summaryCard} ${styles.summaryTotal}`}><p className={styles.summaryKey}>Estado</p><p className={styles.summaryVal}>{statusText(selected.status)}</p></div>
              </div>

              {selected.notes && <p className={styles.confirmedText}><b>Notas:</b> {selected.notes}</p>}

              <div className={styles.field}>
                <label className={styles.label}>Comprobante</label>
                {selected.paymentProof?.data?.startsWith('data:image/') ? (
                  <img src={selected.paymentProof.data} alt="Comprobante de pago" style={{ maxWidth: '420px', borderRadius: '12px' }} />
                ) : selected.paymentProof?.data ? (
                  <a className={styles.confirmedBtn} href={selected.paymentProof.data} target="_blank" rel="noreferrer">Abrir comprobante</a>
                ) : (
                  <p className={styles.summaryKey}>Sin comprobante adjunto.</p>
                )}
              </div>

              {selected.status === 'approved' && selected.accessCode && (
                <p className={styles.confirmedText}><b>Código de entrada:</b> {selected.accessCode}</p>
              )}

              {selected.status !== 'approved' && selected.status !== 'rejected' && (
                <div className={styles.navBtns}>
                  <button className={styles.btnBack} type="button" onClick={() => handleReject(selected.id)}>Rechazar</button>
                  <button className={styles.btnNext} type="button" onClick={() => handleApprove(selected.id)}>Aceptar</button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default AdminReservations
