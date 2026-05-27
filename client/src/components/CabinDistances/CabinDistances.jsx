import { motion } from 'framer-motion'
import styles from './CabinDistances.module.css'

const distances = [
  { text: 'A solo 7 minutos del centro de Villa de Leyva' },
  { text: 'A 1:15 hrs de Tunja - Boyacá' },
  { text: 'A 3:15 hrs de Bogotá D.C.' },
]

const access = [
  { text: 'Bomberos → Villa de Leyva - Arcabuco' },
  { text: 'Calle 8 → Vía Villa de Leyva - Tunja' },
  { text: 'Carrera 12 → Vía Villa de Leyva - Moniquirá' },
]

function CabinDistances() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Distancias y Acceso</h2>
      <div className={styles.grid}>
        <motion.div
          className={styles.col}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className={styles.colTitle}>Distancia hasta la Cabaña</h3>
          {distances.map((d, i) => (
            <p key={i} className={styles.item}>📍 {d.text}</p>
          ))}
          <h3 className={styles.colTitle} style={{ marginTop: '1.5rem' }}>Acceso</h3>
          {access.map((a, i) => (
            <p key={i} className={styles.item}>🚗 {a.text}</p>
          ))}
        </motion.div>
        <motion.div
          className={styles.mapPlaceholder}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p>🗺️ Mapa próximamente</p>
        </motion.div>
      </div>
    </section>
  )
}

export default CabinDistances
