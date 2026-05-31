import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './ContactButtons.module.css'

const CARDS = [
  { label: 'WhatsApp', sub: 'Estamos para ayudarte', href: 'https://wa.me/573107777579', color: 'whatsapp', external: true },
  { label: 'Teléfonos', sub: 'Llámanos', href: 'tel:+573107777579', color: 'telefono', external: true },
  { label: 'Preguntas Frecuentes', sub: 'Resolvemos tus dudas', href: '/contact', color: 'faq' },
  { label: 'Correo', sub: 'Escríbenos', href: 'mailto:info@camaluna.com', color: 'correo', external: true },
]

function ContactButtons() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    setActiveIndex(hoveredIndex)
  }, [hoveredIndex])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>¿Necesitas ayuda?</p>
        <h2 className={styles.heading}>Ayuda y Contacto</h2>
      </div>

      <div className={styles.grid}>
        {CARDS.map(({ label, sub, href, color, external }, i) => {
          const className = `${styles.card} ${styles[color]} ${activeIndex === i ? styles.cardActive : ''}`
          const handlers = {
            onMouseEnter: () => setHoveredIndex(i),
            onMouseLeave: () => setHoveredIndex(null),
            onFocus: () => setHoveredIndex(i),
            onBlur: () => setHoveredIndex(null),
          }

          if (external) {
            return (
              <a
                key={label}
                href={href}
                className={className}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                {...handlers}
              >
                <span className={styles.cardTitle}>{label}</span>
                <span className={styles.cardSub}>{sub}</span>
              </a>
            )
          }

          return (
            <Link key={label} to={href} className={className} {...handlers}>
              <span className={styles.cardTitle}>{label}</span>
              <span className={styles.cardSub}>{sub}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default ContactButtons
