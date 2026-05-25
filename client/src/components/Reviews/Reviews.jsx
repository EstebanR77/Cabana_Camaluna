import { Link } from 'react-router-dom'
import styles from './Reviews.module.css'

function Stars({ count }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  )
}

function Reviews({ reviews = [] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Lo que dicen nuestros huéspedes</p>
        <h2 className={styles.title}>Experiencias y Reseñas</h2>
      </div>

      <div className={styles.grid}>
        {reviews.map((review, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.avatar}>{review.name.charAt(0)}</div>
              <div>
                <p className={styles.name}>{review.name}</p>
                <Stars count={review.stars} />
              </div>
            </div>
            <p className={styles.text}>{review.text}</p>
          </div>
        ))}
      </div>

      <div className={styles.linkWrap}>
        <Link to="/experiences" className={styles.link}>Conocer más</Link>
      </div>
    </section>
  )
}

export default Reviews
