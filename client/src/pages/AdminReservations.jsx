import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { approveReservation, getAdminReservations, rejectReservation, logout } from '../services/api'
import styles from './AdminReservations.module.css'

const STATUS_LABEL = {
  pending_review: 'En revisión',
  approved:       'Aprobada',
  rejected:       'Rechazada',
}

function AdminReservations() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadReservations() {
    setLoading(true)
    setStatus('')
    try {
      const response = await getAdminReservations()
      setReservations(response.data?.reservations || [])
    } catch (err) {
      setStatus(err?.response?.data?.error || 'No se pudieron cargar las reservas')
      if (err?.response?.status === 401) navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReservations() }, [])

  async function handleApprove(id) {
    await approveReservation(id)
    await loadReservations()
    setSelected(prev => prev?.id === id ? null : prev)
  }

  async function handleReject(id) {
    await rejectReservation(id)
    await loadReservations()
    setSelected(prev => prev?.id === id ? null : prev)
  }

  async function handleLogout() {
    await logout()
    navigate('/admin')
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Panel Administrativo</p>
          <h1>Comprobantes de reserva</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={loadReservations}>
            Actualizar
          </button>
          <button type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {status && <p className={styles.error}>{status}</p>}

      <div className={styles.layout}>
        {/* Lista de reservas */}
        <aside className={styles.list}>
          <h2>Reservas recibidas</h2>
          {reservations.length === 0 && !loading && (
            <p className={styles.empty}>No hay reservas registradas.</p>
          )}
          {reservations.map(item => (
            <button
              key={item.id}
              type="button"
              className={`${styles.item} ${selected?.id === item.id ? styles.active : ''}`}
              onClick={() => setSelected(item)}
            >
              <strong>{item.name}</strong>
              <span>{item.checkIn} → {item.checkOut}</span>
              <small>{STATUS_LABEL[item.status] || item.status}</small>
            </button>
          ))}
        </aside>

        {/* Detalle de reserva seleccionada */}
        <section className={styles.detail}>
          {!selected && (
            <p className={styles.empty}>
              Selecciona una reserva para ver datos del cliente, fechas y comprobante.
            </p>
          )}

          {selected && (
            <article>
              <div className={styles.detailHeader}>
                <div>
                  <h2>{selected.name}</h2>
                  <span className={styles.badge}>
                    {STATUS_LABEL[selected.status] || selected.status}
                  </span>
                </div>
              </div>

              <div className={styles.grid}>
                <div><p><b>Correo</b></p><p>{selected.email}</p></div>
                <div><p><b>Teléfono</b></p><p>{selected.phone}</p></div>
                <div><p><b>Check-in</b></p><p>{selected.checkIn}</p></div>
                <div><p><b>Check-out</b></p><p>{selected.checkOut}</p></div>
                <div><p><b>Huéspedes</b></p><p>{selected.guests}</p></div>
                {selected.accessCode && (
                  <div><p><b>Código de entrada</b></p><p>{selected.accessCode}</p></div>
                )}
              </div>

              {selected.notes && (
                <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                  <div><p><b>Solicitudes especiales</b></p><p>{selected.notes}</p></div>
                </div>
              )}

              {/* Comprobante de pago */}
              {selected.paymentProof?.dataUrl && (
                <div className={styles.proofBox}>
                  <p><b>Comprobante de pago</b></p>
                  {selected.paymentProof.fileType?.startsWith('image/') && (
                    <img
                      src={selected.paymentProof.dataUrl}
                      alt="Comprobante de pago"
                    />
                  )}
                  {selected.paymentProof.fileType === 'application/pdf' && (
                    <a
                      href={selected.paymentProof.dataUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir comprobante PDF
                    </a>
                  )}
                </div>
              )}

              {/* Resultado si ya fue procesada */}
              {selected.status === 'approved' && (
                <div className={styles.resultBox}>
                  ✅ Reserva aprobada.
                  {selected.accessCode && <> Código de entrada: <b>{selected.accessCode}</b></>}
                </div>
              )}
              {selected.status === 'rejected' && (
                <div className={styles.resultBox}>
                  ❌ Reserva rechazada.
                </div>
              )}

              {/* Acciones — solo si está pendiente */}
              {selected.status === 'pending_review' && (
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => handleApprove(selected.id)}
                  >
                    ✅ Aceptar comprobante
                  </button>
                  <button
                    type="button"
                    className={styles.reject}
                    onClick={() => handleReject(selected.id)}
                  >
                    ❌ Rechazar comprobante
                  </button>
                </div>
              )}
            </article>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminReservations
