import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer/Footer'
import styles from './Gallery.module.css'

const categories = ['Todas', 'Habitaciones', 'Área Social', 'Exteriores', 'Cocina']

const images = [
  { url: '/images/habitaciones.jpg',  alt: 'Habitación principal',   category: 'Habitaciones' },
  { url: '/images/area-social.jpg',   alt: 'Sala y comedor',         category: 'Área Social'  },
  { url: '/images/fachada.jpg',       alt: 'Fachada y jardín',       category: 'Exteriores'   },
  { url: '/images/anfitriones.jpg',   alt: 'Terraza exterior',       category: 'Exteriores'   },
  { url: '/images/villa-de-leyva.jpg',alt: 'Vista desde la cabaña',  category: 'Exteriores'   },
  { url: '/images/habitaciones.jpg',  alt: 'Segunda habitación',     category: 'Habitaciones' },
]

function Gallery() {
  const [active, setActive]   = useState('Todas')
  const [selected, setSelected] = useState(null)

  const filtered = active === 'Todas' ? images : images.filter(img => img.category === active)

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Galería
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Lo que nos hace especiales en imágenes
        </motion.p>
      </section>

      {/* Filtros */}
      <section className={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat}
            className={[styles.filterBtn, active === cat ? styles.filterActive : ''].join(' ')}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid */}
      <section className={styles.grid}>
        <AnimatePresence>
          {filtered.map((img, i) => (
            <motion.div
              key={img.alt + i}
              className={styles.item}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              onClick={() => setSelected(img)}
            >
              <img src={img.url} alt={img.alt} className={styles.img} />
              <div className={styles.imgOverlay}>
                <p className={styles.imgCaption}>{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={selected.url}
              alt={selected.alt}
              className={styles.lightboxImg}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
            />
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Gallery
