import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './Adventures.module.css'

const ICONS = {
  foot: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="6" rx="1.4" ry="2" />
      <ellipse cx="12.5" cy="5" rx="1.2" ry="1.8" />
      <ellipse cx="16.5" cy="6" rx="1.2" ry="1.8" />
      <ellipse cx="19" cy="9" rx="1.2" ry="1.6" />
      <path d="M6 12c0-2 2-3 4-3 3 0 4 2 5.5 4 1.2 1.6 2.5 2 2.5 4 0 2-1.5 3-3.5 3-1.7 0-2.5-1-4-1s-2.5 1.2-4 1.2C5 20.2 4 19 4 17c0-2 2-3 2-5z" />
    </svg>
  ),
  bike: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  ),
  horse: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18s1-6 6-6c2 0 3 1 4 1s2-3 5-3c2 0 3 1 3 3v8" />
      <path d="M9 21v-3" />
      <path d="M18 21v-3" />
      <path d="M19 7l1-2" />
    </svg>
  ),
  parachute: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12a10 10 0 0 1 20 0" />
      <path d="M2 12l5 8 5-8" />
      <path d="M12 12l5 8 5-8" />
      <path d="M12 12v8" />
    </svg>
  ),
  tent: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20l9-16 9 16H3z" />
      <path d="M12 4v16" />
    </svg>
  ),
  atv: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17h12" />
      <path d="M8 10h6l3 5" />
      <path d="M8 10l-1 4" />
      <path d="M13 7h-3" />
    </svg>
  ),
  picnic: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6" />
      <path d="M9 5c0-2 1.5-3 3-3s3 1 3 3-3 3-3 3-3-1-3-3z" />
      <path d="M5 14h14l-2 6H7z" />
      <path d="M5 14l-1-3h16l-1 3" />
    </svg>
  ),
  drop: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z" />
    </svg>
  ),
}

function Adventures({ title, subtitle, items = [], ctaText, ctaLink }) {
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
              <div className={styles.itemImg}>
                <img src={item.image} alt={item.title} />
              </div>
              <div className={styles.itemBody}>
                <div className={styles.itemIcon}>{ICONS[item.icon]}</div>
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {ctaText && (
          <div className={styles.ctaWrap}>
            <Link to={ctaLink} className={styles.cta}>{ctaText}</Link>
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default Adventures
