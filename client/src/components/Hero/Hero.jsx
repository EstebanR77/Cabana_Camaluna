import styles from './Hero.module.css'

function Hero({ title, subtitle, description, bgImage }) {
  return (
    <section
      className={styles.hero}
      style={bgImage ? { backgroundImage: `url('${bgImage}')` } : undefined}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </section>
  )
}

export default Hero
