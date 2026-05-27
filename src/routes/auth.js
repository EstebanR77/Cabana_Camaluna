import { Router } from 'express';
import { findByUsername, verifyPassword } from '../models/users.js';
import { sanitize } from '../utils/security.js';

const router = Router();

// POST /api/login
router.post('/login', (req, res) => {
  const username = sanitize(req.body.username || '');
  const password = req.body.password || '';

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const user = findByUsername(username);

  if (!user || !verifyPassword(user, password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  req.session.user = { id: user.id, username: user.username, email: user.email, role: user.role };
  res.json({ message: 'Sesión iniciada', user: req.session.user, role: user.role });
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ message: 'Sesión cerrada' });
  });
});

// GET /api/me
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  res.json({ user: req.session.user });
});

export default router;
