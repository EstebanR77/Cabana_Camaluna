import { sanitize } from '../utils/security.js';
import { broadcast } from '../utils/broadcast.js';

export default function handleChatWS(ws, wss) {
  let userName = 'Visitante';

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch {
      return;
    }

    switch (message.type) {
      case 'join':
        userName = sanitize(message.name) || 'Visitante';
        broadcast(wss, { type: 'user-joined', name: userName }, ws);
        break;

      case 'chat': {
        const text = sanitize(message.text || '');
        if (!text) break;
        broadcast(wss, {
          type:      'chat',
          name:      userName,
          text,
          timestamp: new Date().toISOString()
        }, null); // null = enviar a todos incluyendo emisor
        break;
      }
    }
  });

  ws.on('close', () => {
    broadcast(wss, { type: 'user-left', name: userName }, ws);
  });

  ws.on('error', (err) => console.error('ChatWS error:', err));
}
