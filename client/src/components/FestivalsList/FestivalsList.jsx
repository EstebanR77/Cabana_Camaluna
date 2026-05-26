import { motion } from 'framer-motion'
import styles from './FestivalsList.module.css'

function FestivalsList({ items = [] }) {
  return (
    <section className={styles.wrap}>
      <div className={styles.list}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={`${styles.item} ${item.highlighted ? styles.itemHighlight : ''}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <div className={styles.icon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6" />
                <path d="M5 8h14" />
                <path d="M5 8c-1 4 1 10 7 14 6-4 8-10 7-14z" />
              </svg>
            </div>

            <div className={styles.body}>
              <h4 className={styles.title}>
                {item.title} <span className={styles.date}>{item.date}</span>
              </h4>
              <p className={styles.desc}>{item.desc}</p>
            </div>

            <button type="button" className={styles.arrow} aria-label={`Ver mas ${item.title}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default FestivalsList
