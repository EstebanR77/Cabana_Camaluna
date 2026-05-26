import { motion } from 'framer-motion'
import Hero from '../components/Hero/Hero'
import SupportChat from '../components/chat/SupportChat'
import Footer from '../components/Footer/Footer'
import styles from './Contact.module.css'

const faqs = [
  { q: '¿Cuál es el horario de check-in?', a: 'Check-in desde las 3:00 PM y check-out hasta las 12:00 PM.' },
  { q: '¿Hay parqueadero disponible?', a: 'Sí, la cabaña cuenta con espacio para parquear dentro de la propiedad.' },
  { q: '¿Se permiten mascotas?', a: 'Consulta con nosotros por WhatsApp, analizamos cada caso.' },
  { q: '¿Cómo confirmo mi reserva?', a: 'Con el 50% de anticipo por transferencia. Te enviamos confirmación de inmediato.' },
]

function Contact() {
  return (
    <div className={styles.page}>

      <Hero
        subtitle="Camaluna"
        title="Ayuda y Contacto"
        description="Estamos aquí para ayudarte."
      />

      <section className={styles.content}>

        {/* Botones de contacto directo */}
        <div className={styles.directBtns}>
          <a href="https://wa.me/573000000000" target="_blank" rel="noreferrer" className={styles.whatsapp}>
            📱 WhatsApp
          </a>
          <a href="tel:+573000000000" className={styles.phone}>
            📞 Llamar
          </a>
          <a href="mailto:info@camaluna.com" className={styles.email}>
            ✉️ Correo
          </a>
        </div>

        {/* FAQs */}
        <div className={styles.faqs}>
          <h2 className={styles.faqTitle}>Preguntas frecuentes</h2>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={styles.faqItem}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <h3 className={styles.faqQ}>{faq.q}</h3>
              <p className={styles.faqA}>{faq.a}</p>
            </motion.div>
          ))}
        </div>

        {/* Chat en vivo */}
        <div className={styles.chatSection}>
          <h2 className={styles.chatTitle}>Chat en vivo</h2>
          <p className={styles.chatDesc}>¿Tienes una pregunta específica? Escríbenos directamente.</p>
          <SupportChat />
        </div>

      </section>

      <Footer />
    </div>
  )
}

export default Contact
