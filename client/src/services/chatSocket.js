const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:3000/ws/chat'
  : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/chat`;

let socket = null;
let pendingMessages = [];

export function connectChat(onMessage, isUnmounted, name = 'Visitante') {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'join', name }));
    pendingMessages.forEach(message => socket.send(JSON.stringify(message)));
    pendingMessages = [];
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };

  socket.onclose = () => {
    if (isUnmounted && isUnmounted()) return;
    setTimeout(() => connectChat(onMessage, isUnmounted, name), 3000);
  };

  socket.onerror = (err) => console.error('Error WebSocket chat:', err);
}

export function sendChatMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    pendingMessages.push(message);
  }
}

export function disconnectChat() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
