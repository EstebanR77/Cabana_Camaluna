import { motion } from 'framer-motion'
import styles from './OurValues.module.css'

const ICONS = {
  leaf: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  ),
  heart: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <path d="M3.5 12h4l1.5-3 3 6 1.5-3h4.5" />
    </svg>
  ),
  dna: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3h16M4 21h16" />
      <path d="M6 3c0 6 12 6 12 9s-12 3-12 9" />
      <path d="M18 3c0 6-12 6-12 9s12 3 12 9" />
    </svg>
  ),
}

function OurValues({ title, subtitle, items = [] }) {
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
              <div className={styles.icon}>{ICONS[item.icon]}</div>
              <h4 className={styles.itemTitle}>{item.title}</h4>
              <p className={styles.itemDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default OurValues
