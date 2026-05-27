import express   from 'express';
import http      from 'http';
import session   from 'express-session';
import { WebSocketServer } from 'ws';
import 'dotenv/config';

import authRoutes                          from './routes/auth.js';
import reservationRoutes, { setWss }       from './routes/reservations.js';
import contactRoutes                       from './routes/contact.js';

import handleCalendarWS from './web/calendar.js';
import handleChatWS     from './web/chat.js';

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

// ── Inyectar wss en reservaciones para broadcast ────────
setWss(wss);

// ── Middleware ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  secret:            process.env.SESSION_SECRET || 'camaluna_secret_dev',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   8 * 60 * 60 * 1000   // 8 horas
  }
}));

// ── Rutas API ───────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);

// ── Ruta de salud ───────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

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
  console.log(`✅  Servidor corriendo en http://localhost:${PORT}`);
});
