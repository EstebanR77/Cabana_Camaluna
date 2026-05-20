import { motion } from 'framer-motion'
import styles from './Reviews.module.css'

function Stars({ count }) {
  return <span className={styles.stars}>{'★'.repeat(count)}</span>
}

function Reviews({ reviews = [] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Experiencias y Reseñas</h2>
      <div className={styles.grid}>
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Stars count={review.stars} />
            <p className={styles.text}>"{review.text}"</p>
            <p className={styles.name}>— {review.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Reviews
