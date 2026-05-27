import { Router } from 'express';
import { create, getAll, getById, remove, update } from '../models/reservations.js';
import { sanitize, requireAuth } from '../utils/security.js';
import { broadcast } from '../utils/broadcast.js';

const router = Router();

let _wss = null;
export function setWss(wss) { _wss = wss; }

function normalizeDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function hasConflict({ checkIn, checkOut }) {
  const newIn = new Date(checkIn);
  const newOut = new Date(checkOut);

  return getAll().some(r => {
    if (r.status === 'rejected') return false;
    const rIn = new Date(r.checkIn);
    const rOut = new Date(r.checkOut);
    return newIn < rOut && newOut > rIn;
  });
}

function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.get('/', (req, res) => {
  try {
    const reservations = getAll().map(({ paymentProof, ...reservation }) => reservation);
    res.json({ reservations });
  } catch {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

router.get('/admin', requireAuth, (req, res) => {
  try {
    const reservations = getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ reservations });
  } catch {
    res.status(500).json({ error: 'Error al obtener reservas del administrador' });
  }
});

router.get('/:id', (req, res) => {
  const reservation = getById(req.params.id);
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });

  const { paymentProof, ...safeReservation } = reservation;
  res.json({ reservation: safeReservation });
});

router.post('/', (req, res) => {
  const { checkIn, checkOut, name, email, phone, guests, notes, paymentProof } = req.body;
  const normalizedCheckIn = normalizeDate(checkIn);
  const normalizedCheckOut = normalizeDate(checkOut);

  if (!normalizedCheckIn || !normalizedCheckOut || !name || !email || !phone) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (new Date(normalizedCheckIn) >= new Date(normalizedCheckOut)) {
    return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la entrada' });
  }

  if (!paymentProof?.data) {
    return res.status(400).json({ error: 'Debes adjuntar el comprobante de pago' });
  }

  if (hasConflict({ checkIn: normalizedCheckIn, checkOut: normalizedCheckOut })) {
    return res.status(409).json({ error: 'Las fechas seleccionadas no están disponibles' });
  }

  try {
    const reservation = create({
      checkIn: normalizedCheckIn,
      checkOut: normalizedCheckOut,
      name: sanitize(name),
      email: sanitize(email),
      phone: sanitize(phone),
      guests: parseInt(guests, 10) || 1,
      notes: sanitize(notes || ''),
      paymentProof: {
        name: sanitize(paymentProof.name || 'comprobante'),
        type: sanitize(paymentProof.type || ''),
        size: Number(paymentProof.size) || 0,
        data: paymentProof.data
      },
      status: 'pending_review',
      createdAt: new Date().toISOString()
    });

    if (_wss) broadcast(_wss, { type: 'reservation-created', reservation });

    const { paymentProof: _proof, ...safeReservation } = reservation;
    res.status(201).json({ message: 'Reserva enviada para revisión', reservation: safeReservation });
  } catch {
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
});

router.patch('/:id/approve', requireAuth, (req, res) => {
  const reservation = update(req.params.id, {
    status: 'approved',
    accessCode: generateAccessCode(),
    reviewedAt: new Date().toISOString(),
    reviewedBy: req.session.user?.username || 'admin'
  });

  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
  if (_wss) broadcast(_wss, { type: 'reservation-approved', reservation });
  res.json({ message: 'Reserva aprobada', reservation });
});

router.patch('/:id/reject', requireAuth, (req, res) => {
  const reservation = update(req.params.id, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: req.session.user?.username || 'admin'
  });

  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
  if (_wss) broadcast(_wss, { type: 'reservation-rejected', reservation });
  res.json({ message: 'Reserva rechazada', reservation });
});

router.delete('/:id', requireAuth, (req, res) => {
  try {
    remove(req.params.id);
    if (_wss) broadcast(_wss, { type: 'reservation-cancelled', id: req.params.id });
    res.json({ message: `Reserva ${req.params.id} cancelada` });
  } catch {
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});

export default router;
