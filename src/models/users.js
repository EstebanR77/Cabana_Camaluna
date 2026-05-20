import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '../data/users.json');

export function findByUsername(username) {
  const data  = fs.readFileSync(FILE, 'utf-8');
  const users = JSON.parse(data || '[]');
  return users.find(u => u.username === username) || null;
}
