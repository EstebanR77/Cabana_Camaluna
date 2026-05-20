import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// ── Reservas ────────────────────────────────────────────
export const getReservations = () => api.get('/reservations');
export const createReservation = (data) => api.post('/reservations', data);
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// ── Contacto ────────────────────────────────────────────
export const getContact = () => api.get('/contact');

// ── Auth ────────────────────────────────────────────────
export const login  = (data) => api.post('/login', data);
export const logout = ()     => api.post('/logout');

export default api;
