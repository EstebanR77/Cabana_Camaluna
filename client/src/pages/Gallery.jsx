import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from '../components/Hero/Hero'
import CabinReserveCTA from '../components/CabinReserveCTA/CabinReserveCTA'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import styles from './Gallery.module.css'

const categories = ['Área Social', 'Habitaciones', 'Baños', 'Exterior', 'Cocina']

const galleryImages = [
  {
    url: '/images/AreaSocial1.jpg',
    alt: 'Área social principal',
    category: 'Área Social',
    layout: 'entrance',
  },
  {
    url: '/images/Habitacion1 (1).jpg',
    alt: 'Habitación con vista natural',
    category: 'Habitaciones',
    layout: 'bedroom',
  },
  {
    url: '/images/Exterioir1.jpg',
    alt: 'Exterior de la cabaña',
    category: 'Exterior',
    layout: 'detail',
  },
  {
    url: '/images/Exterior2.jpg',
    alt: 'Fachada exterior',
    category: 'Exterior',
    layout: 'terrace',
  },
  {
    url: '/images/Baño1.jpg',
    alt: 'Baño artesanal',
    category: 'Baños',
    layout: 'bath',
  },
  {
    url: '/images/AreaSocial2.jpg',
    alt: 'Sala y comedor',
    category: 'Área Social',
    layout: 'social',
  },
  {
    url: '/images/AreaSocial3.jpg',
    alt: 'Sala de descanso',
    category: 'Área Social',
    layout: 'sofa',
  },
  {
    url: '/images/Habitacion2 (1).jpg',
    alt: 'Habitación acogedora',
    category: 'Habitaciones',
    layout: 'pet',
  },
  {
    url: '/images/Cocina Y AreaSocial.jpg',
    alt: 'Cocina equipada',
    category: 'Cocina',
    layout: 'kitchen',
  },
  {
    url: '/images/Habitacion3.jpg',
    alt: 'Habitación principal',
    category: 'Habitaciones',
    layout: 'stairs',
  },
  {
    url: '/images/Baño2.jpg',
    alt: 'Baño moderno',
    category: 'Baños',
    layout: 'door',
  },
  {
    url: '/images/Baño3.jpg',
    alt: 'Baño detallado',
    category: 'Baños',
    layout: 'extra1',
  },
  {
    url: '/images/Cocina1 (2).jpg',
    alt: 'Cocina',
    category: 'Cocina',
    layout: 'extra2',
  },
  {
    url: '/images/Cocina2.jpg',
    alt: 'Cocina espaciosa',
    category: 'Cocina',
    layout: 'extra3',
  },
  {
    url: '/images/Cocina3.jpg',
    alt: 'Detalle de cocina',
    category: 'Cocina',
    layout: 'extra4',
  },
]

function Gallery() {
  const [active, setActive] = useState('')
  const [selected, setSelected] = useState(null)
  const [hoveredItem, setHoveredItem] = useState('')

  useEffect(() => {
    if (!hoveredItem) return undefined

    const timer = window.setTimeout(() => setHoveredItem(''), 1800)
    return () => window.clearTimeout(timer)
  }, [hoveredItem])

  const filtered = !active
    ? galleryImages
    : galleryImages.filter(image => image.category === active)

  const getFilterClass = category => (
    [
      styles.filterBtn,
      active === category ? styles.filterActive : '',
      hoveredItem === `filter-${category}` ? styles.filterHovered : '',
    ].filter(Boolean).join(' ')
  )

  const getItemClass = image => (
    [
      styles.item,
      !active ? styles[image.layout] : styles.filteredItem,
      hoveredItem === image.alt ? styles.itemHovered : '',
    ].filter(Boolean).join(' ')
  )

  return (
    <div className={styles.page}>

      <RevealBlock variant="heroReveal">
      <Hero
        variant="gallery"
        subtitle="Cabaña Boutique"
        title="Galería"
        description="Vive la cabaña antes de llegar."
        bgImage="/images/Galeria.jpg"
      />
      </RevealBlock>

      {/* Filtros */}
      <RevealBlock as="section" className={styles.filters}>
        {categories.map(category => (
          <button
            key={category}
            type="button"
            className={getFilterClass(category)}
            onClick={() => setActive(current => (current === category ? '' : category))}
            onMouseEnter={() => setHoveredItem(`filter-${category}`)}
            onMouseLeave={() => setHoveredItem('')}
            onFocus={() => setHoveredItem(`filter-${category}`)}
            onBlur={() => setHoveredItem('')}
          >
            {category}
          </button>
        ))}
      </RevealBlock>

      {/* Grid */}
      <RevealBlock
        as="section"
        className={[styles.grid, active ? styles.filteredGrid : ''].filter(Boolean).join(' ')}
      >
        <AnimatePresence>
          {filtered.map((image, index) => (
            <motion.div
              key={image.alt + index}
              className={getItemClass(image)}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.28, delay: index * 0.035 }}
              onClick={() => setSelected(image)}
              onMouseEnter={() => setHoveredItem(image.alt)}
              onMouseLeave={() => setHoveredItem('')}
              onFocus={() => setHoveredItem(image.alt)}
              onBlur={() => setHoveredItem('')}
            >
              <img src={image.url} alt={image.alt} className={styles.img} />
              <span className={styles.imgOverlay}>
                <span className={styles.imgCategory}>{image.category}</span>
                <span className={styles.imgCaption}>{image.alt}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </RevealBlock>

      <RevealBlock className={styles.reserveWrap}>
        <CabinReserveCTA centered />
      </RevealBlock>

      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.figure
              className={styles.lightboxFigure}
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 12 }}
              onClick={event => event.stopPropagation()}
            >
              <img src={selected.url} alt={selected.alt} className={styles.lightboxImg} />
              <figcaption className={styles.lightboxCaption}>{selected.alt}</figcaption>
            </motion.figure>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setSelected(null)}
              aria-label="Cerrar imagen"
            >
              x
            </button>
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
