import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './KnowUs.module.css'

function KnowUs({ title, subtitle, description, image, link }) {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.card}>
          <p className={styles.description}>{description}</p>
          <Link to={link} className={styles.link}>Conócenos →</Link>
        </div>
      </motion.div>
      <motion.img
        src={image}
        alt="Anfitriones Camaluna"
        className={styles.image}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true, amount: 0.3 }}
      />
    </section>
  )
}

export default KnowUs
