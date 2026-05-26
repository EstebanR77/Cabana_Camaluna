import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './KnowUs.module.css'

function KnowUs({ subtitle, description, image, link }) {
  const [isComponentHovered, setIsComponentHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [sectionHoverClass, setSectionHoverClass] = useState('')
  const [buttonHoverClass, setButtonHoverClass] = useState('')

  useEffect(() => {
    setSectionHoverClass(isComponentHovered ? styles.isHovered : '')
  }, [isComponentHovered])

  useEffect(() => {
    setButtonHoverClass(isButtonHovered ? styles.cardLinkActive : '')
  }, [isButtonHovered])

  return (
    <section
      className={`${styles.section} ${sectionHoverClass}`}
      style={{ backgroundImage: `url(${image})` }}
      onMouseEnter={() => setIsComponentHovered(true)}
      onMouseLeave={() => setIsComponentHovered(false)}
      onFocus={() => setIsComponentHovered(true)}
      onBlur={() => setIsComponentHovered(false)}
    >
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.textBlock}>
          <p className={styles.eyebrow}>Quienes Somos</p>
          <h2 className={styles.heading}>Conócenos</h2>
          <p className={styles.intro}>{subtitle}</p>
        </div>

        <div className={styles.mediaWrap}>
          <div className={styles.imageCard}>
            <img src={image} alt="Anfitriones de Cabaña Camaluna" className={styles.image} />
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Nuestra Historia</h3>
            <p className={styles.cardText}>{description}</p>
            <Link
              to={link}
              className={`${styles.cardLink} ${buttonHoverClass}`}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onFocus={() => setIsButtonHovered(true)}
              onBlur={() => setIsButtonHovered(false)}
            >
              Conocer más
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default KnowUs
