import { Link } from 'react-router-dom'
import styles from './GalleryPreview.module.css'

function GalleryPreview({ images = [] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Galería</h2>
        <p className={styles.subtitle}>Vive la cabaña antes de llegar.</p>
      </div>
      <div className={styles.grid}>
        {images.map((img, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.imgWrap}>
              <img src={img.url} alt={img.alt} className={styles.img} />
            </div>
            <p className={styles.caption}>{img.alt}</p>
          </div>
        ))}
      </div>
      <div className={styles.linkWrap}>
        <Link to="/gallery" className={styles.link}>Ver galería completa</Link>
      </div>
    </section>
  )
}

export default GalleryPreview
