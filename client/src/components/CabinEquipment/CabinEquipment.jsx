import { motion } from 'framer-motion'
import styles from './CabinEquipment.module.css'

const equipment = [
  { icon: '📶', label: 'Wifi' },
  { icon: '🍳', label: 'Cocina' },
  { icon: '🛁', label: '2 Baños' },
  { icon: '🛏️', label: '2 Habitaciones' },
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
    <section className={styles.section}>
      <h2 className={styles.title}>Equipamiento</h2>
      <div className={styles.grid}>
        {equipment.map((item, i) => (
          <motion.div
            key={i}
            className={styles.item}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            viewport={{ once: true }}
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
        ))}
      </div>
      <button className={styles.moreBtn} onClick={onMoreClick}>+ Más comodidades</button>
    </section>
  )
}

export default CabinEquipment
