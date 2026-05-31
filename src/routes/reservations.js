import { Router } from 'express'
import crypto from 'crypto'
import { create, findById, getAll, remove, update } from '../models/reservations.js'
import { sanitize, requireAuth } from '../utils/security.js'
import { broadcast } from '../utils/broadcast.js'

const router = Router()

let _wss = null
export function setWss(wss) { _wss = wss }

function hasDateConflict({ checkIn, checkOut }, ignoreId = null) {
  const newIn = new Date(checkIn)
  const newOut = new Date(checkOut)
  return getAll().some(r => {
    if (ignoreId && r.id === ignoreId) return false
    if (r.status === 'rejected') return false
    const rIn = new Date(r.checkIn)
    const rOut = new Date(r.checkOut)
    return newIn < rOut && newOut > rIn
  })
}

function generateAccessCode() {
  return crypto.randomInt(1000, 9999).toString()
}

router.get('/', (req, res) => {
  try {
    res.json({ reservations: getAll() })
  } catch {
    res.status(500).json({ error: 'Error al obtener reservas' })
  }
})

router.get('/admin', requireAuth, (req, res) => {
  try {
    res.json({ reservations: getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) })
  } catch {
    res.status(500).json({ error: 'Error al obtener reservas' })
  }
})

router.get('/:id', (req, res) => {
  const reservation = findById(req.params.id)
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' })
  res.json({ reservation })
})

router.post('/', (req, res) => {
  const { checkIn, checkOut, name, email, phone, guests, notes, guestCounts, guestDetails, paymentProof } = req.body

  if (!checkIn || !checkOut || !name || !email || !phone) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la entrada' })
  }

  if (hasDateConflict({ checkIn, checkOut })) {
    return res.status(409).json({ error: 'Las fechas seleccionadas no están disponibles' })
  }

  if (!paymentProof?.data) {
    return res.status(400).json({ error: 'Debes adjuntar el comprobante de pago' })
  }

  try {
    const reservation = create({
      checkIn,
      checkOut,
      name: sanitize(name),
      email: sanitize(email),
      phone: sanitize(phone),
      guests: parseInt(guests) || 1,
      guestCounts: guestCounts || null,
      guestDetails: Array.isArray(guestDetails) ? guestDetails.map(g => ({
        type: sanitize(g.type || ''),
        fullName: sanitize(g.fullName || ''),
        document: sanitize(g.document || ''),
        age: sanitize(String(g.age || ''))
      })) : [],
      notes: sanitize(notes || ''),
      paymentProof,
      status: 'pending_review',
      accessCode: null,
      reviewedAt: null,
      createdAt: new Date().toISOString()
    })

    if (_wss) broadcast(_wss, { type: 'reservation-created', reservation })
    res.status(201).json({ message: 'Reserva enviada para revisión', reservation })
  } catch {
    res.status(500).json({ error: 'Error al guardar la reserva' })
  }
})

router.patch('/:id/approve', requireAuth, (req, res) => {
  const reservation = findById(req.params.id)
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' })

  const updated = update(req.params.id, {
    status: 'approved',
    accessCode: reservation.accessCode || generateAccessCode(),
    reviewedAt: new Date().toISOString()
  })

  if (_wss) broadcast(_wss, { type: 'reservation-approved', reservation: updated })
  res.json({ message: 'Reserva aprobada', reservation: updated })
})

router.patch('/:id/reject', requireAuth, (req, res) => {
  const reservation = findById(req.params.id)
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' })

  const updated = update(req.params.id, {
    status: 'rejected',
    reviewedAt: new Date().toISOString()
  })

  if (_wss) broadcast(_wss, { type: 'reservation-rejected', reservation: updated })
  res.json({ message: 'Reserva rechazada', reservation: updated })
})

router.delete('/:id', requireAuth, (req, res) => {
  try {
    remove(req.params.id)
    if (_wss) broadcast(_wss, { type: 'reservation-cancelled', id: req.params.id })
    res.json({ message: `Reserva ${req.params.id} cancelada` })
  } catch {
    res.status(500).json({ error: 'Error al cancelar la reserva' })
  }
})

export default router
