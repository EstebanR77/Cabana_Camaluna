import { useEffect, useState } from 'react'
import './ReviewCard.css'

export default function ReviewCard({
  name = 'Huésped',
  text = 'Reseña',
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
    setActiveClass(isHovered || isActive ? 'review-card--active' : '')
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
        'review-card',
        compact ? 'review-card--compact' : '',
        activeClass,
      ].join(' ')}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
    >
      <div className="review-card__header">
        <div
          className="review-card__circle"
          style={image ? { backgroundImage: `url(${image})` } : {}}
        />
        <div>
          <h3 className="review-card__title">{name}</h3>
          {date && <p className="review-card__date">{date}</p>}
        </div>
      </div>

      <p className="review-card__description">{text}</p>

      <div className="review-card__stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < stars ? '' : 'review-card__star--empty'}>
            ★
          </span>
        ))}
      </div>
    </article>
  )
}
