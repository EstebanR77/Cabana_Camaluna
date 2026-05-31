import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './CabinReserveCTA.module.css'

function CabinReserveCTA({ centered = false, className = '' }) {
  const [isHovered, setIsHovered] = useState(false)

  const button = (
    <Link
      to="/reserve"
      className={[styles.button, isHovered ? styles.active : '', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <span className={styles.shimmer} aria-hidden="true" />
      RESERVA YA!
    </Link>
  )

  if (!centered) {
    return button
  }

  return <div className={styles.wrapCentered}>{button}</div>
}

export default CabinReserveCTA
