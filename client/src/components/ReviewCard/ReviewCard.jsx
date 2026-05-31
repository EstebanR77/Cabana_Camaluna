import { useEffect, useState } from 'react'
import styles from './ReviewCard.module.css'

export default function ReviewCard({
  name = 'Hu\u00e9sped',
  text = 'Rese\u00f1a',
  stars = 5,
  image = null,
  date = '',
  compact = false,
  isActive = false,
  onHover,
  onLeave,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [activeClass, setActiveClass] = useState('')

  useEffect(() => {
    setActiveClass(isHovered || isActive ? styles.active : '')
  }, [isHovered, isActive])

  const handleEnter = () => {
    setIsHovered(true)
    onHover?.()
  }

  const handleLeave = () => {
    setIsHovered(false)
    onLeave?.()
  }

  return (
    <article
      className={[
        styles.card,
        compact ? styles.compact : '',
        activeClass,
      ].join(' ')}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
    >
      <div className={styles.header}>
        <div
          className={styles.avatar}
          style={image ? { backgroundImage: `url(${image})` } : {}}
        />
        <div>
          <h3 className={styles.title}>{name}</h3>
          {date && <p className={styles.date}>{date}</p>}
        </div>
      </div>

      <p className={styles.description}>{text}</p>

      <div className={styles.stars}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < stars ? '' : styles.emptyStar}>
            {'\u2605'}
          </span>
        ))}
      </div>
    </article>
  )
}
