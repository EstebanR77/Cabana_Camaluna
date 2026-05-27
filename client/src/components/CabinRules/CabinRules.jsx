import { motion } from 'framer-motion'
import styles from './CabinRules.module.css'

const rules = [
  { icon: '🚭', text: 'No fumar dentro de espacios cerrados' },
  { icon: '🕒', text: 'Horario de check-in y check-out según la reservación' },
  { icon: '👥', text: 'Máximo 6 personas exclusivas para la estadía' },
]

function CabinRules() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Reglas de la Casa</h2>
      <div className={styles.grid}>
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <span className={styles.icon}>{rule.icon}</span>
            <p className={styles.text}>{rule.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default CabinRules
