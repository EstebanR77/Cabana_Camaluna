export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>'"`;\\]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 2000);
}

export function sanitizePersonName(str, maxLen = 80) {
  if (typeof str !== 'string') return '';
  return sanitize(str)
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '')
    .slice(0, maxLen);
}

export function sanitizeEmail(str) {
  if (typeof str !== 'string') return '';
  return sanitize(str).replace(/[^\w.@+-]/g, '').slice(0, 120);
}

export function sanitizePhone(str) {
  if (typeof str !== 'string') return '';
  return sanitize(str).replace(/[^\d+\s()-]/g, '').slice(0, 20);
}

export function sanitizeDocument(str) {
  if (typeof str !== 'string') return '';
  return sanitize(str).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 16);
}

export function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
}
