import { useEffect } from 'react'
import Hero from '../components/Hero/Hero'
import CabinIntroCards from '../components/CabinIntroCards/CabinIntroCards'
import CabinEquipment from '../components/CabinEquipment/CabinEquipment'
import CabinRules from '../components/CabinRules/CabinRules'
import CabinVideo from '../components/CabinVideo/CabinVideo'
import CabinDistances from '../components/CabinDistances/CabinDistances'
import Footer from '../components/Footer/Footer'
import styles from './Cabin.module.css'

function Cabin() {
  useEffect(() => {
    document.documentElement.classList.add('cabin-page-active')
    document.body.classList.add('cabin-page-active')
    document.documentElement.scrollLeft = 0
    document.body.scrollLeft = 0
    window.scrollTo({ left: 0, top: window.scrollY })

    return () => {
      document.documentElement.classList.remove('cabin-page-active')
      document.body.classList.remove('cabin-page-active')
    }
  }, [])

  return (
    <div className={styles.page}>
      <Hero
        subtitle="Cabaña Boutique"
        title="LA CABAÑA"
        description="Conoce cada espacio, sus comodidades y todo lo que necesitas para disfrutar una estadía única en medio de la naturaleza."
      />
      </RevealBlock>

      {/* Reglas de la Casa */}
      <RevealBlock>
        <CabinRules />
      </RevealBlock>

      {/* Equipamiento — bg #969f74 */}
      <RevealBlock as="section" className={styles.equipment}>
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
      </RevealBlock>

      {/* Video Recorrido */}
      <RevealBlock>
        <CabinVideo videoUrl="" />
      </RevealBlock>

      {/* Distancias */}
      <RevealBlock>
        <CabinDistances />
      </RevealBlock>

      {/* CTA RESERVA YA */}
      <RevealBlock className={styles.ctaBlock} variant="reserveReveal">
        <Link to="/reserve" className={styles.ctaBtn}>RESERVA YA!</Link>
      </RevealBlock>

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

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </div>
  )
}

export default Cabin
