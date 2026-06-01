# Cabaña Boutique Camaluna

Sitio web oficial de Camaluna, cabaña boutique ubicada en Villa de Leyva, Boyacá. Permite a los visitantes conocer el alojamiento, hacer reservas y subir comprobantes de pago. Incluye panel de administración para gestionar reservas.

---

## Instrucciones de despliegue (ngrok)

### Requisitos previos

- Node.js v18 o superior
- ngrok instalado ([descargar](https://ngrok.com/download))

### Pasos

**1. Instalar dependencias**

```bash
# Dependencias del servidor
npm install

# Dependencias del cliente
cd client
npm install
cd ..
```

**2. Configurar variables de entorno**

Copia el archivo `.env.example` a `.env` en la raíz del proyecto y completa los valores:

```bash
cp .env.example .env
```

```
PORT=3000
SESSION_SECRET=cambia_esta_clave_secreta
NODE_ENV=development
WHATSAPP_NUMBER=+573000000000
INSTAGRAM_URL=https://instagram.com/camaluna
FACEBOOK_URL=https://facebook.com/camaluna
CONTACT_EMAIL=info@camaluna.com
```

**3. Iniciar el servidor (Terminal 1)**

```bash
npm start
```

**4. Iniciar el frontend (Terminal 2)**

```bash
cd client
npm run dev
```

**5. Exponer con ngrok (Terminal 3)**

```bash
ngrok http 5173 --host-header="localhost:5173"
```

El link generado (ej: `https://abc123.ngrok-free.dev`) es el que se comparte para acceder al sitio desde cualquier dispositivo.

---

## Rutas API usadas

Todas las rutas tienen el prefijo `/api`.

| Nombre | Ruta completa | Método | Función | Conexión |
|---|---|---|---|---|
| Login | `/api/login` | POST | Autenticar al administrador con usuario y contraseña | REST |
| Logout | `/api/logout` | POST | Cerrar sesión del administrador | REST |
| Sesión activa | `/api/me` | GET | Verificar si hay sesión activa | REST |
| Crear reserva | `/api/reservations` | POST | Recibir datos del huésped, fechas y comprobante de pago en base64 | REST |
| Listar reservas (admin) | `/api/reservations/admin` | GET | Obtener todas las reservas — requiere sesión | REST |
| Ver reserva | `/api/reservations/:id` | GET | Consultar el estado de una reserva por ID | REST |
| Aprobar reserva | `/api/reservations/:id/approve` | PATCH | Marcar comprobante como aprobado — requiere sesión | REST |
| Rechazar reserva | `/api/reservations/:id/reject` | PATCH | Marcar comprobante como rechazado — requiere sesión | REST |
| Eliminar reserva | `/api/reservations/:id` | DELETE | Eliminar reserva — requiere sesión | REST |
| Contacto / FAQ | `/api/contact` | GET | Retornar preguntas frecuentes y datos de contacto | REST |
| Health check | `/api/health` | GET | Verificar que el servidor está activo | REST |
| Calendario (WS) | `/ws/calendar` | WebSocket | Sincronizar disponibilidad de fechas en tiempo real | WebSocket |
| Chat (WS) | `/ws/chat` | WebSocket | Canal de mensajería del chat en tiempo real | WebSocket |

### APIs externas no usadas

| API | Razón |
|---|---|
| Google Maps Embed | Se usaron enlaces directos a Google Maps en lugar de embeber el mapa, para evitar la necesidad de una API key adicional |
| Pasarela de pago (PayU, Wompi, etc.) | El proyecto maneja el pago de forma manual — el huésped transfiere y sube el comprobante |
| MongoDB / base de datos externa | Los datos se almacenan en archivos JSON locales (`src/data/`) para simplificar el despliegue sin infraestructura adicional |

---

## Lista de librerías

### Frontend (`client/`)

| Nombre | Función | Integración |
|---|---|---|
| React 18 | Librería principal de UI basada en componentes | `npm install react react-dom` |
| React Router DOM v6 | Navegación entre páginas (SPA) | `npm install react-router-dom` |
| Axios | Llamadas HTTP al backend | `npm install axios` |
| Framer Motion | Animaciones y transiciones de página | `npm install framer-motion` |
| react-calendar | Componente base de calendario (adaptado para selección de rango) | `npm install react-calendar` |
| IM Fell English SC / Lato | Tipografías del proyecto | CDN — Google Fonts (enlace en `index.html`) |

### Backend (`src/`)

| Nombre | Función | Integración |
|---|---|---|
| Express | Framework HTTP del servidor | `npm install express` |
| express-session | Manejo de sesiones para el panel admin | `npm install express-session` |
| ws | Servidor WebSocket para calendario y chat | `npm install ws` |
| dotenv | Carga de variables de entorno desde `.env` | `npm install dotenv` |

---

## Modelo Cliente-Servidor

### Tecnologías por lado

| Lado | Tecnologías |
|---|---|
| **Cliente** | React 18, Vite, React Router DOM, Axios, Framer Motion |
| **Servidor** | Node.js, Express, express-session, ws (WebSocket) |
| **Datos** | Archivos JSON locales (`src/data/reservations.json`, `src/data/users.json`) |

### Comunicación entre cliente y servidor

- **REST (HTTP):** El cliente usa `axios` para hacer peticiones a las rutas `/api/...` del servidor. Vite tiene configurado un proxy en `vite.config.js` que redirige todas las peticiones `/api` y `/ws` al backend en `localhost:3000`.
- **WebSocket:** El cliente abre una conexión directa a `/ws/calendar` y `/ws/chat` para recibir actualizaciones en tiempo real sin necesidad de hacer polling.

### Ejemplo de flujo — Envío de reserva

```
Usuario llena el formulario (fechas, huéspedes, datos personales, comprobante)
        ↓
Cliente convierte el comprobante a base64 (FileReader API)
        ↓
Cliente hace POST /api/reservations con todos los datos en JSON
        ↓
Servidor valida los campos, genera un ID único y guarda en reservations.json
        ↓
Servidor responde con { reservation: { id, status: "pending_review" } }
        ↓
Cliente muestra pantalla de espera y consulta el estado cada 5 segundos (GET /api/reservations/:id)
        ↓
Admin entra al panel (/admin), ve el comprobante y aprueba o rechaza (PATCH /api/reservations/:id/approve)
        ↓
El estado cambia en reservations.json y el cliente detecta el cambio en la siguiente consulta
        ↓
Si aprobada → se muestra el código de entrada al huésped
Si rechazada → se muestra mensaje de rechazo
```

### Diagrama cliente-servidor

```
┌─────────────────────────────────────┐
│           CLIENTE (React)           │
│                                     │
│  Páginas: Home, Cabaña, Reserva,    │
│  Galería, Contacto, Admin Login,    │
│  Panel Admin                        │
│                                     │
│  axios → /api/*   (REST HTTP)       │
│  WebSocket → /ws/calendar           │
│  WebSocket → /ws/chat               │
└────────────┬────────────────────────┘
             │ proxy Vite (dev)
             │ ngrok (despliegue)
             ▼
┌─────────────────────────────────────┐
│         SERVIDOR (Node + Express)   │
│                                     │
│  Rutas: /api/login, /api/logout,    │
│  /api/reservations, /api/contact    │
│                                     │
│  Sesión: express-session            │
│  WebSocket: ws                      │
└────────────┬────────────────────────┘
             │ lectura / escritura
             ▼
┌─────────────────────────────────────┐
│       DATOS (archivos JSON)         │
│                                     │
│  src/data/reservations.json         │
│  src/data/users.json                │
└─────────────────────────────────────┘
```
