import ReservationStatusFab from '../ReservationStatus/ReservationStatusFab'
import FloatingChat from '../chat/FloatingChat'
import styles from './FloatingActions.module.css'

function FloatingActions() {
  return (
    <div className={styles.stack}>
      <ReservationStatusFab />
      <FloatingChat />
    </div>
  )
}

export default FloatingActions
