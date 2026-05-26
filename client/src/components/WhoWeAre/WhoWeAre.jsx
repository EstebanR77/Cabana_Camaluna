import { motion } from 'framer-motion'
import styles from './WhoWeAre.module.css'

const ICONS = {
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
}

function WhoWeAre({ title, image, blocks = [], tags = [] }) {
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

        <div className={styles.grid}>
          <div className={styles.img}>
            <img src={image} alt={title} />
          </div>

          <div className={styles.text}>
            {blocks.map((b, i) => (
              <div key={i}>
                <h3 className={styles.subhead}>{b.title}</h3>
                <p className={styles.paragraph}>{b.body}</p>
              </div>
            ))}

            <div className={styles.tags}>
              {tags.map((t, i) => (
                <span key={i} className={styles.tag}>
                  {ICONS[t.icon]}
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default WhoWeAre
