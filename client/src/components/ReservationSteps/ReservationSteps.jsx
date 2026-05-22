import { motion } from 'framer-motion'
import styles from './ReservationSteps.module.css'

function ReservationSteps({ steps = [] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>¿Cómo Reservar?</h2>
      <div className={styles.grid}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={styles.step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <span className={styles.number}>{step.number}</span>
            <div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ReservationSteps
