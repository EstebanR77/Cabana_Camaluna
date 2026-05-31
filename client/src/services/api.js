import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// ── Reservas ────────────────────────────────────────────
export const getReservations = () => api.get('/reservations')
export const getReservation = (id) => api.get(`/reservations/${id}`)
export const getAdminReservations = () => api.get('/reservations/admin')
export const createReservation = (data) => api.post('/reservations', data)
export const approveReservation = (id) => api.patch(`/reservations/${id}/approve`)
export const rejectReservation = (id) => api.patch(`/reservations/${id}/reject`)
export const deleteReservation = (id) => api.delete(`/reservations/${id}`)

// ── Contacto ────────────────────────────────────────────
export const getContact = () => api.get('/contact')

// ── Auth ────────────────────────────────────────────────
export const login = (data) => api.post('/login', data)
export const logout = () => api.post('/logout')
export const getMe = () => api.get('/me')

export default api
