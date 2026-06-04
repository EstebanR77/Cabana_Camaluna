import fs     from 'fs';
import path   from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '../data/users.json');

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function findByUsername(username) {
  const data  = fs.readFileSync(FILE, 'utf-8');
  const users = JSON.parse(data || '[]');
  const value = String(username || '').trim().toLowerCase();

  return users.find(u =>
    String(u.username || '').toLowerCase() === value ||
    String(u.email || '').toLowerCase() === value
  ) || null;
}

export function verifyPassword(user, password) {
  const stored = user.passwordHash || '';
  const hashed = hashPassword(password);
  if (stored === hashed) return true;
  // Compatibilidad si en users.json quedó la contraseña en texto plano por error
  if (stored.length < 64 && stored === password) return true;
  return false;
}
