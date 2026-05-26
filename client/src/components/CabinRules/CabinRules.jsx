import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './CabinRules.module.css'

const rules = [
  { icon: 'smoke_free', title: 'No fumar', text: 'No fumar dentro de espacios cerrados' },
  { icon: 'event_available', title: 'Check-in', text: 'Horario de check-in y check-out establecido.' },
  { icon: 'groups', title: 'Huespedes', text: 'Ingreso exclusivo para huespedes registrados en la reservacion.' },
]

function CabinRules() {
  const [hoveredRule, setHoveredRule] = useState('')

  useEffect(() => {
    if (!hoveredRule) return undefined

    const timer = window.setTimeout(() => setHoveredRule(''), 2000)
    return () => window.clearTimeout(timer)
  }, [hoveredRule])

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Reglas de la Casa</h2>
      <div className={styles.grid}>
        {rules.map((rule, i) => (
          <motion.article
            key={rule.title}
            className={[styles.card, hoveredRule === rule.title ? styles.hovered : ''].filter(Boolean).join(' ')}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredRule(rule.title)}
            onMouseLeave={() => setHoveredRule('')}
            onFocus={() => setHoveredRule(rule.title)}
            onBlur={() => setHoveredRule('')}
            tabIndex={0}
          >
            <span className={styles.icon} aria-hidden="true">{rule.icon}</span>
            <p className={styles.text}>{rule.text}</p>
          </motion.article>
        ))}
      </div>
      <a
        className={styles.moreRules}
        href="/docs/reglas_camaluna.pdf"
        download="reglas_camaluna.pdf"
      >
        Conocer mas reglas
      </a>
    </section>
  )
}

export default CabinRules
