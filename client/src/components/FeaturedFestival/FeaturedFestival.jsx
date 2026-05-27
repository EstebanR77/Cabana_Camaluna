import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './FeaturedFestival.module.css'

function FeaturedFestival({ sectionTitle, image, ctaText, ctaLink, title, date, description }) {
  return (
    <section className={styles.wrap}>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.image}>
          <img src={image} alt={title} />
        </div>

        <div className={styles.content}>
          {ctaText && (
            <Link to={ctaLink} className={styles.cta}>{ctaText}</Link>
          )}
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.date}>{date}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </motion.div>
    </section>
  )
}

export default FeaturedFestival
