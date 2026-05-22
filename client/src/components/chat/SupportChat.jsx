import { useState } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatMessage from './ChatMessage'
import styles from './SupportChat.module.css'

function SupportChat() {
  const [input, setInput] = useState('')
  const [userName] = useState('Visitante')
  const { messages, send } = useChat(userName)

  function handleSend() {
    if (input.trim()) {
      send(input.trim())
      setInput('')
    }
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.length === 0 && (
          <p className={styles.empty}>Escríbenos, te respondemos pronto...</p>
        )}
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            message={msg}
            isOwn={msg.name === userName}
          />
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
        />
        <button className={styles.sendBtn} onClick={handleSend}>Enviar</button>
      </div>
    </div>
  )
}

export default SupportChat
