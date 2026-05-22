import { getAll } from '../models/reservations.js';
import { broadcast } from '../utils/broadcast.js';

export default function handleCalendarWS(ws, wss) {
  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch {
      return; // ignorar mensajes malformados
    }

    switch (message.type) {
      case 'get-availability': {
        try {
          const reservations = getAll();
          ws.send(JSON.stringify({ type: 'availability', dates: reservations }));
        } catch {
          ws.send(JSON.stringify({ type: 'availability', dates: [] }));
        }
        break;
      }
      // Los broadcasts de creación/cancelación los maneja la ruta REST
    }
  });

  ws.on('close', () => {});
  ws.on('error', (err) => console.error('CalendarWS error:', err));
}
