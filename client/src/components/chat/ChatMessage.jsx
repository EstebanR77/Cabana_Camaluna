function ChatMessage({ message }) {
  return (
    <div className="chat-message">
      <strong>{message.name}</strong>
      <span>{message.text}</span>
      <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
    </div>
  );
}

export default ChatMessage;
