import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer({ variant = 'default' }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    setActiveItem(hoveredItem)
  }, [hoveredItem])

  const socialItems = [
    {
      id: 'instagram',
      href: 'https://instagram.com/camaluna',
      name: 'Instagram',
      handle: '@camaluna',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      id: 'whatsapp',
      href: 'https://wa.me/573107777579',
      name: 'WhatsApp',
      handle: '3107777579',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      id: 'maps',
      href: 'https://maps.google.com/?q=CAMALUNA+Cabaña+Boutique+Villa+de+Leyva',
      name: 'Google Maps',
      handle: 'CAMALUNA Cabaña Boutique, Villa de Leyva, Boyacá',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ]

  return (
    <footer className={`${styles.footer} ${variant === 'reviews' ? styles.footerReviews : ''}`}>
      <div className={styles.socials}>
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`${styles.socialItem} ${activeItem === item.id ? styles.itemActive : ''}`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onFocus={() => setHoveredItem(item.id)}
            onBlur={() => setHoveredItem(null)}
          >
            {item.icon}
            <div>
              <p className={styles.socialName}>{item.name}</p>
              <p className={styles.socialHandle}>{item.handle}</p>
            </div>
          </a>
        ))}
      </div>

      <div className={styles.links}>
        <div className={styles.col}>
          <Link to="/#resenas">Reseñas</Link>
          <Link to="/contact">Preguntas Frecuentes</Link>
          <Link to="/contact">Números de Emergencia</Link>
        </div>
        <div className={styles.col}>
          <Link to="/reserve">Políticas de Reserva</Link>
          <Link to="/contact">Eventos Próximos</Link>
          <Link to="/reserve">Medios de Pago</Link>
        </div>
        <div className={styles.col}>
          <Link to="/about">Quienes Somos?</Link>
          <Link to="/cabin">Reglas de la casa</Link>
          <Link to="/cabin">Seguridad y Propiedad</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
