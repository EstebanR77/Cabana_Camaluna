import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Reviews.module.css'

function Stars({ count }) {
  return (
    <div className={styles.stars} aria-label={`${count} estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  )
}

function Reviews({ reviews = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    setActiveIndex(hoveredIndex)
  }, [hoveredIndex])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Lo que dicen nuestros huéspedes</p>
        <h2 className={styles.title}>Experiencias y Reseñas</h2>
      </div>

      <div className={styles.grid}>
        {reviews.map((review, i) => (
          <Link
            key={review.name}
            to="/experiences"
            className={`${styles.card} ${activeIndex === i ? styles.cardActive : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
          >
            <div className={styles.cardTop}>
              <div className={styles.avatar}>
                {review.avatar ? (
                  <img src={review.avatar} alt={review.name} className={styles.avatarImage} />
                ) : (
                  <span>{review.name.charAt(0)}</span>
                )}
              </div>
              <p className={styles.name}>{review.name}</p>
            </div>

            <p className={styles.text}>{review.text}</p>
            <Stars count={review.stars} />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Reviews
