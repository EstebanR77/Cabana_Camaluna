import { useEffect, useState } from 'react'
import Hero from '../components/Hero/Hero'
import QuickAccess from '../components/QuickAccess/QuickAccess'
import AboutVilla from '../components/AboutVilla/AboutVilla'
import KnowUs from '../components/KnowUs/KnowUs'
import ContactButtons from '../components/ContactButtons/ContactButtons'
import GalleryPreview from '../components/GalleryPreview/GalleryPreview'
import Reviews from '../components/Reviews/Reviews'
import Footer from '../components/Footer/Footer'
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
  link: '/about',
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

const revealKeys = [
  'hero',
  'quickAccess',
  'gallery',
  'knowUs',
  'reviews',
  'aboutVilla',
  'contact',
  'reserve',
  'footer',
]

function Home() {
  const [isReserveHovered, setIsReserveHovered] = useState(false)
  const [reserveHoverClass, setReserveHoverClass] = useState('')
  const [visibleSections, setVisibleSections] = useState([])

  useEffect(() => {
    setReserveHoverClass(isReserveHovered ? styles.reserveButtonActive : '')
  }, [isReserveHovered])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      setVisibleSections(revealKeys)
      return undefined
    }

    const blocks = document.querySelectorAll('[data-reveal-key]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const key = entry.target.getAttribute('data-reveal-key')
          setVisibleSections((current) => (
            current.includes(key) ? current : [...current, key]
          ))
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    blocks.forEach((block) => observer.observe(block))

    return () => observer.disconnect()
  }, [])

  const revealClass = (key, variant = '') => {
    const visibleClass = visibleSections.includes(key) ? styles.revealVisible : ''
    const variantClass = variant ? styles[variant] : ''

    return `${styles.revealBlock} ${visibleClass} ${variantClass}`
  }

  return (
    <main className={styles.home}>
      <div className={revealClass('hero', 'heroReveal')} data-reveal-key="hero">
        <Hero
          subtitle="Cabaña Boutique"
          title="CAMALUNA"
          description="Escapa de la rutina y vive una experiencia única rodeada de naturaleza, tranquilidad y comodidad en Villa de Leyva."
        />
      </div>

      <div className={revealClass('quickAccess')} data-reveal-key="quickAccess">
        <QuickAccess items={quickAccess} />
      </div>

      <div className={revealClass('gallery')} data-reveal-key="gallery">
        <GalleryPreview images={galleryPreview} />
      </div>

      <section id="conocenos" className={revealClass('knowUs')} data-reveal-key="knowUs">
        <KnowUs
          subtitle={knowUs.subtitle}
          description={knowUs.description}
          image={knowUs.image}
          link={knowUs.link}
        />
      </section>

      <section id="resenas" className={revealClass('reviews')} data-reveal-key="reviews">
        <Reviews reviews={reviews} />
      </section>

      <div className={revealClass('aboutVilla')} data-reveal-key="aboutVilla">
        <AboutVilla
          description={aboutVilla.description}
          image={aboutVilla.image}
          link={aboutVilla.link}
        />
      </div>

      <div className={revealClass('contact')} data-reveal-key="contact">
        <ContactButtons />
      </div>

      <div className={`${styles.reserveWrap} ${revealClass('reserve', 'reserveReveal')}`} data-reveal-key="reserve">
        <a
          href="/reserve"
          className={`${styles.reserveButton} ${reserveHoverClass}`}
          onMouseEnter={() => setIsReserveHovered(true)}
          onMouseLeave={() => setIsReserveHovered(false)}
          onFocus={() => setIsReserveHovered(true)}
          onBlur={() => setIsReserveHovered(false)}
        >
          RESERVA YA!
        </a>
      </div>

      <div className={revealClass('footer')} data-reveal-key="footer">
        <Footer />
      </div>
    </main>
  )
}

export default Home
