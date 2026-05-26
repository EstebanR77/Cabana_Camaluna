import styles from './CabinVideo.module.css'

function CabinVideo({ videoUrl }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Video Recorrido</h2>
      <div className={styles.videoWrapper}>
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title="Video recorrido Camaluna"
            allowFullScreen
            className={styles.iframe}
          />
        ) : (
          <div
            className={styles.placeholder}
            style={{ backgroundImage: "url('/images/video-thumb.jpg')" }}
          >
            <div className={styles.playBtn}>▶</div>
            <p className={styles.placeholderText}>Ver video recorrido</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CabinVideo
