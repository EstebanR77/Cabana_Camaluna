export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>'"]/g, '').trim();
}

export function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
}
