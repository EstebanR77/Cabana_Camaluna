import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Hero          from '../components/Hero/Hero'
import CabinRules    from '../components/CabinRules/CabinRules'
import CabinVideo    from '../components/CabinVideo/CabinVideo'
import CabinDistances from '../components/CabinDistances/CabinDistances'
import Footer        from '../components/Footer/Footer'
import styles        from './Cabin.module.css'

const equipment = [
  { icon: '📶', label: 'Wifi'            },
  { icon: '🍳', label: 'Cocina'          },
  { icon: '🛁', label: '2 Baños'         },
  { icon: '🛏️', label: '2 Habitaciones'  },
]

const allAmenities = [
  { icon: '📶', label: 'Wifi de alta velocidad' },
  { icon: '🍳', label: 'Cocina equipada'         },
  { icon: '🛁', label: '2 Baños completos'       },
  { icon: '🛏️', label: '2 Habitaciones'          },
  { icon: '🔥', label: 'Chimenea'                },
  { icon: '🌿', label: 'Jardín privado'          },
  { icon: '🅿️', label: 'Parqueadero'             },
  { icon: '🧺', label: 'Lavadora'                },
  { icon: '📺', label: 'Smart TV'                },
  { icon: '☕', label: 'Cafetera'                },
  { icon: '🌡️', label: 'Agua caliente'           },
  { icon: '🔐', label: 'Acceso privado'          },
]

function Cabin() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className={styles.page}>

      {/* Hero */}
      <Hero
        subtitle="Cabaña Boutique"
        title="LA CABAÑA"
        description="Conoce cada espacio, sus comodidades y todo lo que necesitas para disfrutar una estadía única en medio de la naturaleza."
        bgImage="/images/cabin-hero.jpg"
      />

      {/* Reglas de la Casa */}
      <CabinRules />

      {/* Equipamiento — bg #969f74 */}
      <section className={styles.equipment}>
        <h2 className={styles.equipTitle}>Equipamiento</h2>
        <div className={styles.equipInner}>
          <div className={styles.equipImg}>
            <img src="/images/equipment.jpg" alt="Interior cabaña" />
          </div>
          <div className={styles.equipItems}>
            {equipment.map(({ icon, label }) => (
              <div key={label} className={styles.equipCard}>
                <span className={styles.equipIcon}>{icon}</span>
                <span className={styles.equipLabel}>{label}</span>
              </div>
            ))}
            <button className={styles.equipMore} onClick={() => setShowModal(true)}>
              + Más comodidades
            </button>
          </div>
        </div>
      </section>

      {/* Video Recorrido */}
      <CabinVideo videoUrl="" />

      {/* Distancias */}
      <CabinDistances />

      {/* CTA RESERVA YA */}
      <div className={styles.ctaBlock}>
        <Link to="/reserve" className={styles.ctaBtn}>RESERVA YA!</Link>
      </div>

      {/* Modal comodidades */}
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
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
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
