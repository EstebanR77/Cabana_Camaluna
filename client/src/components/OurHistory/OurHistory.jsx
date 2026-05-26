import { motion } from 'framer-motion'
import styles from './OurHistory.module.css'

function OurHistory({ title, paragraphs = [], image }) {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.text}
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className={styles.title}>{title}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className={styles.paragraph}>{p}</p>
        ))}
      </motion.div>

      <motion.div
        className={styles.img}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <img src={image} alt={title} />
      </motion.div>
    </section>
  )
}

export default OurHistory
