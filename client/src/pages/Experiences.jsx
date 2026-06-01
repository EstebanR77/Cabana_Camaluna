import { useEffect, useState } from 'react'
import CabinReserveCTA from '../components/CabinReserveCTA/CabinReserveCTA'
import Footer from '../components/Footer/Footer'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import ReviewCard from '../components/ReviewCard/ReviewCard'
import ReviewForm from '../components/ReviewForm/ReviewForm'
import ReviewSummary from '../components/ReviewSummary/ReviewSummary'
import { createReview, getReviews } from '../services/api'
import { reviewSources } from '../data/experiencesData'
import styles from './Experiences.module.css'

const fallbackReviews = [
  {
    id: 'local-1',
    name: 'Camilo Guerrero',
    stayDate: 'Abril 2026',
    text: 'Excelente, muy buena ubicación cerca del pueblo, las fotos iguales al sitio, todo impecable. Angela y Luis siempre estuvieron pendientes de nosotros, la comunicación con ellos muy buena. Recomendado.',
    stars: 5,
    avatar: '/images/Hombre avatar.jpg',
  },
  {
    id: 'local-2',
    name: 'Francisco Martínez',
    stayDate: 'Marzo 2026',
    text: 'Nos gustó mucho la casa, muy cómoda y es un muy buen sitio para descansar, rodeado de naturaleza y cerca a todos los sitios turísticos. Mi familia quedó muy contenta, muchas gracias.',
    stars: 5,
    avatar: '/images/Anfitriones.jpeg',
  },
  {
    id: 'local-3',
    name: 'María C. Díaz',
    stayDate: 'Febrero 2026',
    text: 'Todo perfecto, camas grandes y muy cómodas, baños amplios y hermosos, todo como nuevo. Excelente lugar para quedarse en Villa de Leyva.',
    stars: 5,
    avatar: '/images/Mujer avatar.jpg',
  },
]

function Experiences() {
  const [reviews, setReviews] = useState(fallbackReviews)
  const [hoveredReview, setHoveredReview] = useState(null)
  const [activeReview, setActiveReview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')

  useEffect(() => {
    let isMounted = true

    getReviews()
      .then(({ data }) => {
        if (isMounted && Array.isArray(data) && data.length) {
          setReviews(data)
        }
      })
      .catch(() => {
        if (isMounted) {
          setReviews(fallbackReviews)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setActiveReview(hoveredReview)
  }, [hoveredReview])

  const handleReviewSubmit = async (review) => {
    setIsSubmitting(true)
    setStatusMessage('')
    setStatusType('')

    try {
      await createReview(review)
      setStatusMessage('Gracias por compartir tu experiencia. Tu reseña quedó guardada para revisión.')
      setStatusType('success')
      return true
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'No se pudo guardar la reseña. Inténtalo de nuevo.')
      setStatusType('error')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <RevealBlock className={styles.header} variant="heroReveal">
        <h1 className={styles.title}>Reseñas</h1>
        <p className={styles.subtitle}>Historias, momentos y experiencias compartidas por nuestros huéspedes.</p>
      </RevealBlock>

      <div className={styles.content}>
        <RevealBlock>
          <ReviewSummary reviews={reviews} sources={reviewSources} />
        </RevealBlock>

        <RevealBlock as="section" className={styles.reviewsSection}>
          <div className={styles.reviewsGrid}>
            {reviews.slice(0, 6).map((review) => (
              <ReviewCard
                key={review.id}
                compact
                name={review.name}
                date={review.stayDate}
                text={review.text}
                stars={review.stars}
                image={review.avatar}
                isActive={activeReview === review.id}
                onHover={() => setHoveredReview(review.id)}
                onLeave={() => setHoveredReview(null)}
              />
            ))}
          </div>
        </RevealBlock>

        <RevealBlock>
          <ReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmitting} />
          {statusMessage && (
            <p className={`${styles.statusMessage} ${statusType === 'error' ? styles.statusError : ''}`}>
              {statusMessage}
            </p>
          )}
        </RevealBlock>

        <RevealBlock className={styles.reserveWrap} variant="reserveReveal">
          <CabinReserveCTA centered />
        </RevealBlock>

      </div>

      <RevealBlock>
        <Footer variant="brown" />
      </RevealBlock>
    </main>
  )
}

export default Experiences
