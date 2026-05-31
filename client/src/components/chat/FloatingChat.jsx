import { useState, useEffect } from 'react'
import styles from './FloatingChat.module.css'
import { faqs } from '../../data/contactData'

const WHATSAPP_URL = 'https://wa.me/573107777579'
const ADMIN_VIEW = 'admin'

const FAQ_MATERIAL_ICONS = {
  clock: 'schedule',
  car: 'local_parking',
  map: 'location_on',
  paw: 'pets',
  sparkle: 'event_available',
  plus: 'hotel',
  person: 'key',
}

function MaterialIcon({ name, className = '' }) {
  return (
    <span className={`${styles.materialIcon} ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}

const LIGHT_SWEEP_MS = 1200
const LIGHT_INTERVAL_MS = 4500

function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [activeView, setActiveView] = useState(null)
  const [lightSweep, setLightSweep] = useState(false)

  useEffect(() => {
    if (!open) setActiveView(null)
  }, [open])

  useEffect(() => {
    if (open) {
      setLightSweep(false)
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    let sweepTimeoutId

    const triggerSweep = () => {
      setLightSweep(true)
      sweepTimeoutId = window.setTimeout(
        () => setLightSweep(false),
        LIGHT_SWEEP_MS
      )
    }

    triggerSweep()
    const intervalId = window.setInterval(triggerSweep, LIGHT_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(sweepTimeoutId)
      setLightSweep(false)
    }
  }, [open])

  function toggleOpen() {
    setOpen(prev => !prev)
  }

  function handleClose() {
    setOpen(false)
  }

  const activeFaq =
    typeof activeView === 'number' ? faqs.items[activeView] : null

  return (
    <div className={styles.wrap}>
      {open && (
        <div
          className={styles.window}
          role="dialog"
          aria-label="Chat de ayuda Camaluna"
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>
                <MaterialIcon name="forum" className={styles.titleIcon} />
                Chat Camaluna
              </h2>
              <button
                type="button"
                className={styles.closeHeaderBtn}
                onClick={handleClose}
                aria-label="Cerrar chat"
              >
                <MaterialIcon name="close" />
              </button>
            </div>

            <p className={styles.intro}>
              Estamos dispuestos a resolver cualquier duda sobre tu estadía en
              Camaluna. Elige una pregunta:
            </p>

            {activeView === null && (
              <ul className={styles.list}>
                {faqs.items.map((item, i) => (
                  <li key={item.q} className={styles.item}>
                    <button
                      type="button"
                      className={styles.row}
                      onClick={() => setActiveView(i)}
                    >
                      <span className={styles.rowIcon}>
                        <MaterialIcon
                          name={FAQ_MATERIAL_ICONS[item.icon] || 'help'}
                        />
                      </span>
                      <span className={styles.question}>{item.q}</span>
                      <span className={styles.arrow}>
                        <MaterialIcon name="chevron_right" />
                      </span>
                    </button>
                  </li>
                ))}
                <li className={styles.item}>
                  <button
                    type="button"
                    className={`${styles.row} ${styles.adminRow}`}
                    onClick={() => setActiveView(ADMIN_VIEW)}
                  >
                    <span className={styles.rowIcon}>
                      <MaterialIcon name="support_agent" />
                    </span>
                    <span className={styles.question}>
                      Consultar con el administrador
                    </span>
                    <span className={styles.arrow}>
                      <MaterialIcon name="chevron_right" />
                    </span>
                  </button>
                </li>
              </ul>
            )}

            {activeFaq && (
              <div className={styles.detail}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setActiveView(null)}
                >
                  <MaterialIcon name="arrow_back" />
                  Volver a preguntas
                </button>
                <p className={styles.detailQuestion}>{activeFaq.q}</p>
                <div className={styles.answer}>
                  <p>{activeFaq.a}</p>
                </div>
              </div>
            )}

            {activeView === ADMIN_VIEW && (
              <div className={styles.detail}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setActiveView(null)}
                >
                  <MaterialIcon name="arrow_back" />
                  Volver a preguntas
                </button>
                <div className={styles.answer}>
                  <p>
                    Para dudas personalizadas, escríbenos por WhatsApp y el
                    administrador te atenderá.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {open && activeView === ADMIN_VIEW && (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.whatsappBtn}
          aria-label="Consultar con el administrador por WhatsApp"
        >
          <MaterialIcon name="chat" />
          WhatsApp
        </a>
      )}

      <div className={styles.fabShell}>
        <button
          type="button"
          className={`${styles.button} ${open ? styles.buttonOpen : ''}`}
          onClick={toggleOpen}
          aria-label={open ? 'Cerrar chat' : 'Abrir chat de ayuda'}
          aria-expanded={open}
        >
          <span
            className={`${styles.lightBeam} ${lightSweep ? styles.lightBeamActive : ''}`}
            aria-hidden="true"
          />
          <MaterialIcon
            name={open ? 'close' : 'forum'}
            className={styles.buttonIcon}
          />
        </button>
      </div>
    </div>
  )
}

export default FloatingChat
