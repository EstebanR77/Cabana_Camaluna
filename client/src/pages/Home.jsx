import ReviewCard from '../components/ReviewCard/ReviewCard'
import Hero           from '../components/Hero/Hero'
import QuickAccess    from '../components/QuickAccess/QuickAccess'
import AboutVilla     from '../components/AboutVilla/AboutVilla'
import KnowUs         from '../components/KnowUs/KnowUs'
import ContactButtons from '../components/ContactButtons/ContactButtons'
import GalleryPreview from '../components/GalleryPreview/GalleryPreview'
import Reviews        from '../components/Reviews/Reviews'
import Footer         from '../components/Footer/Footer'
import styles         from './Home.module.css'

const quickAccess = [
  { title: 'Galería',    description: 'Momentos y espacios de la cabaña.',       link: '/gallery' },
  { title: 'Reservar',   description: 'Tu próxima escapada comienza aquí.',       link: '/reserve' },
  { title: 'Conócenos',  description: 'Descubre la esencia de nuestra cabaña.',   link: '#conocenos' },
]

const aboutVilla = {
  description: 'A 3 horas de Bogotá, Villa de Leyva es uno de los pueblos más hermosos de Colombia, declarado monumento nacional. Calles empedradas, cielos despejados y paisajes que enamoran.',
  image: '/images/villa.jpg',
  link: '/about',
}

const knowUs = {
  subtitle: 'Somos anfitriones apasionados por ofrecer una estadía auténtica',
  description: 'Construimos esta cabaña con amor para compartirla contigo',
  image: '/images/hosts.jpg',
  link: '/about',
}

const galleryPreview = [
  { url: '/images/gallery-social.jpg',   alt: 'Área Social y terraza'    },
  { url: '/images/gallery-facade.jpg',   alt: 'Fachada y entorno'        },
  { url: '/images/gallery-rooms.jpg',    alt: 'Habitaciones'             },
]

const reviews = [
  {
    name:  'Ana María Jiménez',
    stars: 5,
    text:  'Nos gustó mucho la casa, muy cómoda y en un muy buen sitio para descansar, rodeado de naturaleza y cerca a todos los sitios turísticos.',
  },
  {
    name:  'Carlos Roberto Mesa',
    stars: 5,
    text:  'Excelente, muy buena ubicación cerca del pueblo, las fotos iguales al sitio, todo impecable y comunicación muy buena.',
  },
]

function Home() {
  return (
    <main className={styles.home}>
      <Hero
        subtitle="Cabaña Boutique"
        title="CAMALUNA"
        description="Escapa de la rutina y vive una experiencia única rodeada de naturaleza, tranquilidad y comodidad en Villa de Leyva."
      />

      <QuickAccess items={quickAccess} />

      <GalleryPreview images={galleryPreview} />

      <section id="conocenos">
        <KnowUs
          subtitle={knowUs.subtitle}
          description={knowUs.description}
          image={knowUs.image}
          link={knowUs.link}
        />
      </section>

      <section id="resenas">
        <Reviews reviews={reviews} />
        <ReviewCard />
      </section>

      <AboutVilla
        description={aboutVilla.description}
        image={aboutVilla.image}
        link={aboutVilla.link}
      />

      <ContactButtons />

      <div className={styles.reserveWrap}>
        <a href="/reserve" className={styles.reserveButton}>RESERVA YA!</a>
      </div>

      <Footer />
    </main>
  )
}

export default Home
