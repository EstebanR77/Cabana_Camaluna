import { motion } from 'framer-motion'
import Hero from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer'
import { Link } from 'react-router-dom'
import RevealBlock from '../components/RevealBlock/RevealBlock'
import styles from './Experiences.module.css'

const experiences = [
  {
    icon: '🌿',
    title: 'Senderismo',
    description: 'Rutas naturales por el desierto de La Candelaria y el Parque Nacional El Cañón de la Chorrera, con guías locales.',
    tag: 'Naturaleza',
  },
  {
    icon: '🏛️',
    title: 'Centro histórico',
    description: 'Recorre la plaza mayor más grande de Colombia, sus museos y el mercado artesanal cada sábado.',
    tag: 'Cultura',
  },
  {
    icon: '🍷',
    title: 'Gastronomía local',
    description: 'Degusta el mazamorra chiquita, la cocina boyacense y los mejores restaurantes del pueblo.',
    tag: 'Gastronomía',
  },
  {
    icon: '🌌',
    title: 'Observación de estrellas',
    description: 'Gracias al cielo despejado de Villa de Leyva, las noches se convierten en un espectáculo astronómico.',
    tag: 'Noche',
  },
  {
    icon: '🚴',
    title: 'Ciclismo y caballos',
    description: 'Recorre los alrededores en bicicleta o a caballo, explorando las veredas y el paisaje de Boyacá.',
    tag: 'Aventura',
  },
  {
    icon: '🛕',
    title: 'Sitios arqueológicos',
    description: 'El Infiernito, el museo paleontológico y el monasterio de La Candelaria son visita obligada.',
    tag: 'Historia',
  },
]

function Experiences() {
  return (
    <div className={styles.page}>

      <RevealBlock variant="heroReveal">
      <Hero
        subtitle="Villa de Leyva"
        title="Experiencias"
        description="Todo lo que Villa de Leyva tiene para ofrecerte."
      />
      </RevealBlock>

      <RevealBlock as="section" className={styles.grid}>
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className={styles.tag}>{exp.tag}</span>
            <span className={styles.icon}>{exp.icon}</span>
            <h3 className={styles.cardTitle}>{exp.title}</h3>
            <p className={styles.cardDesc}>{exp.description}</p>
          </motion.div>
        ))}
      </RevealBlock>

      <RevealBlock as="section" className={styles.cta} variant="reserveReveal">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.ctaTitle}>¿Listo para vivirlo?</h2>
          <p className={styles.ctaDesc}>Reserva tu estadía en Camaluna y explora todo lo que Boyacá tiene para ti.</p>
          <Link to="/reserve" className={styles.ctaBtn}>Reservar ahora</Link>
        </motion.div>
      </RevealBlock>

      <RevealBlock>
        <Footer />
      </RevealBlock>
    </div>
  )
}

export default Experiences
