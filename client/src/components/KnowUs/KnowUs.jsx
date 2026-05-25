import { Link } from 'react-router-dom'
import styles from './KnowUs.module.css'

function KnowUs({ subtitle, description, image, link }) {
  return (
    <section
      className={styles.section}
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay oliva semitransparente */}
      <div className={styles.overlay} />

      <div className={styles.inner}>
        {/* Bloque de texto — izquierda */}
        <div className={styles.textBlock}>
          <p className={styles.eyebrow}>Quienes Somos</p>
          <h2 className={styles.heading}>Conócenos</h2>
          <p className={styles.intro}>{subtitle}</p>
        </div>

        {/* Tarjeta historia — derecha */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Nuestra Historia</h3>
          <p className={styles.cardText}>{description}</p>
          <Link to={link} className={styles.cardLink}>Conocer más</Link>
        </div>
      </div>
    </section>
  )
}

export default KnowUs
