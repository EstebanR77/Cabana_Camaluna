import { motion } from 'framer-motion'
import Footer from '../components/Footer/Footer'
import styles from './About.module.css'

const logros = [
  { number: '2019', label: 'Año de apertura' },
  { number: '4.9★', label: 'Calificación promedio' },
  { number: '+300', label: 'Familias recibidas' },
  { number: '100%', label: 'Recomendarían la cabaña' },
]

const conocenos = [
  {
    title: 'Nuestra historia',
    body: 'Camaluna nació del amor por Villa de Leyva. Construimos esta cabaña con nuestras manos y con el sueño de compartir la belleza de Boyacá con visitantes de todo el país.',
  },
  {
    title: 'Nuestros valores',
    body: 'Creemos en la hospitalidad genuina, el respeto por la naturaleza y la conexión humana. Cada detalle de la cabaña fue pensado para que te sientas como en casa.',
  },
  {
    title: 'El entorno',
    body: 'A 7 minutos del centro histórico de Villa de Leyva, rodeados de montañas, cielos despejados y el silencio que solo el campo puede dar.',
  },
]

function About() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Conócenos
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Anfitriones apasionados por nuestra tierra ancestral
        </motion.p>
      </section>

      {/* Logros */}
      <section className={styles.logros}>
        <div className={styles.logrosGrid}>
          {logros.map((l, i) => (
            <motion.div
              key={i}
              className={styles.logroCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className={styles.logroNum}>{l.number}</span>
              <span className={styles.logroLabel}>{l.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conocenos cards */}
      <section className={styles.conocenos}>
        <div className={styles.conocenosGrid}>
          {conocenos.map((item, i) => (
            <motion.div
              key={i}
              className={styles.conocenosCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className={styles.conocenosTitle}>{item.title}</h3>
              <p className={styles.conocenosBody}>{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Villa de Leyva info */}
      <section className={styles.villa}>
        <motion.div
          className={styles.villaContent}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className={styles.villaTitle}>Villa de Leyva</h2>
          <p className={styles.villaDesc}>
            Declarada monumento nacional de Colombia, Villa de Leyva es uno de los pueblos
            coloniales más hermosos del país. Con su plaza mayor de piedra, sus calles empedradas
            y un cielo azul que parece infinito, este rincón de Boyacá enamora a todos los que
            llegan.
          </p>
          <p className={styles.villaDesc}>
            A solo 3 horas de Bogotá, es el escapada perfecta para desconectarse del ritmo
            acelerado de la ciudad y reconectarse con lo esencial: la naturaleza, la historia
            y la buena compañía.
          </p>
        </motion.div>
        <motion.div
          className={styles.villaImg}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img src="/images/villa-de-leyva.jpg" alt="Villa de Leyva" />
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default About
