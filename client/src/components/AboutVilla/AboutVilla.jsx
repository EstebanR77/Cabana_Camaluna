import { Link } from 'react-router-dom'
import styles from './AboutVilla.module.css'

function AboutVilla({ title, description, image, link }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionLabel}>Sobre Villa de Leyva</h2>
      <div className={styles.inner}>
        <div className={styles.imageWrap}>
          <img src={image} alt="Villa de Leyva" className={styles.image} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Un destino de ensueño</h2>
          <p className={styles.description}>{description}</p>
          <Link to={link} className={styles.link}>Conocer más</Link>
        </div>
      </div>
    </section>
  )
}

export default AboutVilla
