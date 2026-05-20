// WebSocket cliente — Chat de soporte en tiempo real
// Basado en el patrón del taller Chat_Multimedia

const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:3000/ws/chat'
  : `wss://${window.location.host}/ws/chat`;

let socket = null;

export function connectChat(onMessage) {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('Conectado al chat WebSocket');
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };

  socket.onclose = () => {
    console.log('Desconectado del chat. Reconectando en 3s...');
    setTimeout(() => connectChat(onMessage), 3000);
  };

  socket.onerror = (err) => console.error('Error WebSocket chat:', err);
}

export function sendChatMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

export function disconnectChat() {
  if (socket) socket.close();
}
