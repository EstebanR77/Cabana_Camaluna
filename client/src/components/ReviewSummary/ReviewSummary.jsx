import { useEffect, useMemo, useState } from 'react'
import styles from './ReviewSummary.module.css'

function ReviewSummary({ reviews = [] }) {
  const [hoveredRow, setHoveredRow] = useState(null)
  const [activeRow, setActiveRow] = useState(null)

  useEffect(() => {
    setActiveRow(hoveredRow)
  }, [hoveredRow])

  const summary = useMemo(() => {
    const total = reviews.length || 1
    const average = reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0) / total
    const five = reviews.filter((review) => Number(review.stars) === 5).length
    const four = reviews.filter((review) => Number(review.stars) === 4).length

    return {
      average: average.toFixed(1),
      fivePercent: Math.round((five / total) * 100),
      fourPercent: Math.round((four / total) * 100),
    }
  }, [reviews])

  const rows = [
    { stars: 5, percent: summary.fivePercent, label: 'Arriba' },
    { stars: 4, percent: summary.fourPercent, label: 'Mejor' },
  ]

  return (
    <section className={styles.summary} aria-label="Resumen de valoraciones">
      <div className={styles.score}>
        <span className={styles.scoreNumber}>{summary.average}</span>
        <div>
          <div className={styles.stars} aria-label={`${summary.average} de 5 estrellas`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index}>★</span>
            ))}
          </div>
          <p className={styles.scoreCopy}>Este alojamiento está en el 5 % de los mejor valorados</p>
        </div>
      </div>

      <div className={styles.bars}>
        {rows.map((row) => (
          <div
            key={row.stars}
            className={`${styles.barRow} ${activeRow === row.stars ? styles.barRowActive : ''}`}
            onMouseEnter={() => setHoveredRow(row.stars)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <span className={styles.barLabel}>★ {row.stars}</span>
            <span className={styles.barTrack}>
              <span className={styles.barFill} style={{ width: `${Math.max(row.percent, 8)}%` }} />
            </span>
            <span className={styles.barTag}>{row.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReviewSummary
