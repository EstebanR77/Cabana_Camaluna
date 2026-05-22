import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CabinRules     from '../components/CabinRules/CabinRules'
import CabinEquipment from '../components/CabinEquipment/CabinEquipment'
import CabinVideo     from '../components/CabinVideo/CabinVideo'
import CabinDistances from '../components/CabinDistances/CabinDistances'
import Footer         from '../components/Footer/Footer'
import styles         from './Cabin.module.css'

const allAmenities = [
  { icon: '📶', label: 'Wifi de alta velocidad' },
  { icon: '🍳', label: 'Cocina equipada' },
  { icon: '🛁', label: '2 Baños completos' },
  { icon: '🛏️', label: '2 Habitaciones' },
  { icon: '🔥', label: 'Chimenea' },
  { icon: '🌿', label: 'Jardín privado' },
  { icon: '🅿️', label: 'Parqueadero' },
  { icon: '🧺', label: 'Lavadora' },
  { icon: '📺', label: 'Smart TV' },
  { icon: '☕', label: 'Cafetera' },
  { icon: '🌡️', label: 'Agua caliente' },
  { icon: '🔐', label: 'Acceso privado' },
]

function Cabin() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          La Cabaña
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Siente este espacio, sus comodidades y todo lo que necesitas para disfrutar una estadía tranquila y cómoda en medio de la naturaleza.
        </motion.p>
      </section>

      <section className={styles.scrollSection}>
        <CabinRules />
      </section>

      <section className={styles.scrollSection}>
        <CabinEquipment onMoreClick={() => setShowModal(true)} />
      </section>

      <section className={styles.scrollSection}>
        <CabinVideo videoUrl="" />
      </section>

      <section className={styles.scrollSection}>
        <CabinDistances />
      </section>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
              <h2 className={styles.modalTitle}>Todas las comodidades</h2>
              <div className={styles.modalGrid}>
                {allAmenities.map((item, i) => (
                  <div key={i} className={styles.modalItem}>
                    <span className={styles.modalIcon}>{item.icon}</span>
                    <span className={styles.modalLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Cabin
