import { useEffect, useState } from 'react'
import { useReservationStatus } from '../../context/ReservationStatusContext'
import styles from './ReservationStatusFab.module.css'

function MaterialIcon({ name, className = '' }) {
  return (
    <span className={`${styles.materialIcon} ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}

function ReservationStatusFab() {
  const { openStatusModal, modalOpen } = useReservationStatus()
  const [isHovering, setIsHovering] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (!isHovering) {
      setShowTooltip(false)
      return undefined
    }

    const timer = window.setTimeout(() => setShowTooltip(true), 400)
    return () => window.clearTimeout(timer)
  }, [isHovering])

  return (
    <div className={styles.fabWrap}>
      <span
        className={`${styles.tooltip} ${showTooltip && !modalOpen ? styles.tooltipVisible : ''}`}
        role="tooltip"
      >
        Conozca el estado de su reserva
      </span>

      <button
        type="button"
        className={styles.fabButton}
        onClick={() => openStatusModal()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
        aria-label="Consultar estado de reserva"
        aria-expanded={modalOpen}
      >
        <MaterialIcon name="event_available" className={styles.fabIcon} />
      </button>
    </div>
  )
}

export default ReservationStatusFab
