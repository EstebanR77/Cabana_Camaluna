import ReservationStatusFab from '../ReservationStatus/ReservationStatusFab'
import FloatingWhatsApp from '../FloatingWhatsApp/FloatingWhatsApp'
import styles from './FloatingActions.module.css'

function FloatingActions() {
  return (
    <div className={styles.stack}>
      <ReservationStatusFab />
      <FloatingWhatsApp />
    </div>
  )
}

export default FloatingActions
