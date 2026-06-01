export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>'"`;\\]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 2000);
}

const INJECTION_PATTERN = /[<>'"`;\\]|javascript:|on\w+\s*=/gi;

export function containsInjectionAttempt(value) {
  return INJECTION_PATTERN.test(String(value || ''));
}

export function sanitizePersonName(str, maxLen = 80) {
  if (typeof str !== 'string') return '';
  if (containsInjectionAttempt(str)) return '';
  return sanitize(str)
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '')
    .slice(0, maxLen);
}

export function sanitizeReviewText(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return sanitize(str)
    .replace(/[^\w\sáéíóúÁÉÍÓÚñÑüÜ.,!?¿¡()\-@#%&+/:]/g, '')
    .slice(0, maxLen);
}

export function sanitizeReviewName(str) {
  return sanitizePersonName(str, 70);
}

export function validateReviewPayload(payload = {}) {
  const name = sanitizeReviewName(payload.name || '').trim();
  const stayDate = String(payload.stayDate || '').trim().slice(0, 10);
  const text = sanitizeReviewText(payload.text || '').trim();
  const stars = Math.min(5, Math.max(0, Math.trunc(Number(payload.stars) || 0)));

  if (containsInjectionAttempt(payload.name || '') || containsInjectionAttempt(payload.text || '')) {
    return {
      error: 'El contenido contiene caracteres no permitidos por seguridad.',
      status: 400,
    };
  }

  if (!name || !stayDate || !text) {
    return {
      error: 'Nombre, fecha de estadía y reseña son obligatorios.',
      status: 400,
    };
  }

  if (name.length < 3 || name.length > 70) {
    return {
      error: 'El nombre debe tener entre 3 y 70 caracteres.',
      status: 400,
    };
  }

  if (text.length < 20 || text.length > 500) {
    return {
      error: 'La reseña debe tener entre 20 y 500 caracteres.',
      status: 400,
    };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(stayDate)) {
    return {
      error: 'Selecciona una fecha de estadía válida.',
      status: 400,
    };
  }

  const parsedDate = new Date(`${stayDate}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return {
      error: 'Selecciona una fecha de estadía válida.',
      status: 400,
    };
  }

  if (parsedDate > new Date()) {
    return {
      error: 'La fecha de estadía no puede ser futura.',
      status: 400,
    };
  }

  if (stars < 1 || stars > 5) {
    return {
      error: 'Selecciona una valoración de 1 a 5 estrellas.',
      status: 400,
    };
  }

  return {
    clean: { name, stayDate, text, stars },
  };
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
