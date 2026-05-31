import Hero from '../components/Hero/Hero'
import CabinReserveCTA from '../components/CabinReserveCTA/CabinReserveCTA'
import QuickAccess from '../components/QuickAccess/QuickAccess'
import AboutVilla from '../components/AboutVilla/AboutVilla'
import KnowUs from '../components/KnowUs/KnowUs'
import ContactButtons from '../components/ContactButtons/ContactButtons'
import GalleryPreview from '../components/GalleryPreview/GalleryPreview'
import Reviews from '../components/Reviews/Reviews'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import { aboutVilla, galleryPreview, knowUs, quickAccess, reviews } from '../data/homeData'
import styles from './Home.module.css'

function Home() {
  return (
    <main className={styles.home}>
      <RevealBlock variant="heroReveal">
        <Hero
          variant="home"
          subtitle={'Caba\u00f1a Boutique'}
          title="CAMALUNA"
          description={'Escapa de la rutina y vive una experiencia \u00fanica rodeada de naturaleza, tranquilidad y comodidad en Villa de Leyva.'}
        />
      </RevealBlock>

      <RevealBlock>
        <QuickAccess items={quickAccess} />
      </RevealBlock>

      <RevealBlock>
        <GalleryPreview images={galleryPreview} />
      </RevealBlock>

      <RevealBlock as="section" id="conocenos">
        <KnowUs
          subtitle={knowUs.subtitle}
          description={knowUs.description}
          image={knowUs.image}
          link={knowUs.link}
        />
      </RevealBlock>

      <RevealBlock as="section" id="resenas">
        <Reviews reviews={reviews} />
      </RevealBlock>

      <RevealBlock>
        <AboutVilla
          description={aboutVilla.description}
          image={aboutVilla.image}
          link={aboutVilla.link}
        />
      </RevealBlock>

      <RevealBlock>
        <ContactButtons />
      </RevealBlock>

      <RevealBlock variant="reserveReveal">
        <CabinReserveCTA centered />
      </RevealBlock>

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </main>
  )
}

export default Home
