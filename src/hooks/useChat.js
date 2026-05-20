import { useState, useEffect } from 'react';
import { connectChat, sendChatMessage, disconnectChat } from '../services/chatSocket';

export function useChat(userName) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    connectChat((message) => {
      if (message.type === 'chat') {
        setMessages(prev => [...prev, message]);
        setConnected(true);
      }
    });
    return () => disconnectChat();
  }, []);

  function send(text) {
    sendChatMessage({ type: 'chat', text, name: userName });
  }

  return { messages, connected, send };
}
