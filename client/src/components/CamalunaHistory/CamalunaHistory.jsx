import { motion } from 'framer-motion'
import styles from './CamalunaHistory.module.css'

function CamalunaHistory({ title, subtitle, paragraphs = [], images = [] }) {
  return (
    <section className={styles.wrap}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
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
      </motion.div>
    </section>
  )
}

export default CamalunaHistory
