import { motion } from 'framer-motion'
import styles from './ContactInfo.module.css'

const ICONS = {
  gavel: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4l6 6" />
      <path d="M11 7l6 6" />
      <path d="M9 9l-7 7 3 3 7-7" />
      <path d="M13 5l3-3 6 6-3 3" />
      <path d="M3 22h11" />
    </svg>
  ),
  mail: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  ),
  pin: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
}

function ContactInfo({ items = [] }) {
  return (
    <section className={styles.wrap}>
      {items.map((item, i) => {
        const content = (
          <>
            <div className={styles.icon}>{ICONS[item.icon]}</div>
            <div className={styles.body}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.value}>{item.value}</p>
            </div>
          </>
        )

        const motionProps = {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: i * 0.08 },
          viewport: { once: true },
        }

        if (item.href) {
          return (
            <motion.a
              key={i}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noreferrer' : undefined}
              className={`${styles.row} ${styles.rowLink}`}
              {...motionProps}
            >
              {content}
            </motion.a>
          )
        }

        return (
          <motion.div key={i} className={styles.row} {...motionProps}>
            {content}
          </motion.div>
        )
      })}
    </section>
  )
}

export default ContactInfo
