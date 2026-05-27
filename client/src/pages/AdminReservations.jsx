import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { approveReservation, getAdminReservations, logout, rejectReservation } from '../services/api'

function formatStatus(status) {
  if (status === 'approved') return 'Aprobada'
  if (status === 'rejected') return 'Rechazada'
  if (status === 'pending_review') return 'Pendiente de revisión'
  return status || 'Pendiente'
}

function AdminReservations() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadReservations() {
    try {
      setLoading(true)
      const { data } = await getAdminReservations()
      setReservations(data.reservations || [])
      setSelected(current => current || data.reservations?.[0] || null)
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin')
        return
      }
      setError(err.response?.data?.error || 'No se pudieron cargar las reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  async function handleApprove() {
    if (!selected) return

    const { data } = await approveReservation(selected.id)
    setSelected(data.reservation)
    await loadReservations()
  }

  async function handleReject() {
    if (!selected) return

    const reason = window.prompt('Motivo del rechazo:', 'El comprobante no pudo ser validado.')
    const { data } = await rejectReservation(selected.id, reason || '')
    setSelected(data.reservation)
    await loadReservations()
  }

  async function handleLogout() {
    await logout()
    navigate('/admin')
  }

  return (
    <main style={{ minHeight: '80vh', padding: '3rem 1.5rem', background: 'var(--color-page-bg)' }}>
      <section style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--color-green)', fontWeight: 700, letterSpacing: '.08em' }}>PANEL DE ADMINISTRACIÓN</p>
            <h1 style={{ fontFamily: 'var(--font-title)' }}>Comprobantes de reserva</h1>
          </div>
          <button onClick={handleLogout} style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #ccc', background: 'white' }}>
            Cerrar sesión
          </button>
        </div>

        {error && <p style={{ color: '#9b2c2c' }}>{error}</p>}
        {loading && <p>Cargando reservas...</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
          <aside style={{ background: 'white', borderRadius: '18px', padding: '1rem', boxShadow: 'var(--shadow-card)', minHeight: 420 }}>
            <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1rem' }}>Reservas recibidas</h2>

            {!reservations.length && !loading && <p>No hay reservas registradas.</p>}

            {reservations.map(reservation => (
              <button
                key={reservation.id}
                onClick={() => setSelected(reservation)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '.9rem',
                  marginBottom: '.7rem',
                  borderRadius: '12px',
                  border: selected?.id === reservation.id ? '2px solid var(--color-green)' : '1px solid #ddd',
                  background: selected?.id === reservation.id ? 'rgba(112,136,95,.12)' : 'white',
                  cursor: 'pointer'
                }}
              >
                <strong>{reservation.name}</strong>
                <br />
                <small>{reservation.checkIn} / {reservation.checkOut}</small>
                <br />
                <small>{formatStatus(reservation.status)}</small>
              </button>
            ))}
          </aside>

          <section style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: 'var(--shadow-card)', minHeight: 420 }}>
            {!selected ? (
              <div style={{ minHeight: 360, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-title)' }}>Selecciona una reserva</h2>
                  <p>Al abrir una reserva podrás ver datos del cliente, fechas y comprobante.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.2rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-title)' }}>{selected.name}</h2>
                  <p><b>Estado:</b> {formatStatus(selected.status)}</p>
                  {selected.entryCode && <p><b>Código de entrada:</b> {selected.entryCode}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                  <p><b>Correo:</b><br />{selected.email}</p>
                  <p><b>Teléfono:</b><br />{selected.phone}</p>
                  <p><b>Check-in:</b><br />{selected.checkIn}</p>
                  <p><b>Check-out:</b><br />{selected.checkOut}</p>
                  <p><b>Huéspedes:</b><br />{selected.guests}</p>
                  <p><b>Total:</b><br />${Number(selected.total || 0).toLocaleString('es-CO')} COP</p>
                </div>

                {selected.notes && (
                  <p><b>Solicitudes:</b><br />{selected.notes}</p>
                )}

                <div>
                  <h3 style={{ fontFamily: 'var(--font-title)' }}>Comprobante</h3>
                  {selected.paymentProof ? (
                    selected.paymentProof.startsWith('data:application/pdf') ? (
                      <a href={selected.paymentProof} target="_blank" rel="noreferrer">Abrir comprobante PDF</a>
                    ) : (
                      <img
                        src={selected.paymentProof}
                        alt={selected.paymentProofName || 'Comprobante de pago'}
                        style={{ maxWidth: '100%', maxHeight: 460, objectFit: 'contain', borderRadius: '14px', border: '1px solid #ddd' }}
                      />
                    )
                  ) : (
                    <p>Esta reserva no tiene comprobante adjunto.</p>
                  )}
                </div>

                {selected.status === 'pending_review' && (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handleApprove} style={{ padding: '.8rem 1.2rem', border: 0, borderRadius: '10px', background: 'var(--color-green-dark)', color: 'white' }}>
                      Aceptar comprobante
                    </button>
                    <button onClick={handleReject} style={{ padding: '.8rem 1.2rem', border: '1px solid #9b2c2c', borderRadius: '10px', background: 'white', color: '#9b2c2c' }}>
                      Rechazar comprobante
                    </button>
                  </div>
                )}

                {selected.status === 'approved' && (
                  <p>Reserva aprobada. El cliente ya puede ver su código de entrada.</p>
                )}

                {selected.status === 'rejected' && (
                  <p>Reserva rechazada. Mensaje: {selected.reviewMessage}</p>
                )}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}

export default AdminReservations
