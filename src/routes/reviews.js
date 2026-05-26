import { Router } from 'express'
import * as reviews from '../models/reviews.js'

const router = Router()

router.get('/', (_, res) => {
  res.json(reviews.getAll())
})

router.post('/', (req, res) => {
  try {
    const review = reviews.create(req.body)
    res.status(201).json(review)
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'No se pudo guardar la reseña.',
    })
  }
})

export default router
