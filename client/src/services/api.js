import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// ── Reservas ────────────────────────────────────────────
export const getReservations = () => api.get('/reservations');
export const createReservation = (data) => api.post('/reservations', data);
export const getReservationStatus = (id) => api.get(`/reservations/${id}/status`);
export const getAdminReservations = () => api.get('/reservations/admin');
export const approveReservation = (id) => api.patch(`/reservations/${id}/approve`);
export const rejectReservation = (id, reason = '') => api.patch(`/reservations/${id}/reject`, { reason });
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// ── Contacto ────────────────────────────────────────────
export const getContact = () => api.get('/contact');

// Resenas
export const getReviews = () => api.get('/reviews');
export const createReview = (data) => api.post('/reviews', data);

// ── Auth ────────────────────────────────────────────────
export const login  = (data) => api.post('/login', data);
export const logout = ()     => api.post('/logout');
export const getMe  = ()     => api.get('/me');

export default api;
