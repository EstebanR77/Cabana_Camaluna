import { motion } from 'framer-motion'
import styles from './CabinDistances.module.css'

const mapsUrl = 'https://maps.app.goo.gl/yQYv2p9FVsxKbKev7'
const embedMapUrl = 'https://www.google.com/maps?q=CAMALUNA%20Cabana%20Boutique%20Villa%20de%20Leyva&output=embed'

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
          onMouseEnter={() => setHoveredItem('map')}
          onMouseLeave={() => setHoveredItem('')}
          onFocus={() => setHoveredItem('map')}
          onBlur={() => setHoveredItem('')}
        >
          <iframe
            src={embedMapUrl}
            title="Mapa de Camaluna Cabana Boutique"
            className={styles.mapFrame}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.mapLink}
            aria-label="Abrir ubicacion de Camaluna en Google Maps"
          />
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
