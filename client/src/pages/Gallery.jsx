import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero   from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import styles from './Gallery.module.css'

const categories = ['Todas', 'Habitaciones', 'Área Social', 'Exteriores', 'Cocina']

const images = [
  { url: '/images/habitaciones.jpg',  alt: 'Habitación principal',    category: 'Habitaciones' },
  { url: '/images/area-social.jpg',   alt: 'Sala y comedor',          category: 'Área Social'  },
  { url: '/images/fachada.jpg',       alt: 'Fachada y jardín',        category: 'Exteriores'   },
  { url: '/images/anfitriones.jpg',   alt: 'Terraza exterior',        category: 'Exteriores'   },
  { url: '/images/villa-de-leyva.jpg',alt: 'Vista desde la cabaña',   category: 'Exteriores'   },
  { url: '/images/habitaciones.jpg',  alt: 'Segunda habitación',      category: 'Habitaciones' },
  { url: '/images/equipment.jpg',     alt: 'Cocina equipada',         category: 'Cocina'       },
  { url: '/images/gallery-social.jpg',alt: 'Área social y terraza',   category: 'Área Social'  },
  { url: '/images/gallery-facade.jpg',alt: 'Entorno natural',         category: 'Exteriores'   },
]

function Gallery() {
  const [active, setActive]     = useState('Todas')
  const [selected, setSelected] = useState(null)

  const filtered = active === 'Todas'
    ? images
    : images.filter(img => img.category === active)

  return (
    <div className={styles.page}>

      <RevealBlock variant="heroReveal">
      <Hero
        subtitle="Cabaña Boutique"
        title="Galería"
        description="Vive la cabaña antes de llegar."
      />
      </RevealBlock>

      {/* Filtros */}
      <RevealBlock as="section" className={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat}
            className={[styles.filterBtn, active === cat ? styles.filterActive : ''].join(' ')}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </RevealBlock>

      {/* Grid */}
      <RevealBlock as="section" className={styles.grid}>
        <AnimatePresence>
          {filtered.map((img, i) => (
            <motion.div
              key={img.alt + i}
              className={styles.item}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => setSelected(img)}
            >
              <img src={img.url} alt={img.alt} className={styles.img} />
              <div className={styles.imgOverlay}>
                <p className={styles.imgCaption}>{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </RevealBlock>

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
              initial={{ scale: 0.87 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.87 }}
              onClick={e => e.stopPropagation()}
            />
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </div>
  )
}

export default Gallery
