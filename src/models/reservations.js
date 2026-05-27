import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '../data/reservations.json');

function ensureFile() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, '[]');
  }
}

function saveAll(reservations) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(reservations, null, 2));
}

export function getAll() {
  ensureFile();
  const data = fs.readFileSync(FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

export function getById(id) {
  return getAll().find(r => r.id === id) || null;
}

export function create(reservation) {
  const reservations = getAll();
  const record = {
    ...reservation,
    id: Date.now().toString(),
    createdAt: reservation.createdAt || new Date().toISOString()
  };
  reservations.push(record);
  saveAll(reservations);
  return record;
}

export function update(id, changes) {
  const reservations = getAll();
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) return null;

  reservations[index] = {
    ...reservations[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  saveAll(reservations);
  return reservations[index];
}

export function remove(id) {
  const reservations = getAll().filter(r => r.id !== id);
  saveAll(reservations);
}
