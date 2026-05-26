import { motion } from 'framer-motion'
import styles from './Achievements.module.css'

function Achievements({ title, subtitle, items = [] }) {
  return (
    <section className={styles.wrap}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              className={styles.item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className={styles.itemTitle}>{item.title}</h4>
              <p className={styles.itemDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Achievements
