import { motion } from 'framer-motion'
import CabinReserveCTA from '../CabinReserveCTA/CabinReserveCTA'
import styles from './CtaBanner.module.css'

function CtaBanner({ title, subtitle }) {
  return (
    <section className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.ctaWrap}>
          <CabinReserveCTA />
        </div>
      </motion.div>
    </section>
  )
}

export default CtaBanner
