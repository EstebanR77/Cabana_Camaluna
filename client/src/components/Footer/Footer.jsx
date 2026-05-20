import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>

        <div className={styles.brand}>
          <h3 className={styles.logo}>Camaluna 🌙</h3>
          <p className={styles.tagline}>Villa de Leyva, Boyacá, Colombia</p>
          <div className={styles.socials}>
            <a href="https://instagram.com/camaluna" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/573000000000" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>La Cabaña</h4>
          <Link to="/cabin">Comodidades</Link>
          <Link to="/cabin">Reglas de la casa</Link>
          <Link to="/cabin">Video recorrido</Link>
          <Link to="/cabin">Cómo llegar</Link>
        </div>

        <div className={styles.col}>
          <h4>Reservas</h4>
          <Link to="/reserve">Disponibilidad</Link>
          <Link to="/reserve">Precios por temporada</Link>
          <Link to="/reserve">Política de cancelación</Link>
          <Link to="/reserve">Cómo reservar</Link>
        </div>

        <div className={styles.col}>
          <h4>Contacto</h4>
          <a href="tel:+573000000000">Teléfono</a>
          <a href="mailto:info@camaluna.com">Correo</a>
          <Link to="/contact">Preguntas frecuentes</Link>
          <Link to="/contact">Chat en vivo</Link>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© 2024 Camaluna — Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer
