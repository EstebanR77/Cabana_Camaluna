import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './QuickAccess.module.css'

function QuickAccess({ items = [] }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
            <Link to={item.link} className={styles.cardLink}>Conoce más →</Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default QuickAccess
