import { motion } from 'framer-motion'
import styles from './ContactButtons.module.css'

function ContactButtons({ buttons = [] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Ayuda y Contacto</h2>
      <p className={styles.subtitle}>¿En qué podemos ayudarte?</p>
      <div className={styles.grid}>
        {buttons.map((btn, i) => (
          <motion.a
            key={i}
            href={btn.href}
            className={styles.btn}
            target={btn.href.startsWith('http') ? '_blank' : '_self'}
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className={styles.icon}>{btn.icon}</span>
            <span className={styles.label}>{btn.label}</span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

export default ContactButtons
