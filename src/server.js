import express   from 'express';
import http      from 'http';
import session   from 'express-session';
import { WebSocketServer } from 'ws';
import 'dotenv/config';

import authRoutes        from './routes/auth.js';
import reservationRoutes from './routes/reservations.js';
import contactRoutes     from './routes/contact.js';

import handleCalendarWS from './web/calendar.js';
import handleChatWS     from './web/chat.js';

const app    = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'camaluna_secret',
  resave: false,
  saveUninitialized: false
}));

// ── Rutas API ───────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);

// ── WebSocket ───────────────────────────────────────────
wss.on('connection', (ws, req) => {
  const url = req.url;
  if (url === '/ws/calendar') {
    handleCalendarWS(ws, wss);
  } else if (url === '/ws/chat') {
    handleChatWS(ws, wss);
  } else {
    ws.close();
  }
});

// ── Servidor ────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
