import Adventures from '../components/Adventures/Adventures'
import CtaBanner  from '../components/CtaBanner/CtaBanner'
import Footer     from '../components/Footer/Footer'
import styles     from './Experiences.module.css'

import { allAdventures, experiencesCta } from '../data/experiencesData'

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
    <div className={styles.page}>
      <Adventures {...allAdventures} />
      <CtaBanner  {...experiencesCta} />
      <Footer variant="orange" />
    </div>
  )
}

export default Experiences
