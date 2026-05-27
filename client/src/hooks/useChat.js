import { useState, useEffect, useRef } from 'react';
import { connectChat, sendChatMessage, disconnectChat } from '../services/chatSocket';

export function useChat(userName) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const unmounted = useRef(false);

  useEffect(() => {
    unmounted.current = false;

    connectChat((message) => {
      if (unmounted.current) return;
      if (message.type === 'chat') {
        setMessages(prev => [...prev, message]);
        setConnected(true);
      }
    }, () => unmounted.current, userName);

    return () => {
      unmounted.current = true;
      disconnectChat();
    };
  }, [userName]);

  function send(text) {
    sendChatMessage({ type: 'chat', text, name: userName });
  }

  return { messages, connected, send };
}
