import { motion } from 'framer-motion'
import styles from './TouristSites.module.css'

function TouristSites({ title, items = [], mapEmbed }) {
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

      {mapEmbed && (
        <div className={styles.map}>
          <iframe
            src={mapEmbed}
            title="Mapa de Villa de Leyva"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}
    </section>
  )
}

export default TouristSites
