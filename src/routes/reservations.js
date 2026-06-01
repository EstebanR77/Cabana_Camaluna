import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../models/reservations.js';
import {
  sanitize,
  sanitizePersonName,
  sanitizeEmail,
  sanitizePhone,
  sanitizeDocument,
  requireAuth,
} from '../utils/security.js';

function sanitizeGuestRoster(roster) {
  if (!Array.isArray(roster)) return [];

  return roster.slice(0, 8).map(entry => ({
    key: sanitize(entry?.key || '').slice(0, 24),
    label: sanitize(entry?.label || '').slice(0, 40),
    nombreCompleto: sanitizePersonName(entry?.nombreCompleto || '', 80),
    tipoDocumento: sanitize(entry?.tipoDocumento || '').slice(0, 20),
    numeroDocumento: sanitizeDocument(entry?.numeroDocumento || ''),
    edad: String(entry?.edad || '').replace(/\D/g, '').slice(0, 3),
  }));
}
import { broadcast } from '../utils/broadcast.js';

const router = Router();

let _wss = null;
export function setWss(wss) { _wss = wss; }

function hasDateConflict({ checkIn, checkOut }) {
  const newIn = new Date(checkIn);
  const newOut = new Date(checkOut);

  return getAll().some(r => {
    if (r.status === 'rejected' || r.status === 'cancelled') return false;

    const rIn = new Date(r.checkIn);
    const rOut = new Date(r.checkOut);

    return newIn < rOut && newOut > rIn;
  });
}

function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// GET /api/reservations
router.get('/', (req, res) => {
  try {
    const reservations = getAll();
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// GET /api/reservations/admin — solo admin
router.get('/admin', requireAuth, (req, res) => {
  try {
    const reservations = getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas del administrador' });
  }
});

function toPublicReservation(reservation) {
  return {
    id: reservation.id,
    name: reservation.name,
    status: reservation.status,
    accessCode: reservation.status === 'approved' ? reservation.accessCode : null,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
  };
}

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// POST /api/reservations/lookup — consulta pública por titular y código
router.post('/lookup', (req, res) => {
  const { name, requestCode } = req.body || {};

  const trimmedName = String(name || '').trim();
  const trimmedCode = String(requestCode || '').trim();

  if (!trimmedName || trimmedName.length < 2) {
    return res.status(400).json({ error: 'Ingresa el nombre del titular (mínimo 2 caracteres).' });
  }

  if (!trimmedCode) {
    return res.status(400).json({ error: 'Ingresa el código de solicitud.' });
  }

  if (!/^\d{8,20}$/.test(trimmedCode)) {
    return res.status(400).json({ error: 'El código de solicitud no tiene un formato válido.' });
  }

  const reservation = getById(trimmedCode);

  if (!reservation) {
    return res.status(404).json({ error: 'No encontramos una reserva con ese código de solicitud.' });
  }

  const normalizedInput = normalizeName(sanitizePersonName(trimmedName, 80))
  if (normalizeName(reservation.name) !== normalizedInput) {
    return res.status(404).json({ error: 'El nombre del titular no coincide con la reserva indicada.' });
  }

  res.json({ reservation: toPublicReservation(reservation) });
});

// GET /api/reservations/:id
router.get('/:id', (req, res) => {
  const reservation = getById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  res.json({ reservation });
});

// POST /api/reservations
router.post('/', (req, res) => {
  const {
    checkIn,
    checkOut,
    name,
    email,
    phone,
    guests,
    notes,
    paymentProof,
    guestDetails,
    guestRoster,
    holderFirstName,
    holderLastName,
    estimatedTotal,
  } = req.body;

  if (!checkIn || !checkOut || !name || !email || !phone) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (!paymentProof || !paymentProof.dataUrl) {
    return res.status(400).json({ error: 'Debes subir el comprobante de pago' });
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la entrada' });
  }

  if (hasDateConflict({ checkIn, checkOut })) {
    return res.status(409).json({ error: 'Las fechas seleccionadas no están disponibles' });
  }

  try {
    const reservation = create({
      checkIn,
      checkOut,
      name: sanitizePersonName(name, 80),
      email: sanitizeEmail(email),
      phone: sanitizePhone(phone),
      guests: parseInt(guests, 10) || 1,
      notes: sanitize(notes || ''),
      guestDetails: guestDetails || null,
      guestRoster: sanitizeGuestRoster(guestRoster),
      holderFirstName: sanitizePersonName(holderFirstName || '', 50),
      holderLastName: sanitizePersonName(holderLastName || '', 50),
      estimatedTotal: Number(estimatedTotal) || 0,
      paymentProof: {
        fileName: sanitize(paymentProof.fileName || 'comprobante'),
        fileType: sanitize(paymentProof.fileType || ''),
        dataUrl: paymentProof.dataUrl
      },
      status: 'pending_review',
      accessCode: null,
      reviewedAt: null,
      reviewNotes: ''
    });

    if (_wss) {
      broadcast(_wss, { type: 'reservation-created', reservation });
    }

    res.status(201).json({ message: 'Reserva enviada para revisión', reservation });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
});

// PATCH /api/reservations/:id/approve — solo admin
router.patch('/:id/approve', requireAuth, (req, res) => {
  const reservation = getById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  if (reservation.status === 'approved') {
    return res.json({ message: 'La reserva ya estaba aprobada', reservation });
  }

  const updated = update(req.params.id, {
    status: 'approved',
    accessCode: reservation.accessCode || generateAccessCode(),
    reviewedAt: new Date().toISOString(),
    reviewNotes: sanitize(req.body?.reviewNotes || '')
  });

  if (_wss) {
    broadcast(_wss, { type: 'reservation-approved', reservation: updated });
  }

  res.json({ message: 'Reserva aprobada', reservation: updated });
});

// PATCH /api/reservations/:id/reject — solo admin
router.patch('/:id/reject', requireAuth, (req, res) => {
  const reservation = getById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  const updated = update(req.params.id, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewNotes: sanitize(req.body?.reviewNotes || '')
  });

  if (_wss) {
    broadcast(_wss, { type: 'reservation-rejected', reservation: updated });
  }

  res.json({ message: 'Reserva rechazada', reservation: updated });
});

// DELETE /api/reservations/:id — solo admin
router.delete('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  try {
    remove(id);
    if (_wss) {
      broadcast(_wss, { type: 'reservation-cancelled', id });
    }
    res.json({ message: `Reserva ${id} cancelada` });
  } catch (err) {
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});

export default router;
