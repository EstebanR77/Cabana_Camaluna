import { Router } from 'express';

const router = Router();

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // TODO: validar contra src/data/users.json
  res.json({ message: 'login' });
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'logout' });
});

export default router;
