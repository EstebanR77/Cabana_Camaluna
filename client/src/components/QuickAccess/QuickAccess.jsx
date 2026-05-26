import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './QuickAccess.module.css'

function QuickAccess({ items = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    setActiveIndex(hoveredIndex)
  }, [hoveredIndex])

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <Link
            to={item.link}
            key={item.title}
            className={`${styles.card} ${activeIndex === i ? styles.cardActive : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
          >
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuickAccess
