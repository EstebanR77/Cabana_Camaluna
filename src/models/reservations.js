import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '../data/reservations.json');

export function getAll() {
  const data = fs.readFileSync(FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

export function create(reservation) {
  const reservations = getAll();
  reservation.id = Date.now().toString();
  reservations.push(reservation);
  fs.writeFileSync(FILE, JSON.stringify(reservations, null, 2));
  return reservation;
}

export function remove(id) {
  const reservations = getAll().filter(r => r.id !== id);
  fs.writeFileSync(FILE, JSON.stringify(reservations, null, 2));
}
