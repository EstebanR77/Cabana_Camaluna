import { motion } from 'framer-motion'
import styles from './Weather.module.css'

function Weather({ title, paragraphs = [], images = [], tip }) {
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
          <div className={styles.text}>
            {paragraphs.map((p, i) => (
              <p key={i} className={styles.paragraph}>{p}</p>
            ))}
          </div>

          <div className={styles.images}>
            {images.map((img, i) => (
              <div key={i} className={styles.imageCard}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>

        {tip && (
          <div className={styles.tip}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
            </svg>
            <span>{tip}</span>
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default Weather
