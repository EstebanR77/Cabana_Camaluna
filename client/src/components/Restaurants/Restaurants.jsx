import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './Restaurants.module.css'

function Restaurants({ title, items = [], ctaText, ctaLink, mapEmbed, mapUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState('')
  const usesModal = ctaText?.toLowerCase().includes('ver mas')
  const previewItems = usesModal ? items.slice(0, 3) : items

  useEffect(() => {
    if (!hoveredItem) return undefined

    const timer = window.setTimeout(() => setHoveredItem(''), 1800)
    return () => window.clearTimeout(timer)
  }, [hoveredItem])

  useEffect(() => {
    if (!isModalOpen) return undefined

    const onKeyDown = event => {
      if (event.key === 'Escape') setIsModalOpen(false)
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isModalOpen])

  const getCtaClass = () => (
    [
      styles.cta,
      hoveredItem === 'cta' ? styles.ctaActive : '',
    ].filter(Boolean).join(' ')
  )

  const getModalItemClass = index => (
    [
      styles.modalItem,
      hoveredItem === `modal-card-${index}` ? styles.modalItemActive : '',
    ].filter(Boolean).join(' ')
  )

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid}>
        {previewItems.map((item, i) => {
          const motionProps = {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: i * 0.08 },
            viewport: { once: true },
          }

          const content = (
            <>
              <div className={styles.itemImg}>
                <img src={item.image} alt={item.title} />
              </div>
              <div className={styles.itemBody}>
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
            </>
          )

          if (item.href) {
            return (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`${styles.item} ${styles.itemLink}`}
                {...motionProps}
              >
                {content}
              </motion.a>
            )
          }

          return (
            <motion.div key={i} className={styles.item} {...motionProps}>
              {content}
            </motion.div>
          )
        })}
      </div>

      {ctaText && (
        <div className={styles.ctaWrap}>
          {usesModal ? (
            <button
              type="button"
              className={getCtaClass()}
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setHoveredItem('cta')}
              onMouseLeave={() => setHoveredItem('')}
              onFocus={() => setHoveredItem('cta')}
              onBlur={() => setHoveredItem('')}
            >
              {ctaText}
            </button>
          ) : (
            <Link to={ctaLink} className={styles.cta}>{ctaText}</Link>
          )}
        </div>
      )}

      {mapEmbed && (
        <a
          href={mapUrl || 'https://www.google.com/maps/search/?api=1&query=Villa+de+Leyva,+Boyac%C3%A1,+Colombia'}
          target="_blank"
          rel="noreferrer"
          className={styles.map}
          aria-label="Abrir mapa de Villa de Leyva en Google Maps"
        >
          <iframe
            src={mapEmbed}
            title=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
            aria-hidden="true"
          />
        </a>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            role="presentation"
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.24 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="restaurants-modal-title"
              onClick={event => event.stopPropagation()}
            >
              <button
                type="button"
                className={[
                  styles.modalClose,
                  hoveredItem === 'modal-close' ? styles.modalCloseActive : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setIsModalOpen(false)}
                onMouseEnter={() => setHoveredItem('modal-close')}
                onMouseLeave={() => setHoveredItem('')}
                onFocus={() => setHoveredItem('modal-close')}
                onBlur={() => setHoveredItem('')}
                aria-label="Cerrar modal"
              >
                x
              </button>

              <div className={styles.modalHeader}>
                <p className={styles.modalEyebrow}>Villa de Leyva</p>
                <h3 id="restaurants-modal-title" className={styles.modalTitle}>
                  Restaurantes recomendados
                </h3>
                <p className={styles.modalText}>
                  Sabores locales, espacios acogedores y opciones cercanas para completar tu visita.
                </p>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalGrid}>
                  {items.map((item, index) => {
                    const content = (
                      <>
                        <img src={item.image} alt={item.title} className={styles.modalImage} />
                        <div className={styles.modalItemBody}>
                          <h4 className={styles.modalItemTitle}>{item.title}</h4>
                          <p className={styles.modalItemDesc}>{item.desc}</p>
                        </div>
                      </>
                    )

                    if (item.href) {
                      return (
                        <a
                          key={item.title}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`${getModalItemClass(index)} ${styles.modalItemLink}`}
                          onMouseEnter={() => setHoveredItem(`modal-card-${index}`)}
                          onMouseLeave={() => setHoveredItem('')}
                          onFocus={() => setHoveredItem(`modal-card-${index}`)}
                          onBlur={() => setHoveredItem('')}
                        >
                          {content}
                        </a>
                      )
                    }

                    return (
                      <article key={item.title} className={styles.modalItem}>
                        {content}
                      </article>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Restaurants
