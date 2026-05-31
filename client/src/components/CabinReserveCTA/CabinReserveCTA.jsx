import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './CabinReserveCTA.module.css'

function CabinReserveCTA({ variant = 'default', wrapClassName = '', className = '' }) {
  const [isHovered, setIsHovered] = useState(false)

  const buttonClass = [
    styles.button,
    styles[variant],
    isHovered ? styles.active : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const button = (
    <Link
      to="/reserve"
      className={buttonClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <span className={styles.shimmer} aria-hidden="true" />
      RESERVA YA!
    </Link>
  )

  if (variant === 'navbar') {
    return button
  }

  return (
    <div className={[styles.wrap, styles[`wrap_${variant}`], wrapClassName].filter(Boolean).join(' ')}>
      {button}
    </div>
  )
}

export default CabinReserveCTA
