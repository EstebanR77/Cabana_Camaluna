import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './CabinEquipment.module.css'

const equipment = [
  { icon: 'wifi', label: 'Wifi' },
  { icon: 'restaurant', label: 'Cocina' },
  { icon: 'bathtub', label: '2 Baños' },
  { icon: 'bed', label: '2 Habitaciones' },
]

const allAmenities = [
  { icon: 'wifi', label: 'Wifi de alta velocidad' },
  { icon: 'restaurant', label: 'Cocina equipada' },
  { icon: 'bathtub', label: '2 baños completos' },
  { icon: 'bed', label: '2 habitaciones' },
  { icon: 'fireplace', label: 'Chimenea' },
  { icon: 'yard', label: 'Jardín privado' },
  { icon: 'local_parking', label: 'Parqueadero' },
  { icon: 'local_laundry_service', label: 'Lavadora' },
  { icon: 'tv', label: 'Smart TV' },
  { icon: 'coffee_maker', label: 'Cafetera' },
  { icon: 'shower', label: 'Agua caliente' },
  { icon: 'door_open', label: 'Acceso privado' },
]

function CabinEquipment({ active = false }) {
  const [showModal, setShowModal] = useState(false)
  const [hoveredItem, setHoveredItem] = useState('')
  const [hasActiveIntro, setHasActiveIntro] = useState(false)

  useEffect(() => {
    setHasActiveIntro(active)
  }, [active])

  useEffect(() => {
    if (!showModal) return

    const onKeyDown = event => {
      if (event.key === 'Escape') setShowModal(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showModal])

  const hoverClass = id => (
    [hoveredItem === id ? styles.isHovered : '', hasActiveIntro ? styles.isReady : '']
      .filter(Boolean)
      .join(' ')
  )

  const modalHoverClass = id => (
    hoveredItem === id ? styles.modalItemHovered : ''
  )

  return (
    <>
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.title}>Equipamiento</h2>

        <div className={styles.inner}>
          <div className={styles.photoContainer}>
            <div
              className={[styles.imageWrap, hoverClass('image')].filter(Boolean).join(' ')}
              onMouseEnter={() => setHoveredItem('image')}
              onMouseLeave={() => setHoveredItem('')}
              onFocus={() => setHoveredItem('image')}
              onBlur={() => setHoveredItem('')}
              tabIndex={0}
            >
              <img src="/images/Cabana.jpg" alt="Interior de la cabaña Camaluna" className={styles.image} />
            </div>
          </div>

          <div className={styles.amenitiesContainer}>
            <div className={styles.controlsCard}>
              <div className={styles.grid}>
                {equipment.map(({ icon, label }) => (
                  <button
                    type="button"
                    key={label}
                    className={[styles.item, hoverClass(label)].filter(Boolean).join(' ')}
                    onMouseEnter={() => setHoveredItem(label)}
                    onMouseLeave={() => setHoveredItem('')}
                    onFocus={() => setHoveredItem(label)}
                    onBlur={() => setHoveredItem('')}
                  >
                    <span className={styles.materialIcon} aria-hidden="true">{icon}</span>
                    <span className={styles.label}>{label}</span>
                  </button>
                ))}

                <button
                  type="button"
                  className={[styles.moreBtn, hoverClass('more')].filter(Boolean).join(' ')}
                  onClick={() => setShowModal(true)}
                  onMouseEnter={() => setHoveredItem('more')}
                  onMouseLeave={() => setHoveredItem('')}
                  onFocus={() => setHoveredItem('more')}
                  onBlur={() => setHoveredItem('')}
                >
                  <span className={styles.materialIcon} aria-hidden="true">add</span>
                  <span>Más comodidades</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

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
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={event => event.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
                aria-label="Cerrar comodidades"
              >
                <span className={styles.materialIcon} aria-hidden="true">close</span>
              </button>
              <h2 className={styles.modalTitle}>Todas las comodidades</h2>
              <div className={styles.modalGrid}>
                {allAmenities.map(item => {
                  const modalItemId = `modal-${item.label}`

                  return (
                    <div
                      key={item.label}
                      className={[styles.modalItem, modalHoverClass(modalItemId)].filter(Boolean).join(' ')}
                      onMouseEnter={() => setHoveredItem(modalItemId)}
                      onMouseLeave={() => setHoveredItem('')}
                      onFocus={() => setHoveredItem(modalItemId)}
                      onBlur={() => setHoveredItem('')}
                      tabIndex={0}
                    >
                    <span className={styles.modalIcon} aria-hidden="true">{item.icon}</span>
                    <span className={styles.modalLabel}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CabinEquipment
