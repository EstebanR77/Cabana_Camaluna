import { motion } from 'framer-motion'
import styles from './Achievements.module.css'

const ICONS = {
  guests: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 11a4 4 0 1 0-3.2-6.4" />
      <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M2.5 21c.5-4 2.7-6 5.5-6s5 2 5.5 6" />
      <path d="M13.5 15.5c2.9.2 5 2.1 5.5 5.5" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 2.9 6 6.6.9-4.8 4.7 1.2 6.6L12 17.1l-5.9 3.1 1.2-6.6-4.8-4.7 6.6-.9L12 2z" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2v4" />
      <path d="M17 2v4" />
      <path d="M4 9h16" />
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 17h.01" />
    </svg>
  ),
  rest: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12c4-8 12-8 16 0" />
      <path d="M6 12c2.2 4.5 9.8 4.5 12 0" />
      <path d="M12 14v6" />
      <path d="M8 20h8" />
    </svg>
  ),
}

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
              <h4 className={styles.itemTitle}>
                <span>{item.title}</span>
                {item.icon === 'star' && (
                  <span className={styles.titleIcon}>{ICONS[item.icon]}</span>
                )}
              </h4>
              <p className={styles.itemDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Achievements
