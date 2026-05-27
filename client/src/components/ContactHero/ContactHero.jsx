import { motion } from 'framer-motion'
import styles from './ContactHero.module.css'

function ContactHero({ title, subtitle }) {
  return (
    <section className={styles.hero}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </motion.div>
    </section>
  )
}

export default ContactHero
