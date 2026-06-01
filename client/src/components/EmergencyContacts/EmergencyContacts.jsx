import { motion } from 'framer-motion'
import styles from './EmergencyContacts.module.css'

const ICONS = {
  ambulance: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17V8h12v9" />
      <path d="M15 11h4l2 3v3h-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M8 4h4" />
      <path d="M10 2v4" />
    </svg>
  ),
  siren: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17h10v-5a5 5 0 0 0-10 0v5z" />
      <path d="M5 17h14v3H5z" />
      <path d="M12 5V2" />
      <path d="M19 9l2-2" />
      <path d="M5 9L3 7" />
    </svg>
  ),
  hospital: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 8v6" />
      <path d="M9 11h6" />
      <path d="M8 17h8" />
    </svg>
  ),
  firetruck: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17V9h10v8" />
      <path d="M12 12h6l3 3v2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M14 5h4l1 3" />
    </svg>
  ),
}

function EmergencyContacts({ title, items = [] }) {
  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>
        <span className={styles.titleIcon}>{ICONS.ambulance}</span>
        {title}
      </h2>

      <div className={styles.grid}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={styles.item}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <div className={styles.icon}>{ICONS[item.icon]}</div>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemValue}>
              {item.number}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default EmergencyContacts
