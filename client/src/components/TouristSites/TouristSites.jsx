import { motion } from 'framer-motion'
import styles from './TouristSites.module.css'

function TouristSites({ title, items = [], mapEmbed, mapUrl }) {
  const mapsLink = mapUrl || 'https://www.google.com/maps/search/?api=1&query=Villa+de+Leyva,+Boyac%C3%A1,+Colombia'
  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid}>
        {items.map((item, i) => {
          const motionProps = {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: i * 0.08 },
            viewport: { once: true },
          }

          const content = (
            <>
              <div className={styles.itemImg}>
                <img src={item.image} alt={item.title} />
              </div>
              <div className={styles.itemBody}>
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
            </>
          )

          if (item.href) {
            return (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`${styles.item} ${styles.itemLink}`}
                {...motionProps}
              >
                {content}
              </motion.a>
            )
          }

          return (
            <motion.div key={i} className={styles.item} {...motionProps}>
              {content}
            </motion.div>
          )
        })}
      </div>

      {mapEmbed && (
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className={styles.map}
          aria-label="Abrir mapa de Villa de Leyva en Google Maps"
        >
          <iframe
            src={mapEmbed}
            title=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
            aria-hidden="true"
          />
        </a>
      )}
    </section>
  )
}

export default TouristSites
