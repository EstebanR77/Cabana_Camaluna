import { useEffect, useState } from 'react'
import styles from './GalleryPreview.module.css'

function GalleryPreview({ images = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    setActiveIndex(hoveredIndex)
  }, [hoveredIndex])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Galería</h2>
        <p className={styles.subtitle}>Vive la cabaña antes de llegar.</p>
      </div>

      <div className={styles.grid}>
        {images.map((img, i) => (
          <div
            key={img.alt}
            className={`${styles.item} ${activeIndex === i ? styles.itemActive : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
          >
            <div className={styles.imgWrap}>
              <img src={img.url} alt={img.alt} className={styles.img} />
            </div>
            <p className={styles.caption}>{img.alt}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default GalleryPreview
