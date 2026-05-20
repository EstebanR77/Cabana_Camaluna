import { Router } from 'express';

const router = Router();

// GET /api/reservations
router.get('/', (req, res) => {
  // TODO: leer src/data/reservations.json
  res.json({ reservations: [] });
});

// POST /api/reservations
router.post('/', (req, res) => {
  const { checkIn, checkOut, guestName, guestEmail } = req.body;
  // TODO: guardar en src/data/reservations.json
  // TODO: broadcast via WebSocket
  res.json({ message: 'Reserva creada', checkIn, checkOut });
});

// DELETE /api/reservations/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // TODO: eliminar de src/data/reservations.json
  // TODO: broadcast via WebSocket
  res.json({ message: `Reserva ${id} cancelada` });
});

export default router;
