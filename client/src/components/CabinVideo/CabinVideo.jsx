import { useEffect, useState } from 'react'
import styles from './CabinVideo.module.css'

function CabinVideo({ videoUrl }) {
  const [hovered, setHovered] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(Boolean(videoUrl))
  }, [videoUrl])

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Video Recorrido</h2>
      <div className={styles.videoWrapper}>
        {ready ? (
          <iframe
            src={videoUrl}
            title="Video recorrido Camaluna"
            allowFullScreen
            className={styles.iframe}
          />
        ) : (
          <button
            type="button"
            className={[styles.placeholder, hovered ? styles.hovered : ''].filter(Boolean).join(' ')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-label="Ver video recorrido"
          >
            <img src="/images/Fonfo home.jpeg" alt="Paisaje natural desde la cabaña" />
            <span className={styles.playBtn} aria-hidden="true">play_arrow</span>
          </button>
        )}
      </div>
    </section>
  )
}

export default CabinVideo
