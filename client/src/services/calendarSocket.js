const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:3000/ws/calendar'
  : `wss://${window.location.host}/ws/calendar`;

let socket = null;

export function connectCalendar(onMessage, isUnmounted) {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('Conectado al calendario WebSocket');
    socket.send(JSON.stringify({ type: 'get-availability' }));
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };

  socket.onclose = () => {
    if (isUnmounted && isUnmounted()) return;
    console.log('Desconectado del calendario. Reconectando en 3s...');
    setTimeout(() => connectCalendar(onMessage, isUnmounted), 3000);
  };

  socket.onerror = (err) => console.error('Error WebSocket calendario:', err);
}

export function sendCalendarMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

export function disconnectCalendar() {
  if (socket) { socket.close(); socket = null; }
}
