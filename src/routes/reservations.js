import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../models/reservations.js';
import { sanitize, requireAuth } from '../utils/security.js';
import { broadcast } from '../utils/broadcast.js';

const router = Router();

let _wss = null;
export function setWss(wss) { _wss = wss; }

function notify(payload) {
  if (_wss) broadcast(_wss, payload);
}

function generateEntryCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hasConflict(checkIn, checkOut) {
  const newIn = new Date(checkIn);
  const newOut = new Date(checkOut);

  return getAll().some(r => {
    if (r.status === 'rejected' || r.status === 'cancelled') return false;

    const rIn = new Date(r.checkIn);
    const rOut = new Date(r.checkOut);

    return newIn < rOut && newOut > rIn;
  });
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

// GET /api/reservations/admin — panel administrativo
router.get('/admin', requireAuth, (req, res) => {
  try {
    const reservations = getAll()
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas del administrador' });
  }
});

// GET /api/reservations/:id/status — seguimiento del usuario
router.get('/:id/status', (req, res) => {
  const reservation = getById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  res.json({
    id: reservation.id,
    status: reservation.status,
    entryCode: reservation.entryCode || null,
    reviewMessage: reservation.reviewMessage || ''
  });
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
    paymentProofName,
    total
  } = req.body;

  if (!checkIn || !checkOut || !name || !email || !phone) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (!paymentProof) {
    return res.status(400).json({ error: 'Debes subir el comprobante de pago' });
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la entrada' });
  }

  if (hasConflict(checkIn, checkOut)) {
    return res.status(409).json({ error: 'Las fechas seleccionadas no están disponibles' });
  }

  try {
    const reservation = create({
      checkIn,
      checkOut,
      name: sanitize(name),
      email: sanitize(email),
      phone: sanitize(phone),
      guests: parseInt(guests, 10) || 1,
      notes: sanitize(notes || ''),
      total: Number(total) || 0,
      paymentProof,
      paymentProofName: sanitize(paymentProofName || 'comprobante'),
      status: 'pending_review',
      reviewMessage: 'Tu comprobante fue recibido. Está pendiente de revisión por el administrador.'
    });

    notify({ type: 'reservation-created', reservation });

    res.status(201).json({ message: 'Reserva recibida para revisión', reservation });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
});

// PATCH /api/reservations/:id/approve — admin
router.patch('/:id/approve', requireAuth, (req, res) => {
  const reservation = getById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  const entryCode = reservation.entryCode || generateEntryCode();

  const updated = update(req.params.id, {
    status: 'approved',
    entryCode,
    reviewedAt: new Date().toISOString(),
    reviewedBy: req.session.user?.username || 'admin',
    reviewMessage: 'Tu reserva fue confirmada. Este es tu código de entrada.'
  });

  notify({ type: 'reservation-approved', reservation: updated });

  res.json({ message: 'Reserva aprobada', reservation: updated });
});

// PATCH /api/reservations/:id/reject — admin
router.patch('/:id/reject', requireAuth, (req, res) => {
  const reservation = getById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  const updated = update(req.params.id, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: req.session.user?.username || 'admin',
    reviewMessage: sanitize(req.body.reason || 'El comprobante fue rechazado. Comunícate con Camaluna para revisar la reserva.')
  });

  notify({ type: 'reservation-rejected', reservation: updated });

  res.json({ message: 'Reserva rechazada', reservation: updated });
});

// DELETE /api/reservations/:id — solo admin
router.delete('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  try {
    remove(id);
    notify({ type: 'reservation-cancelled', id });
    res.json({ message: `Reserva ${id} cancelada` });
  } catch (err) {
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});

export default router;
