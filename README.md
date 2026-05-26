# Camaluna 🏡

Sitio web para **Camaluna** — cabaña en Villa de Leyva.

Arquitectura cliente/servidor:

```
Cabana_Camaluna/
├── src/          → Backend: Express + WebSocket + API
├── client/       → Frontend: React + Vite
├── .env          → Variables de entorno del backend
└── package.json
```

## 📋 Requisitos

- **Node.js 18+** (recomendado 20 LTS o superior)
- **npm 9+**

Verificar versiones:
```bash
node -v
npm -v
```

## 🚀 Instalación

Después de descomprimir el proyecto, instala las dependencias en **dos pasos**:

### 1) Backend (carpeta raíz)
```bash
npm install
```

### 2) Frontend (carpeta `client/`)
```bash
cd client
npm install
cd ..
```

## ▶️ Ejecutar el proyecto

Necesitas **dos terminales abiertas**:

### Terminal 1 — Backend
Desde la carpeta raíz `Cabana_Camaluna/`:
```bash
npm run dev
```
Corre en → http://localhost:3000

### Terminal 2 — Frontend
Desde `Cabana_Camaluna/client/`:
```bash
npm run dev
```
Corre en → http://localhost:5173

Abre el navegador en **http://localhost:5173**. El frontend tiene proxy configurado, así que las llamadas a `/api` y `/ws` se redirigen al backend automáticamente.

## 🔐 Variables de entorno

El archivo `.env` ya está incluido con valores por defecto para desarrollo. Para producción, copia `.env.example` a `.env` y cambia `SESSION_SECRET` por una clave fuerte.

## 👤 Usuario admin de prueba

- **Usuario:** `admin`
- **Contraseña:** `admin123`

(definido en `src/data/users.json` con hash SHA-256)

## 🛠️ Scripts disponibles

### Backend (raíz)
- `npm run dev` — Servidor con nodemon (recarga automática)
- `npm start` — Servidor en modo producción

### Frontend (`client/`)
- `npm run dev` — Vite en modo desarrollo
- `npm run build` — Build de producción → `client/dist/`
- `npm run preview` — Previsualizar build

## ❗ Solución de problemas

### Error: `Cannot find module @rollup/rollup-linux-x64-gnu`
Es un bug conocido de npm con dependencias opcionales nativas. Solución:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```
(en Windows: `Remove-Item -Recurse -Force node_modules, package-lock.json`)

### El puerto 3000 o 5173 ya está en uso
Cambia `PORT` en `.env` o usa otra terminal libre.

## 📦 Características

- 🏠 Landing page con secciones animadas (Framer Motion)
- 📅 Sistema de reservas con calendario interactivo en tiempo real (WebSocket)
- 💬 Chat en vivo (WebSocket)
- 🔐 Login para anfitrión (sesiones con `express-session`)
- 📱 Diseño responsive
- 🎨 Animaciones de transición entre páginas
- 📊 Barra de progreso de scroll

## 🏗️ Stack

**Backend:** Express 4, express-session, ws (WebSocket), dotenv  
**Frontend:** React 18, Vite 5, React Router 6, Framer Motion 11, Axios, React Calendar
