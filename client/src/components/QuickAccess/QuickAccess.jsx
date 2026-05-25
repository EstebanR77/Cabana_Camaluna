import { Link } from 'react-router-dom'
import styles from './QuickAccess.module.css'

function QuickAccess({ items = [] }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <Link to={item.link} key={i} className={styles.card}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuickAccess
