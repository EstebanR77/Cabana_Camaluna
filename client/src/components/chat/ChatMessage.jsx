import styles from './ChatMessage.module.css'

function ChatMessage({ message, isOwn }) {
  return (
    <div className={[styles.message, isOwn ? styles.own : ''].join(' ')}>
      <span className={styles.name}>{message.name}</span>
      <span className={styles.text}>{message.text}</span>
      <small className={styles.time}>
        {new Date(message.timestamp || Date.now()).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
      </small>
    </div>
  )
}

export default ChatMessage
