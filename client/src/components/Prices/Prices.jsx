import { motion } from 'framer-motion'
import styles from './Prices.module.css'

function Prices({ prices = [] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Precios por Temporada</h2>
      <div className={styles.grid}>
        {prices.map((item, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.season}>{item.season}</h3>
            <p className={styles.period}>{item.period}</p>
            <p className={styles.price}>
              <span className={styles.amount}>${item.price}</span>
              <span className={styles.currency}> {item.currency}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Prices
