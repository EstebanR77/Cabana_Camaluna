import { useEffect } from 'react'
import Hero from '../components/Hero/Hero'
import CabinIntroCards from '../components/CabinIntroCards/CabinIntroCards'
import CabinEquipment from '../components/CabinEquipment/CabinEquipment'
import CabinRules from '../components/CabinRules/CabinRules'
import CabinVideo from '../components/CabinVideo/CabinVideo'
import CabinDistances from '../components/CabinDistances/CabinDistances'
import CabinReserveCTA from '../components/CabinReserveCTA/CabinReserveCTA'
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
        subtitle="Cabana Boutique"
        title="LA CABANA"
        description="Conoce cada espacio, sus comodidades y todo lo que necesitas para disfrutar una estadia unica en medio de la naturaleza."
      />

      <section className={styles.content}>
        <CabinIntroCards />
        <div className={styles.equipmentPanel}>
          <CabinEquipment active />
          <CabinRules />
        </div>
        <CabinVideo videoUrl="/Videos/Video_Recorrido.mp4" />
        <CabinDistances />
        <CabinReserveCTA centered />
      </section>

      <Footer />
    </div>
  )
}

export default Cabin
