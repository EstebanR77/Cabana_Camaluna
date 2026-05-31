import { motion } from 'framer-motion'
import styles from './ConocenosHero.module.css'

function ConocenosHero({ title, subtitle, image }) {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.overlay} />
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </motion.div>
    </section>
  )
}

export default ConocenosHero
