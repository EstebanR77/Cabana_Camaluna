import './ReviewCard.css'

export default function ReviewCard({
  name = 'TEXTO',
  text = 'texto',
  stars = 5,
  image = null,
}) {
  return (
    <article className="review-card">
      <div className="review-card__header">
        <div 
          className="review-card__circle" 
          style={image ? { backgroundImage: `url(${image})` } : {}}
        />
        <h3 className="review-card__title">{name}</h3>
      </div>

      <p className="review-card__description">{text}</p>

      <div className="review-card__stars">
        {Array.from({ length: stars }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>
    </article>
  )
}