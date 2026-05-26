import { useEffect, useState } from 'react'
import styles from './ContactButtons.module.css'

const CARDS = [
  { label: 'WhatsApp', sub: 'Estamos para ayudarte', href: 'https://wa.me/573107777579', color: 'whatsapp' },
  { label: 'Teléfonos', sub: 'Llámanos', href: 'tel:+573107777579', color: 'telefono' },
  { label: 'Preguntas Frecuentes', sub: 'Resolvemos tus dudas', href: '/contact', color: 'faq' },
  { label: 'Correo', sub: 'Escríbenos', href: 'mailto:info@camaluna.com', color: 'correo' },
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
        {CARDS.map(({ label, sub, href, color }, i) => (
          <a
            key={label}
            href={href}
            className={`${styles.card} ${styles[color]} ${activeIndex === i ? styles.cardActive : ''}`}
            target={href.startsWith('http') ? '_blank' : '_self'}
            rel="noreferrer"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
          >
            <span className={styles.cardTitle}>{label}</span>
            <span className={styles.cardSub}>{sub}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default ContactButtons
