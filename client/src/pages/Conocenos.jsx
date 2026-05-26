import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import styles from './Conocenos.module.css'

const logros = [
  { title: 'Titulo', desc: 'Descripcion Aqui' },
  { title: 'Titulo', desc: 'Descripcion Aqui' },
  { title: 'Titulo', desc: 'Descripcion Aqui' },
  { title: 'Titulo', desc: 'Descripcion Aqui' },
]

const valores = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>
    ),
    title: 'Tranquilidad',
    desc: 'Creamos un espacio pensado para el descanso, la desconexión y la paz en medio de la naturaleza.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        <path d="M3.5 12h4l1.5-3 3 6 1.5-3h4.5" />
      </svg>
    ),
    title: 'Hospitalidad',
    desc: 'Nos encanta recibir a cada huésped con cercanía, atención y disposición para brindar una experiencia memorable.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3h16M4 21h16" />
        <path d="M6 3c0 6 12 6 12 9s-12 3-12 9" />
        <path d="M18 3c0 6-12 6-12 9s12 3 12 9" />
      </svg>
    ),
    title: 'Comodidad',
    desc: 'Creamos un espacio pensado para el descanso, la desconexión y la paz en medio de la naturaleza.',
  },
]

function Conocenos() {
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.heroTitle}>Conócenos</h1>
          <p className={styles.heroSubtitle}>
            Descubre un espacio creado para el descanso, la tranquilidad y la conexión con la naturaleza en Villa de Leyva.
          </p>
        </motion.div>
      </section>

      {/* ── Quiénes Somos ── */}
      <section className={styles.quienesWrap}>
        <motion.div
          className={styles.quienes}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className={styles.quienesTitle}>Quienes Somos</h2>

          <div className={styles.quienesGrid}>
            <div className={styles.quienesImg}>
              <img src="/images/anfitriones.jpg" alt="Anfitriones Camaluna" />
            </div>

            <div className={styles.quienesText}>
              <h3 className={styles.subhead}>Los anfitriones</h3>
              <p className={styles.paragraph}>
                Somos anfitriones apasionados por crear experiencias cálidas y memorables. Cada rincón de CAMALUNA fue diseñado pensando en la comodidad, la armonía y los pequeños detalles que hacen especial cada estadía.
              </p>

              <h3 className={styles.subhead}>Más que una cabaña</h3>
              <p className={styles.paragraph}>
                Queremos que cada huésped viva la esencia de Villa de Leyva: descanso, naturaleza y momentos para compartir. Por eso, además de hospedarte, buscamos acompañarte y ayudarte a descubrir experiencias únicas durante tu viaje.
              </p>

              <div className={styles.tags}>
                <span className={styles.tag}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                  Villa de Leyva
                </span>
                <span className={styles.tag}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5 9.5V21h14V9.5" />
                  </svg>
                  Anfitriones desde 2025
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Nuestra Historia ── */}
      <section className={styles.historia}>
        <motion.div
          className={styles.historiaText}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
          <p className={styles.paragraph}>
            CAMALUNA nació del amor por Villa de Leyva, sus paisajes y la tranquilidad que se vive entre sus montañas. Creamos esta cabaña con la intención de ofrecer un espacio acogedor donde familias y viajeros puedan desconectarse de la rutina y sentirse como en casa.
          </p>
          <p className={styles.paragraph}>
            Todo comenzó con una idea sencilla: crear un espacio donde otras personas pudieran vivir la misma tranquilidad que nosotros sentimos cada vez que llegábamos aquí. Poco a poco, ese sueño se transformó en una cabaña diseñada con dedicación, cuidado y amor por cada detalle.
          </p>
        </motion.div>

        <motion.div
          className={styles.historiaImg}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img src="/images/fachada.jpg" alt="Cabaña Camaluna" />
        </motion.div>
      </section>

      {/* ── Estadísticas / Logros ── */}
      <section className={styles.logrosWrap}>
        <motion.div
          className={styles.logros}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className={styles.logrosTitle}>Estadísticas / Logros</h2>
          <p className={styles.logrosSub}>Momentos, experiencias y recuerdos que hacen única cada estadía.</p>

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
                <h4 className={styles.logroTitle}>{l.title}</h4>
                <p className={styles.logroDesc}>{l.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Nuestros Valores ── */}
      <section className={styles.valoresWrap}>
        <motion.div
          className={styles.valores}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className={styles.valoresTitle}>Nuestros Valores</h2>
          <p className={styles.valoresSub}>Momentos, experiencias y recuerdos que hacen única cada estadía.</p>

          <div className={styles.valoresGrid}>
            {valores.map((v, i) => (
              <motion.div
                key={i}
                className={styles.valorCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.valorIcon}>{v.icon}</div>
                <h4 className={styles.valorTitle}>{v.title}</h4>
                <p className={styles.valorDesc}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h3 className={styles.ctaTitle}>¿Listos para conocernos en persona?</h3>
          <p className={styles.ctaSub}>Reserva tu estancia y vive la experiencia de Villa de leyva desde nuestra cabaña</p>
          <Link to="/reserve" className={styles.ctaBtn}>RESERVA YA!</Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default Conocenos
