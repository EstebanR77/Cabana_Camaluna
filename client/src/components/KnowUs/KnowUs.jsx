import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './KnowUs.module.css'

function KnowUs({ subtitle, description, image, link }) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverClass, setHoverClass] = useState('')

  useEffect(() => {
    setHoverClass(isHovered ? styles.isHovered : '')
  }, [isHovered])

  return (
    <section
      className={`${styles.section} ${hoverClass}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={styles.overlay} />
      
      <div className={styles.textBlock}>
          <p className={styles.eyebrow}>Quienes Somos</p>
          <h2 className={styles.heading}>Conócenos</h2>
          <p className={styles.intro}>{subtitle}</p>
      </div>
      <div className={styles.inner}>
       
        <div className={styles.imageCard}>
            <img src={image} alt="Anfitriones de Cabaña Camaluna" className={styles.image} />
        </div>

        <div
          className={styles.card}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        >
          <h3 className={styles.cardTitle}>Nuestra Historia</h3>
          <p className={styles.cardText}>{description}</p>
          <Link to={link} className={styles.cardLink}>Conocer más</Link>
        </div>
      </div>
    </section>
  )
}

export default KnowUs
