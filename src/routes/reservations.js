import { Router } from 'express';
import { getAll, create, remove } from '../models/reservations.js';
import { sanitize, requireAuth } from '../utils/security.js';
import { broadcast } from '../utils/broadcast.js';

const router = Router();

// Referencia al wss inyectada desde server.js
let _wss = null;
export function setWss(wss) { _wss = wss; }

// GET /api/reservations
router.get('/', (req, res) => {
  try {
    const reservations = getAll();
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// POST /api/reservations
router.post('/', (req, res) => {
  const { checkIn, checkOut, name, email, phone, guests, notes } = req.body;

  if (!checkIn || !checkOut || !name || !email || !phone) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la entrada' });
  }

  // Verificar conflicto de fechas
  const existing = getAll();
  const conflict = existing.some(r => {
    const rIn  = new Date(r.checkIn);
    const rOut = new Date(r.checkOut);
    const newIn  = new Date(checkIn);
    const newOut = new Date(checkOut);
    return newIn < rOut && newOut > rIn;
  });

  if (conflict) {
    return res.status(409).json({ error: 'Las fechas seleccionadas no están disponibles' });
  }

  try {
    const reservation = create({
      checkIn,
      checkOut,
      name:   sanitize(name),
      email:  sanitize(email),
      phone:  sanitize(phone),
      guests: parseInt(guests) || 1,
      notes:  sanitize(notes || ''),
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Notificar a todos los clientes WebSocket conectados
    if (_wss) {
      broadcast(_wss, { type: 'reservation-created', reservation });
    }

    res.status(201).json({ message: 'Reserva creada', reservation });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
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
