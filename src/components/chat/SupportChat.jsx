import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';

function SupportChat() {
  const [input, setInput]     = useState('');
  const [userName] = useState('Visitante');
  const { messages, send }    = useChat(userName);

  function handleSend() {
    if (input.trim()) {
      send(input.trim());
      setInput('');
    }
  }

  return (
    <div className="support-chat">
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}

export default SupportChat;
