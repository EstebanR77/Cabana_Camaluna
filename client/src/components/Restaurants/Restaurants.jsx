import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './Restaurants.module.css'

function Restaurants({ title, items = [], ctaText, ctaLink }) {
  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={styles.item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <div className={styles.itemImg}>
              <img src={item.image} alt={item.title} />
            </div>
            <div className={styles.itemBody}>
              <h4 className={styles.itemTitle}>{item.title}</h4>
              <p className={styles.itemDesc}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {ctaText && (
        <div className={styles.ctaWrap}>
          <Link to={ctaLink} className={styles.cta}>{ctaText}</Link>
        </div>
      )}
    </section>
  )
}

export default Restaurants
