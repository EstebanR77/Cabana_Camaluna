import { useState } from 'react'
import styles from './FloatingChat.module.css'

function FloatingChat() {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrap}>
      {open && (
        <div className={styles.window}>
          <div className={styles.header}>
            <div>
              <strong>Chat Camaluna</strong>
              <span>Respuesta en línea</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat">×</button>
          </div>
          <div className={styles.body}>
            <p className={styles.message}>Hola, somos Camaluna. Escríbenos tu duda y te ayudaremos con tu reserva.</p>
          </div>
          <div className={styles.inputRow}>
            <input placeholder="Escribe un mensaje..." />
            <button type="button">Enviar</button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen(value => !value)}
        aria-label="Abrir chat"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11.5a7.5 7.5 0 0 1-11.9 6.08L4 18.7l1.17-3.6A7.5 7.5 0 1 1 20 11.5Z" />
        </svg>
      </button>
    </div>
  )
}

export default FloatingChat
