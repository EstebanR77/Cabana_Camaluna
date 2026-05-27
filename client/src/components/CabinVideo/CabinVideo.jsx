import { useEffect, useRef, useState } from 'react'
import styles from './CabinVideo.module.css'

function CabinVideo({ videoUrl }) {
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setHasVideo(Boolean(videoUrl))
  }, [videoUrl])

  useEffect(() => {
    if (!isPlaying || !videoRef.current) return

    videoRef.current.play().catch(() => {
      setIsPlaying(false)
    })
  }, [isPlaying])

  const handlePlayRequest = () => {
    if (!hasVideo) return
    setIsPlaying(true)
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Video Recorrido</h2>
      <div className={styles.videoWrapper}>
        {isPlaying ? (
          <video
            ref={videoRef}
            src={videoUrl}
            title="Video recorrido Camaluna"
            className={styles.video}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <button
            type="button"
            className={[styles.placeholder, hovered ? styles.hovered : ''].filter(Boolean).join(' ')}
            onClick={handlePlayRequest}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-label="Ver video recorrido"
          >
            {hasVideo ? (
              <video
                src={videoUrl}
                className={styles.thumbnail}
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex="-1"
              />
            ) : (
              <img src="/images/Fonfo home.jpeg" alt="Paisaje natural desde la cabana" />
            )}
            {hasVideo && <span className={styles.playBtn} aria-hidden="true">play_arrow</span>}
          </button>
        )}
      </div>
    </section>
  )
}

export default CabinVideo
