import { useReservation }       from '../context/ReservationContext'
import ReservationCalendar      from '../components/ReservationCalendar/ReservationCalendar'
import ReservationForm          from '../components/ReservationForm/ReservationForm'
import Prices                   from '../components/Prices/Prices'
import ReservationSteps         from '../components/ReservationSteps/ReservationSteps'
import Footer                   from '../components/Footer/Footer'
import styles                   from './Reserve.module.css'
import { prices, policies, steps } from '../data/reserveData'

function Reserve() {
  const { setSelectedDates } = useReservation()

  function handleRangeSelect({ checkIn, checkOut }) {
    setSelectedDates({ checkIn, checkOut })
  }

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <h1 className={styles.title}>Reservar</h1>
        <p className={styles.subtitle}>Tu próxima escapada comienza aquí</p>
      </section>

      <section className={styles.scrollSection}>
        <ReservationSteps steps={steps} />
      </section>

      <section className={styles.bookingSection}>
        <ReservationCalendar onRangeSelect={handleRangeSelect} />
        <ReservationForm />
      </section>

      <section className={styles.scrollSection}>
        <Prices prices={prices} />
      </section>

      <section className={styles.policies}>
        <h2 className={styles.policiesTitle}>Políticas de Reserva</h2>
        <div className={styles.policiesGrid}>
          {policies.map((p, i) => (
            <div key={i} className={styles.policyCard}>
              <h3 className={styles.policyTitle}>{p.title}</h3>
              <p className={styles.policyDesc}>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Reserve
