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
  { title: 'Conócenos',  description: 'Descubre la esencia de nuestra cabaña.',   link: '/about'   },
]

const aboutVilla = {
  description: 'A 3 horas de Bogotá, Villa de Leyva es uno de los pueblos más hermosos de Colombia, declarado monumento nacional. Calles empedradas, cielos despejados y paisajes que enamoran.',
  image: '/images/villa.jpg',
  link: '/about',
}

const knowUs = {
  subtitle: 'Somos anfitriones apasionados por ofrecer una estadía auténtica.',
  description: 'Construimos esta cabaña con amor para compartirla contigo y ofrecerte una experiencia única en medio de la naturaleza de Villa de Leyva.',
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
    text:  'Una experiencia increíble. La cabaña es hermosa y los anfitriones son muy amables. Definitivamente volveremos.',
  },
  {
    name:  'Carlos Rodríguez Meza',
    stars: 5,
    text:  'El lugar perfecto para descansar. La naturaleza, la tranquilidad y la calidez del lugar lo hacen único.',
  },
]

function Home() {
  return (
    <div className={styles.home}>

      <Hero
        subtitle="Cabaña Boutique"
        title="CAMALUNA"
        description="Escapa de la rutina y vive una experiencia única rodeada de naturaleza en Villa de Leyva."
      />

      <QuickAccess items={quickAccess} />

      <AboutVilla
        description={aboutVilla.description}
        image={aboutVilla.image}
        link={aboutVilla.link}
      />

      <KnowUs
        subtitle={knowUs.subtitle}
        description={knowUs.description}
        image={knowUs.image}
        link={knowUs.link}
      />

      <ContactButtons />

      <GalleryPreview images={galleryPreview} />

      <Reviews reviews={reviews} />

      <Footer />
    </div>
  )
}

export default Home
