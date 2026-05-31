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
import styles from './Home.module.css'

const quickAccess = [
  { title: 'Galería', description: 'Momentos y espacios de la cabaña.', link: '/gallery' },
  { title: 'Reservar', description: 'Tu próxima escapada comienza aquí.', link: '/reserve' },
  { title: 'Conócenos', description: 'Descubre la esencia de nuestra cabaña.', link: '/conocenos' },
]

const galleryPreview = [
  { url: '/images/Area social.jpg', alt: 'Área Social y terraza' },
  { url: '/images/Fachada.jpg', alt: 'Fachada y entorno' },
  { url: '/images/Habitaciones.jpg', alt: 'Habitaciones' },
]

const aboutVilla = {
  description: 'A 3 horas de Bogotá, Villa de Leyva es uno de los pueblos más hermosos de Colombia, declarado monumento nacional. Calles empedradas, cielos despejados y paisajes que enamoran.',
  image: '/images/Fachada.jpg',
  link: '/about',
}

const knowUs = {
  subtitle: 'Somos anfitriones apasionados por ofrecer una estadía auténtica',
  description: 'Construimos esta cabaña con amor para compartirla contigo',
  image: '/images/Anfitriones.jpeg',
  link: '/conocenos',
}

const reviews = [
  {
    name: 'Ana María Jiménez',
    avatar: '/images/Mujer avatar.jpg',
    stars: 5,
    text: 'Nos gustó mucho la casa, muy cómoda y es un muy buen sitio para descansar, rodeado de naturaleza y cerca a todos los sitios turísticos. Mi familia quedó muy contenta, muchas gracias.',
  },
  {
    name: 'Carlos Roberto Mesa',
    avatar: '/images/Hombre avatar.jpg',
    stars: 5,
    text: 'Excelente, muy buena ubicación cerca del pueblo, las fotos iguales al sitio, todo impecable, comunicación muy buena. Recomendado.',
  },
]

function Home() {
  return (
    <main className={styles.home}>
      <RevealBlock variant="heroReveal">
        <Hero
          variant="home"
          subtitle="Cabaña Boutique"
          title="CAMALUNA"
          description="Escapa de la rutina y vive una experiencia única rodeada de naturaleza, tranquilidad y comodidad en Villa de Leyva."
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
        <CabinReserveCTA />
      </RevealBlock>

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </main>
  )
}

export default Home
