import express   from 'express';
import http      from 'http';
import session   from 'express-session';
import { WebSocketServer } from 'ws';
import 'dotenv/config';

import authRoutes                          from './routes/auth.js';
import reservationRoutes, { setWss }       from './routes/reservations.js';
import contactRoutes                       from './routes/contact.js';
import reviewRoutes                        from './routes/reviews.js';

import handleCalendarWS from './web/calendar.js';
import handleChatWS     from './web/chat.js';

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

// ── Inyectar wss en reservaciones para broadcast ────────
setWss(wss);

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use('/api/reviews', reviewRoutes);

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

// ── Servidor con auto-reintento si el puerto está ocupado ─
const BASE_PORT = parseInt(process.env.PORT, 10) || 3000;
const MAX_ATTEMPTS = 10;

function startServer(port, attempt = 1) {
  server.listen(port, () => {
    console.log(`✅  Servidor corriendo en http://localhost:${port}`);
    if (port !== BASE_PORT) {
      console.log(`ℹ️   (El puerto ${BASE_PORT} estaba ocupado, se usó ${port} en su lugar)`);
      console.log(`⚠️   Recuerda actualizar el proxy en client/vite.config.js si reinicias el frontend.`);
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const currentPort = server.address()?.port || BASE_PORT;
    const nextPort = currentPort + 1;
    if (nextPort - BASE_PORT >= MAX_ATTEMPTS) {
      console.error(`❌  No se encontró puerto libre entre ${BASE_PORT} y ${BASE_PORT + MAX_ATTEMPTS - 1}`);
      process.exit(1);
    }
    console.log(`⏳  Puerto ${currentPort} ocupado, probando ${nextPort}...`);
    setTimeout(() => server.listen(nextPort), 300);
  } else {
    console.error('❌  Error del servidor:', err);
    process.exit(1);
  }
});

// Cierre limpio con Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋  Cerrando servidor...');
  server.close(() => process.exit(0));
});

startServer(BASE_PORT);
