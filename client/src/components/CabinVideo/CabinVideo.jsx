import { motion } from 'framer-motion'
import styles from './CabinVideo.module.css'

function CabinVideo({ videoUrl }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Video Recorrido</h2>
      <motion.div
        className={styles.videoWrapper}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title="Video recorrido Camaluna"
            allowFullScreen
            className={styles.iframe}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>▶</span>
            <p>Video recorrido próximamente</p>
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default CabinVideo
