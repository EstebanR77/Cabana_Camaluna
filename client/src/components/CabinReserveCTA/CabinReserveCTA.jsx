import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './CabinReserveCTA.module.css'

function CabinReserveCTA() {
  const [isHovered, setIsHovered] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  return (
    <div className={styles.wrap}>
      <Link
        to="/reserve"
        className={[styles.button, isHovered ? styles.hovered : '', isReady ? styles.ready : '']
          .filter(Boolean)
          .join(' ')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <span className={styles.materialIcon} aria-hidden="true">calendar_month</span>
        <span>RESERVA YA!</span>
      </Link>
    </div>
  )
}

export default CabinReserveCTA
