import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// ── Reservas ────────────────────────────────────────────
export const getReservations = () => api.get('/reservations');
export const getReservationById = (id) => api.get(`/reservations/${id}`);
export const createReservation = (data) => api.post('/reservations', data);
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// ── Reservas admin ──────────────────────────────────────
export const getAdminReservations = () => api.get('/reservations/admin');
export const approveReservation = (id) => api.patch(`/reservations/${id}/approve`);
export const rejectReservation = (id) => api.patch(`/reservations/${id}/reject`);

// ── Contacto ────────────────────────────────────────────
export const getContact = () => api.get('/contact');

// ── Auth ────────────────────────────────────────────────
export const login  = (data) => api.post('/login', data);
export const logout = ()     => api.post('/logout');
export const me     = ()     => api.get('/me');

export default api;
