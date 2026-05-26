import { useState } from 'react'
import styles from './ChatWidget.module.css'

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! 👋 Soy el asistente de Camaluna. ¿En qué puedo ayudarte?' }
  ])

  function handleSend() {
    if (!input.trim()) return
    setMessages(prev => [...prev, { from: 'user', text: input.trim() }])
    setInput('')
    // Respuesta automática (placeholder, no funcional aún)
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: 'Gracias por tu mensaje. Un anfitrión te responderá pronto.' }])
    }, 700)
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        className={styles.fab}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {/* Ventana del chat */}
      {open && (
        <div className={styles.window}>
          <header className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={styles.avatar}>C</span>
              <div>
                <p className={styles.headerTitle}>Camaluna</p>
                <p className={styles.headerStatus}>● En línea</p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
          </header>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${msg.from === 'user' ? styles.user : styles.bot}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Escribe un mensaje..."
            />
            <button className={styles.sendBtn} onClick={handleSend} aria-label="Enviar">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget
