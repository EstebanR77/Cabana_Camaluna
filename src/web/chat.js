const connectedUsers = [];

export default function handleChatWS(ws, wss) {
  let currentUser = null;

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'join':
        currentUser = { name: message.name, ws };
        connectedUsers.push(currentUser);
        broadcast(wss, { type: 'user-joined', name: message.name }, ws);
        break;

      case 'chat':
        broadcast(wss, {
          type: 'chat',
          name: currentUser ? currentUser.name : 'Visitante',
          text: message.text,
          timestamp: new Date().toISOString()
        }, null);
        break;
    }
  });

  ws.on('close', () => {
    const index = connectedUsers.findIndex(u => u.ws === ws);
    if (index !== -1) {
      const name = connectedUsers[index].name;
      connectedUsers.splice(index, 1);
      broadcast(wss, { type: 'user-left', name }, ws);
    }
  });
}

function broadcast(wss, message, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}
