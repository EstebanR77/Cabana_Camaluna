import { useLocation } from 'react-router-dom'
import styles from './Hero.module.css'

const HERO_IMAGES = {
  '/': '/images/Fonfo home.jpeg',
  '/cabin': '/images/Cabana.jpg',
  '/reserve': '/images/Reservas.jpg',
  '/about': '/images/villa-de-leyva.svg',
  '/gallery': '/images/area-social.svg',
  '/experiences': '/images/villa-de-leyva.svg',
  '/contact': '/images/anfitriones.svg',
}

function Hero({ title, subtitle, description, bgImage }) {
  const { pathname } = useLocation()
  const heroImage = bgImage || HERO_IMAGES[pathname] || HERO_IMAGES['/']

  return (
    <section
      className={styles.hero}
      style={{ '--hero-bg-image': `url('${heroImage}')` }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </section>
  )
}

export default Hero
