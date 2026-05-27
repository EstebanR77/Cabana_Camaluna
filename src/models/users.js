import fs     from 'fs';
import path   from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '../data/users.json');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function findByUsername(username) {
  const data  = fs.readFileSync(FILE, 'utf-8');
  const users = JSON.parse(data || '[]');
  const normalized = String(username || '').trim().toLowerCase();

  return users.find(u =>
    String(u.username || '').toLowerCase() === normalized ||
    String(u.email || '').toLowerCase() === normalized
  ) || null;
}

export function verifyPassword(user, password) {
  return user.passwordHash === hashPassword(password);
}
