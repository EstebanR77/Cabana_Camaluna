import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import styles from './Gallery.module.css'

const categories = ['Area Social', 'Habitaciones', 'Terraza', 'Baños']

const galleryImages = [
  {
    url: '/images/Fachada.jpg',
    alt: 'Entrada principal iluminada',
    category: 'Area Social',
    layout: 'entrance',
  },
  {
    url: '/images/habitacion.png',
    alt: 'Habitacion con vista natural',
    category: 'Habitaciones',
    layout: 'bedroom',
  },
  {
    url: '/images/34337b17d92bc46343f555c176196d8895da80b3.png',
    alt: 'Lamparas y arte interior',
    category: 'Area Social',
    layout: 'detail',
  },
  {
    url: '/images/81b38c95a8219a31a611b35c060ef713c498d3c2.png',
    alt: 'Terraza exterior',
    category: 'Terraza',
    layout: 'terrace',
  },
  {
    url: '/images/habitacion.png',
    alt: 'Bano artesanal',
    category: 'Baños',
    layout: 'bath',
  },
  {
    url: '/images/Area social.jpg',
    alt: 'Sala y comedor',
    category: 'Area Social',
    layout: 'social',
  },
  {
    url: '/images/Cabana.jpg',
    alt: 'Sala de descanso',
    category: 'Area Social',
    layout: 'sofa',
  },
  {
    url: '/images/home.jpg',
    alt: 'Fachada nocturna',
    category: 'Terraza',
    layout: 'pet',
  },
  {
    url: '/images/Habitaciones.jpg',
    alt: 'Cocina equipada',
    category: 'Area Social',
    layout: 'kitchen',
  },
  {
    url: '/images/Fonfo home.jpeg',
    alt: 'Vista natural desde Camaluna',
    category: 'Terraza',
    layout: 'stairs',
  },
  {
    url: '/images/Area social.jpg',
    alt: 'Ingreso a la cabana',
    category: 'Area Social',
    layout: 'door',
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
        subtitle="Cabaña Boutique"
        title="Galería"
        description="Vive la cabaña antes de llegar."
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
        <Link
          to="/reserve"
          className={[
            styles.reserveBtn,
            hoveredItem === 'reserve-cta' ? styles.reserveBtnHovered : '',
          ].filter(Boolean).join(' ')}
          onMouseEnter={() => setHoveredItem('reserve-cta')}
          onMouseLeave={() => setHoveredItem('')}
          onFocus={() => setHoveredItem('reserve-cta')}
          onBlur={() => setHoveredItem('')}
        >
          RESERVA YA!
        </Link>
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
