import { motion } from 'framer-motion'
import styles from './CabinEquipment.module.css'

const equipment = [
  { icon: '📶', label: 'Wifi' },
  { icon: '🍳', label: 'Cocina' },
  { icon: '🛁', label: '2 Baños' },
  { icon: '🛏️', label: '2 Habitaciones' },
]

function CabinEquipment({ onMoreClick }) {
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
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>+ {item.label}</span>
          </motion.div>
        ))}
      </div>
      <button className={styles.moreBtn} onClick={onMoreClick}>+ Más comodidades</button>
    </section>
  )
}

export default CabinEquipment
