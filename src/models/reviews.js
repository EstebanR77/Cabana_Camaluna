import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { validateReviewPayload } from '../utils/security.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = path.join(__dirname, '../data/reviews.json')
const AVATARS = [
  '/images/Mujer avatar.jpg',
  '/images/Hombre avatar.jpg',
  '/images/Anfitriones.jpeg',
]

function readReviews() {
  if (!fs.existsSync(FILE)) return []
  const data = fs.readFileSync(FILE, 'utf-8')
  return JSON.parse(data || '[]')
}

function writeReviews(reviews) {
  fs.writeFileSync(FILE, JSON.stringify(reviews, null, 2))
}

export function getAll() {
  return readReviews().filter((review) => review.visible === true)
}

export function create(review) {
  const validation = validateReviewPayload(review)

  if (validation.error) {
    const error = new Error(validation.error)
    error.status = validation.status || 400
    throw error
  }

  const cleanReview = validation.clean
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
