const connectedClients = [];

export default function handleCalendarWS(ws, wss) {
  connectedClients.push(ws);

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'get-availability':
        // TODO: leer src/data/reservations.json
        ws.send(JSON.stringify({ type: 'availability', dates: [] }));
        break;

      case 'reservation-created':
        broadcast(wss, { type: 'reservation-created', reservation: message.reservation }, ws);
        break;

      case 'reservation-cancelled':
        broadcast(wss, { type: 'reservation-cancelled', id: message.id }, ws);
        break;
    }
  });

  ws.on('close', () => {
    const index = connectedClients.indexOf(ws);
    if (index !== -1) connectedClients.splice(index, 1);
  });
}

function broadcast(wss, message, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}
