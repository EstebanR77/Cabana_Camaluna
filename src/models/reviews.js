import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = path.join(__dirname, '../data/reviews.json')
const AVATARS = [
  '/images/Mujer avatar.jpg',
  '/images/Hombre avatar.jpg',
  '/images/Anfitriones.jpeg',
]
const DANGEROUS_PATTERN = /[<>{}$\\]/

function readReviews() {
  if (!fs.existsSync(FILE)) return []
  const data = fs.readFileSync(FILE, 'utf-8')
  return JSON.parse(data || '[]')
}

function writeReviews(reviews) {
  fs.writeFileSync(FILE, JSON.stringify(reviews, null, 2))
}

function normalizeText(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)
}

function sanitizeReview(review) {
  return {
    name: normalizeText(review.name, 70),
    stayDate: normalizeText(review.stayDate, 10),
    text: normalizeText(review.text, 500),
    stars: Math.min(5, Math.max(1, Number(review.stars) || 5)),
  }
}

export function getAll() {
  return readReviews().filter((review) => review.visible === true)
}

export function create(review) {
  const cleanReview = sanitizeReview(review)

  if (!cleanReview.name || !cleanReview.stayDate || !cleanReview.text) {
    const error = new Error('Nombre, fecha de estadía y reseña son obligatorios.')
    error.status = 400
    throw error
  }

  if (cleanReview.name.length < 3 || cleanReview.name.length > 70) {
    const error = new Error('El nombre debe tener entre 3 y 70 caracteres.')
    error.status = 400
    throw error
  }

  if (cleanReview.text.length < 20 || cleanReview.text.length > 500) {
    const error = new Error('La reseña debe tener entre 20 y 500 caracteres.')
    error.status = 400
    throw error
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanReview.stayDate)) {
    const error = new Error('Selecciona una fecha de estadía válida.')
    error.status = 400
    throw error
  }

  if (new Date(`${cleanReview.stayDate}T00:00:00`) > new Date()) {
    const error = new Error('La fecha de estadía no puede ser futura.')
    error.status = 400
    throw error
  }

  if (DANGEROUS_PATTERN.test(review.name || '') || DANGEROUS_PATTERN.test(review.text || '')) {
    const error = new Error('Evita usar caracteres especiales como <, >, {, } o $.')
    error.status = 400
    throw error
  }

  const reviews = readReviews()
  const savedReview = {
    id: Date.now().toString(),
    ...cleanReview,
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    visible: false,
    createdAt: new Date().toISOString(),
  }

  reviews.unshift(savedReview)
  writeReviews(reviews)

  return savedReview
}
