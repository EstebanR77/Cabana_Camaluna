/**
 * Mata cualquier proceso colgado en el puerto del servidor antes de arrancar.
 * Funciona en Windows, macOS y Linux.
 * Se ejecuta automáticamente antes de `npm run dev` y `npm start`.
 * No usa dependencias externas para no requerir `npm install` previo.
 */
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer .env manualmente (sin depender de dotenv)
function getPort() {
  const envPath = resolve(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    const match = content.match(/^\s*PORT\s*=\s*(\d+)/m);
    if (match) return parseInt(match[1], 10);
  }
  return parseInt(process.env.PORT, 10) || 3000;
}

const PORT = getPort();
const isWindows = process.platform === 'win32';

function killPort(port) {
  try {
    if (isWindows) {
      // Windows: buscar PID con netstat y matar con taskkill
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' });
      const pids = new Set();
      output.split('\n').forEach(line => {
        const match = line.trim().match(/LISTENING\s+(\d+)/);
        if (match) pids.add(match[1]);
      });

      if (pids.size === 0) return false;

      pids.forEach(pid => {
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
          console.log(`🔪  Proceso anterior (PID ${pid}) liberado del puerto ${port}`);
        } catch {
          // ignorar si ya no existe
        }
      });
      return true;
    } else {
      // macOS / Linux
      const pids = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf-8' }).trim();
      if (!pids) return false;
      pids.split('\n').forEach(pid => {
        try {
          execSync(`kill -9 ${pid}`);
          console.log(`🔪  Proceso anterior (PID ${pid}) liberado del puerto ${port}`);
        } catch {
          // ignorar
        }
      });
      return true;
    }
  } catch {
    // no había nada en el puerto, todo bien
    return false;
  }
}

const killed = killPort(PORT);
if (!killed) {
  console.log(`✓  Puerto ${PORT} libre`);
}
