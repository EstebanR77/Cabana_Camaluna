import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './GalleryPreview.module.css'

function GalleryPreview({ images = [] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Galería</h2>
      <p className={styles.subtitle}>Lo que nos hace especiales en imágenes</p>
      <div className={styles.grid}>
        {images.map((img, i) => (
          <motion.div
            key={i}
            className={styles.item}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <img src={img.url} alt={img.alt} className={styles.img} />
            <p className={styles.caption}>{img.alt}</p>
          </motion.div>
        ))}
      </div>
      <Link to="/gallery" className={styles.link}>Ver galería completa →</Link>
    </section>
  )
}

export default GalleryPreview
