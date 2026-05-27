import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './Restaurants.module.css'

function Restaurants({ title, items = [], ctaText, ctaLink }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState('')
  const usesModal = ctaText?.toLowerCase().includes('ver mas')

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

  const getModalActionClass = index => (
    [
      styles.modalAction,
      hoveredItem === `modal-action-${index}` ? styles.modalActionActive : '',
    ].filter(Boolean).join(' ')
  )

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid}>
        {items.map((item, i) => {
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

              <div className={styles.modalGrid}>
                {items.map((item, index) => (
                  <article key={item.title} className={styles.modalItem}>
                    <img src={item.image} alt={item.title} className={styles.modalImage} />
                    <div className={styles.modalItemBody}>
                      <h4 className={styles.modalItemTitle}>{item.title}</h4>
                      <p className={styles.modalItemDesc}>{item.desc}</p>
                      {item.href && (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className={getModalActionClass(index)}
                          onMouseEnter={() => setHoveredItem(`modal-action-${index}`)}
                          onMouseLeave={() => setHoveredItem('')}
                          onFocus={() => setHoveredItem(`modal-action-${index}`)}
                          onBlur={() => setHoveredItem('')}
                        >
                          Ver restaurante
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Restaurants
