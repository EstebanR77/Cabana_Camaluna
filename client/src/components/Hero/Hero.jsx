import { Link, useLocation } from 'react-router-dom'
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

function Hero({ title, subtitle, description, bgImage, variant = 'default' }) {
  const { pathname } = useLocation()
  const heroImage = bgImage || HERO_IMAGES[pathname] || HERO_IMAGES['/']
  const showReservationCta = pathname !== '/reserve'

  const heroClass = [styles.hero, variant !== 'default' ? styles[variant] : '']
    .filter(Boolean)
    .join(' ')

  return (
    <section
      className={heroClass}
      style={{ '--hero-bg-image': `url('${heroImage}')` }}
    >
      <div className={styles.overlay} />
      <svg
        className={styles.waves}
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={`${styles.wave} ${styles.waveOne}`}
          d="M-70 185 C 180 115, 410 245, 650 178 S 1040 112, 1270 210"
        />
        <path
          className={`${styles.wave} ${styles.waveTwo}`}
          d="M-80 415 C 230 345, 485 475, 775 402 S 1060 342, 1280 438"
        />
      </svg>
      <svg
        className={styles.particles}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <circle className={styles.particle} cx="10" cy="30" r="0.22" style={{ '--duration': '7s', '--delay': '0s', '--drift': '12px' }} />
        <circle className={styles.particle} cx="22" cy="72" r="0.16" style={{ '--duration': '9s', '--delay': '1.2s', '--drift': '-9px' }} />
        <circle className={styles.particle} cx="35" cy="18" r="0.18" style={{ '--duration': '8s', '--delay': '2.1s', '--drift': '8px' }} />
        <circle className={styles.particle} cx="50" cy="48" r="0.24" style={{ '--duration': '7.5s', '--delay': '0.6s', '--drift': '13px' }} />
        <circle className={styles.particle} cx="68" cy="16" r="0.15" style={{ '--duration': '10s', '--delay': '1.8s', '--drift': '-8px' }} />
        <circle className={styles.particle} cx="78" cy="70" r="0.2" style={{ '--duration': '8.5s', '--delay': '0.3s', '--drift': '14px' }} />
        <circle className={styles.particle} cx="90" cy="36" r="0.17" style={{ '--duration': '9.5s', '--delay': '2.7s', '--drift': '-12px' }} />
      </svg>
      <svg
        className={styles.drawLine}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.drawLinePath}
          d="M0 82 C 180 36, 350 98, 545 70 S 910 26, 1200 76"
        />
      </svg>
      <div className={styles.content}>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {showReservationCta && (
          <Link className={styles.reserveLink} to="/reserve">
            {'Reserva tu estad\u00eda'}
          </Link>
        )}
      </div>
    </section>
  )
}

export default Hero
