# CAMALUNA 🌙

Sitio web para **Camaluna**, una cabaña de hospedaje ubicada en **Villa de Leyva, Boyacá**, que ofrece una experiencia natural y tranquila para sus huéspedes.

---

## 1. Cómo inicializar el proyecto

### Requisitos previos
- **Node.js** v18 o superior ([descargar aquí](https://nodejs.org))
- **npm** (viene incluido con Node.js)

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/<tu-usuario>/camaluna.git
cd camaluna
```

**2. Desbloquear permisos de ejecución (solo Windows)**

Abrir la terminal de VS Code y ejecutar:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
> Esto solo aplica a la ventana actual. No cerrar la terminal después de esto.

**3. Instalar dependencias del backend**
```bash
npm install
```

**4. Instalar dependencias del frontend**
```bash
cd client
npm install
cd ..
```

**5. Configurar variables de entorno**

Duplicar el archivo `.env.example`, renombrarlo a `.env` y completar los valores requeridos.

**6. Levantar el servidor backend**
```bash
node src/server.js
```

**7. Levantar el cliente React (en otra terminal)**
```bash
cd client
npm run dev
```

**8. Abrir en el navegador**
```
http://localhost:5173
```

---

## 2. Cómo se organiza el proyecto

```
/
├── package.json                  → Dependencias y scripts del backend
├── .env.example                  → Variables de entorno requeridas
├── .gitignore                    → Archivos ignorados por Git
├── README.md                     → Este archivo
│
├── src/                          → Código del servidor (backend)
│   ├── server.js                 → Servidor principal HTTP + WebSocket
│   ├── data/
│   │   ├── users.json            → Base de datos local de usuarios
│   │   └── reservations.json     → Base de datos local de reservas
│   ├── models/
│   │   ├── users.js              → Funciones para leer y modificar usuarios
│   │   └── reservations.js       → Funciones para leer y modificar reservas
│   ├── routes/
│   │   ├── auth.js               → Ruta /api/login (autenticación)
│   │   ├── reservations.js       → Rutas /api/reservations (CRUD de reservas)
│   │   └── contact.js            → Ruta /api/contact
│   ├── utils/
│   │   ├── broadcast.js          → Función para enviar mensajes a clientes WS
│   │   └── security.js           → Funciones de sanitización y seguridad
│   └── web/
│       ├── chat.js               → Lógica WebSocket del chat (ayuda y contacto)
│       └── calendar.js           → Lógica WebSocket del calendario (reservas)
│
└── client/                       → Aplicación React (frontend)
    ├── public/
    │   └── index.html            → HTML base de la app
    └── src/
        ├── main.jsx              → Punto de entrada de React
        ├── App.jsx               → Enrutamiento principal
        ├── pages/
        │   ├── Home.jsx          → Página de inicio
        │   ├── Cabin.jsx         → La cabaña (comodidades, reglas, video)
        │   ├── Reserve.jsx       → Reservar (calendario + formulario)
        │   ├── About.jsx         → Sobre Villa de Leyva
        │   ├── Contact.jsx       → Ayuda y contacto (chat en tiempo real)
        │   ├── Gallery.jsx       → Galería de fotos
        │   └── Experiences.jsx   → Experiencias y reseñas
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx    → Barra de navegación
        │   │   └── Footer.jsx    → Pie de página
        │   ├── calendar/
        │   │   ├── AvailabilityCalendar.jsx  → Calendario tiempo real (WS)
        │   │   └── ReservationForm.jsx       → Formulario de reserva
        │   └── chat/
        │       ├── SupportChat.jsx   → Chat de soporte tiempo real (WS)
        │       └── ChatMessage.jsx   → Componente de mensaje individual
        ├── services/
        │   ├── api.js              → Llamadas a la API REST
        │   ├── calendarSocket.js   → WebSocket del calendario (cliente)
        │   └── chatSocket.js       → WebSocket del chat (cliente)
        ├── hooks/
        │   ├── useCalendar.js      → Hook para estado del calendario
        │   └── useChat.js          → Hook para estado del chat
        └── context/
            └── ReservationContext.jsx  → Contexto global de reservas
```

---

## 3. Flujo de la aplicación

```
Inicio → Explorar cabaña → Ver disponibilidad → Reservar → Contacto/Chat
```

1. El visitante llega a la página de **Inicio** y explora la cabaña
2. En **Reservar**, el calendario se conecta al servidor vía **WebSocket** y muestra disponibilidad en tiempo real
3. Si otro usuario reserva una fecha, el calendario se actualiza automáticamente para todos
4. En **Ayuda y Contacto**, el visitante puede abrir un **chat en tiempo real** con los anfitriones
5. El chat también usa WebSocket para comunicación instantánea

---

## 4. Tecnologías usadas

| Tecnología | Uso |
|---|---|
| Node.js | Servidor backend |
| Express | Manejo de rutas HTTP |
| WebSocket (`ws`) | Comunicación en tiempo real (calendario y chat) |
| React (JSX) | Interfaz del usuario |
| Vite | Herramienta de desarrollo del frontend |
| React Router | Navegación entre páginas |

---

## 5. Variables de entorno requeridas

Copiar `.env.example` a `.env` y completar:

```
PORT=3000
SESSION_SECRET=tu_clave_secreta_aqui
```

---

## 6. Secciones del sitio

| Sección | Página | Descripción |
|---|---|---|
| Inicio | Home.jsx | Bienvenida y presentación |
| La Cabaña | Cabin.jsx | Comodidades, reglas, video recorrido |
| Reservar | Reserve.jsx | Calendario de disponibilidad + formulario |
| Sobre Villa de Leyva | About.jsx | Clima, restaurantes, historia, eventos |
| Ayuda y Contacto | Contact.jsx | Chat en tiempo real + WhatsApp + FAQ |
| Galería | Gallery.jsx | Fotos del área social, terraza y habitaciones |
| Experiencias | Experiences.jsx | Reseñas y testimonios de huéspedes |
