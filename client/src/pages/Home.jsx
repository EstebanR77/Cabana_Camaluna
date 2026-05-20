import Hero           from '../components/Hero/Hero'
import QuickAccess    from '../components/QuickAccess/QuickAccess'
import AboutVilla     from '../components/AboutVilla/AboutVilla'
import KnowUs         from '../components/KnowUs/KnowUs'
import ContactButtons from '../components/ContactButtons/ContactButtons'
import GalleryPreview from '../components/GalleryPreview/GalleryPreview'
import Reviews        from '../components/Reviews/Reviews'
import Footer         from '../components/Footer/Footer'
import styles         from './Home.module.css'

import {
  quickAccess,
  aboutVilla,
  knowUs,
  contactButtons,
  galleryPreview,
  reviews,
} from '../data/homeData'

function Home() {
  return (
    <div className={styles.home}>

      <section className={styles.scrollSection}>
        <Hero
          title="CAMALUNA"
          description="Visita de la Calzada y 7 km una experiencia única en CAMALUNA, Donde la tranquilidad y naturaleza se unen para ti."
          ctaText="Reserva Ya"
          ctaLink="/reserve"
        />
      </section>

      <section className={styles.scrollSection}>
        <QuickAccess items={quickAccess} />
      </section>

      <section className={styles.scrollSection}>
        <AboutVilla
          title={aboutVilla.title}
          description={aboutVilla.description}
          image={aboutVilla.image}
          link={aboutVilla.link}
        />
      </section>

      <section className={styles.scrollSection}>
        <KnowUs
          title={knowUs.title}
          subtitle={knowUs.subtitle}
          description={knowUs.description}
          image={knowUs.image}
          link={knowUs.link}
        />
      </section>

      <section className={styles.scrollSection}>
        <ContactButtons buttons={contactButtons} />
      </section>

      <section className={styles.scrollSection}>
        <GalleryPreview images={galleryPreview} />
      </section>

      <section className={styles.scrollSection}>
        <Reviews reviews={reviews} />
      </section>

      <Footer />
    </div>
  )
}

export default Home
