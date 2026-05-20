export function broadcast(wss, message, exclude = null) {
  wss.clients.forEach((client) => {
    if (client !== exclude && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}
