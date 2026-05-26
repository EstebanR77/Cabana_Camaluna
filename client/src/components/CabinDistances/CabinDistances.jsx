import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './CabinDistances.module.css'

const distances = [
  { icon: 'near_me', text: 'A solo 7 minutos del centro de Villa de Leyva' },
  { icon: 'location_city', text: 'A 1:15 horas de Tunja, Boyacá' },
  { icon: 'travel_explore', text: 'A 3:15 horas de Bogotá D.C.' },
]

const access = [
  { icon: 'route', text: 'Bomberos - Vía Villa de Leyva - Arcabuco' },
  { icon: 'route', text: 'Calle 8 - Vía Villa de Leyva - Tunja' },
  { icon: 'route', text: 'Carrera 12 - Vía Villa de Leyva - Moniquirá' },
]

function CabinDistances() {
  const [hoveredItem, setHoveredItem] = useState('')

  useEffect(() => {
    if (!hoveredItem) return undefined

    const timer = window.setTimeout(() => setHoveredItem(''), 2200)
    return () => window.clearTimeout(timer)
  }, [hoveredItem])

  const itemClass = id => (
    [styles.item, hoveredItem === id ? styles.hoveredItem : ''].filter(Boolean).join(' ')
  )

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Distancias y Acceso</h2>
      <div className={styles.grid}>
        <motion.div
          className={[styles.mapPlaceholder, hoveredItem === 'map' ? styles.mapHovered : ''].filter(Boolean).join(' ')}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          onMouseEnter={() => setHoveredItem('map')}
          onMouseLeave={() => setHoveredItem('')}
          onFocus={() => setHoveredItem('map')}
          onBlur={() => setHoveredItem('')}
          tabIndex={0}
        >
          <span className={styles.mapPinIcon} aria-hidden="true">location_on</span>
          <span className={styles.mapPin}>Camaluna</span>
        </motion.div>

        <motion.div
          className={styles.col}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
        >
          <h3 className={styles.colTitle}>Distancia hasta la cabaña</h3>
          {distances.map(item => (
            <p
              key={item.text}
              className={itemClass(item.text)}
              onMouseEnter={() => setHoveredItem(item.text)}
              onMouseLeave={() => setHoveredItem('')}
            >
              <span className={styles.materialIcon} aria-hidden="true">{item.icon}</span>
              {item.text}
            </p>
          ))}
          <h3 className={styles.colTitle}>Acceso</h3>
          {access.map(item => (
            <p
              key={item.text}
              className={itemClass(item.text)}
              onMouseEnter={() => setHoveredItem(item.text)}
              onMouseLeave={() => setHoveredItem('')}
            >
              <span className={styles.materialIcon} aria-hidden="true">{item.icon}</span>
              {item.text}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CabinDistances
