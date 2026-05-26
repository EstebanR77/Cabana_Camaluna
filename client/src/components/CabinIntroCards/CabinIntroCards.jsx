import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './CabinIntroCards.module.css'

const introCards = [
  {
    icon: 'cabin',
    title: 'Cabaña Boutique Camaluna',
    text: 'Acomodación campestre, con capacidad para seis personas, ubicada en una zona tranquila de Villa de Leyva. Es un espacio cómodo para descansar, cocinar, compartir y vivir la calma del paisaje boyacense.',
  },
  {
    icon: 'weekend',
    title: 'Espacios para disfrutar',
    text: 'Cuenta con cocina equipada, sala comedor, dos habitaciones, dos baños, zona social, parqueadero y espacios exteriores para disfrutar la montaña con privacidad.',
  },
]

function CabinIntroCards() {
  const [hoveredCard, setHoveredCard] = useState('')
  const [activeCard, setActiveCard] = useState('')

  useEffect(() => {
    setActiveCard(hoveredCard)
  }, [hoveredCard])

  return (
    <section className={styles.section} aria-label="Resumen de la cabaña">
      <div className={styles.grid}>
        {introCards.map((card, index) => (
          <motion.article
            key={card.title}
            className={[styles.card, activeCard === card.title ? styles.cardHovered : ''].filter(Boolean).join(' ')}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredCard(card.title)}
            onMouseLeave={() => setHoveredCard('')}
            onFocus={() => setHoveredCard(card.title)}
            onBlur={() => setHoveredCard('')}
            tabIndex={0}
          >
            <span className={styles.icon} aria-hidden="true">{card.icon}</span>
            <div className={styles.content}>
              <h2 className={styles.title}>{card.title}</h2>
              <p className={styles.text}>{card.text}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default CabinIntroCards
