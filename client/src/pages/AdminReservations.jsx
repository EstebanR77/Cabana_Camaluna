import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  approveReservation,
  getAdminReservations,
  rejectReservation,
  logout,
} from '../services/api'
import styles from './AdminReservations.module.css'

const STATUS_LABEL = {
  pending_review: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'Todas' },
  { id: 'pending_review', label: 'En revisión' },
  { id: 'approved', label: 'Aprobadas' },
  { id: 'rejected', label: 'Rechazadas' },
]

function MaterialIcon({ name }) {
  return (
    <span className={styles.materialIcon} aria-hidden="true">
      {name}
    </span>
  )
}

function statusBadgeClass(status) {
  if (status === 'approved') return styles.badgeApproved
  if (status === 'rejected') return styles.badgeRejected
  return styles.badgePending
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function AdminReservations() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [filter, setFilter] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)

  const stats = useMemo(() => ({
    total: reservations.length,
    pending: reservations.filter(item => item.status === 'pending_review').length,
    approved: reservations.filter(item => item.status === 'approved').length,
  }), [reservations])

  const filteredReservations = useMemo(() => {
    if (filter === 'all') return reservations
    return reservations.filter(item => item.status === filter)
  }, [reservations, filter])

  async function loadReservations(silent = false) {
    if (!silent) setLoading(true)
    setStatusMessage('')

    try {
      const response = await getAdminReservations()
      const list = response.data?.reservations || []
      setReservations(list)
      setLastUpdated(new Date())

      setSelected(previous => {
        if (!previous) return null
        return list.find(item => item.id === previous.id) || null
      })
    } catch (err) {
      setStatusMessage(err?.response?.data?.error || 'No se pudieron cargar las reservas.')
      if (err?.response?.status === 401) navigate('/admin')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Reservas | Admin Camaluna'
    loadReservations()
    return () => {
      document.title = 'Camaluna'
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => loadReservations(true), 45000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!statusMessage) return undefined
    const timer = window.setTimeout(() => setStatusMessage(''), 5000)
    return () => window.clearTimeout(timer)
  }, [statusMessage])

  async function handleApprove(id) {
    setActionLoading(`approve-${id}`)
    setStatusMessage('')
    try {
      await approveReservation(id)
      await loadReservations(true)
      setStatusMessage('Reserva aprobada correctamente.')
    } catch (err) {
      setStatusMessage(err?.response?.data?.error || 'No se pudo aprobar la reserva.')
    } finally {
      setActionLoading('')
    }
  }

  async function handleReject(id) {
    setActionLoading(`reject-${id}`)
    setStatusMessage('')
    try {
      await rejectReservation(id)
      await loadReservations(true)
      setStatusMessage('Reserva rechazada.')
    } catch (err) {
      setStatusMessage(err?.response?.data?.error || 'No se pudo rechazar la reserva.')
    } finally {
      setActionLoading('')
    }
  }

  async function handleLogout() {
    setActionLoading('logout')
    try {
      await logout()
      navigate('/admin')
    } catch {
      navigate('/admin')
    } finally {
      setActionLoading('')
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Panel administrativo</p>
            <h1 className={styles.title}>Comprobantes de reserva</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => loadReservations()}
              disabled={loading || Boolean(actionLoading)}
            >
              <MaterialIcon name="refresh" />
              Actualizar
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={handleLogout}
              disabled={Boolean(actionLoading)}
            >
              <MaterialIcon name="logout" />
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{stats.total}</p>
            <p className={styles.statLabel}>Reservas totales</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{stats.pending}</p>
            <p className={styles.statLabel}>En revisión</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{stats.approved}</p>
            <p className={styles.statLabel}>Aprobadas</p>
          </div>
        </div>

        <div className={styles.filters}>
          {FILTER_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              className={`${styles.filterBtn} ${filter === option.id ? styles.filterActive : ''}`}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading && <p className={styles.loadingBar}>Cargando reservas…</p>}
        {statusMessage && <p className={styles.alert} role="alert">{statusMessage}</p>}
        {lastUpdated && !loading && (
          <p className={styles.loadingBar}>
            Última actualización: {lastUpdated.toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}

        <div className={styles.layout}>
          <aside className={styles.list}>
            <h2 className={styles.listTitle}>Reservas recibidas</h2>
            {filteredReservations.length === 0 && !loading && (
              <p className={styles.empty}>No hay reservas en este filtro.</p>
            )}
            {filteredReservations.map(item => (
              <button
                key={item.id}
                type="button"
                className={`${styles.item} ${selected?.id === item.id ? styles.itemActive : ''}`}
                onClick={() => setSelected(item)}
              >
                <strong>{item.name}</strong>
                <span>{formatDate(item.checkIn)} → {formatDate(item.checkOut)}</span>
                <small className={`${styles.badge} ${statusBadgeClass(item.status)}`}>
                  {STATUS_LABEL[item.status] || item.status}
                </small>
              </button>
            ))}
          </aside>

          <section className={styles.detail}>
            {!selected && (
              <p className={styles.empty}>
                Selecciona una reserva para ver datos del cliente, fechas y comprobante de pago.
              </p>
            )}

            {selected && (
              <article>
                <div className={styles.detailHeader}>
                  <div>
                    <h2>{selected.name}</h2>
                    <span className={`${styles.badge} ${statusBadgeClass(selected.status)}`}>
                      {STATUS_LABEL[selected.status] || selected.status}
                    </span>
                  </div>
                  <p className={styles.empty} style={{ padding: 0, textAlign: 'right' }}>
                    ID: {selected.id}
                  </p>
                </div>

                <div className={styles.grid}>
                  <div className={styles.infoCard}>
                    <p>Correo</p>
                    <strong>{selected.email}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <p>Teléfono</p>
                    <strong>{selected.phone}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <p>Check-in</p>
                    <strong>{formatDate(selected.checkIn)}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <p>Check-out</p>
                    <strong>{formatDate(selected.checkOut)}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <p>Huéspedes</p>
                    <strong>{selected.guests}</strong>
                  </div>
                  {selected.estimatedTotal > 0 && (
                    <div className={styles.infoCard}>
                      <p>Total estimado</p>
                      <strong>
                        ${Number(selected.estimatedTotal).toLocaleString('es-CO')} COP
                      </strong>
                    </div>
                  )}
                  {selected.accessCode && (
                    <div className={styles.infoCard}>
                      <p>Código de entrada</p>
                      <strong>{selected.accessCode}</strong>
                    </div>
                  )}
                </div>

                {selected.notes && (
                  <div className={`${styles.grid} ${styles.gridFull}`} style={{ marginTop: '0.75rem' }}>
                    <div className={styles.infoCard}>
                      <p>Solicitudes especiales</p>
                      <strong>{selected.notes}</strong>
                    </div>
                  </div>
                )}

                {Array.isArray(selected.guestRoster) && selected.guestRoster.length > 0 && (
                  <div className={`${styles.grid} ${styles.gridFull}`} style={{ marginTop: '0.75rem' }}>
                    <div className={styles.infoCard}>
                      <p>Huéspedes registrados</p>
                      <strong>
                        {selected.guestRoster.map(guest => (
                          `${guest.nombreCompleto || guest.label} (${guest.tipoDocumento || 'DOC'} ${guest.numeroDocumento || ''}, ${guest.edad || '?'} años)`
                        )).join(' · ')}
                      </strong>
                    </div>
                  </div>
                )}

                {selected.paymentProof?.dataUrl && (
                  <div className={styles.proofBox}>
                    <p>Comprobante de pago</p>
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

                {selected.status === 'approved' && (
                  <div className={styles.resultBox}>
                    Reserva aprobada.
                    {selected.accessCode && (
                      <> Código de entrada: <b>{selected.accessCode}</b></>
                    )}
                  </div>
                )}

                {selected.status === 'rejected' && (
                  <div className={`${styles.resultBox} ${styles.resultBoxRejected}`}>
                    Reserva rechazada.
                  </div>
                )}

                {selected.status === 'pending_review' && (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnApprove}`}
                      onClick={() => handleApprove(selected.id)}
                      disabled={Boolean(actionLoading)}
                    >
                      <MaterialIcon name="check_circle" />
                      {actionLoading === `approve-${selected.id}` ? 'Procesando…' : 'Aceptar comprobante'}
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnReject}`}
                      onClick={() => handleReject(selected.id)}
                      disabled={Boolean(actionLoading)}
                    >
                      <MaterialIcon name="cancel" />
                      {actionLoading === `reject-${selected.id}` ? 'Procesando…' : 'Rechazar comprobante'}
                    </button>
                  </div>
                )}
              </article>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default AdminReservations
