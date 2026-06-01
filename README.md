# Cabaña Boutique Camaluna

## Descripción del proyecto

Cabaña Boutique Camaluna es una página web desarrollada para promocionar y gestionar la reserva de una cabaña ubicada en Villa de Leyva, Boyacá. El proyecto permite mostrar información general del alojamiento, galería de imágenes, experiencias, información turística, contacto, reservas y funciones de administración.

La aplicación tiene una estructura cliente-servidor. El frontend se encarga de mostrar la interfaz visual al usuario y el backend gestiona la lógica de reservas, usuarios administradores, comprobantes de pago y almacenamiento de datos.

---

## Página desplegada

Para la presentación del proyecto se puede desplegar temporalmente la página mediante **ngrok**, permitiendo acceder al sitio desde otros dispositivos mediante una URL pública.

### Pasos para desplegar con ngrok

1. Ejecutar el backend:

```bash
npm run dev
```

2. Ejecutar el frontend:

```bash
cd client
npm run dev
```

3. Exponer el frontend con ngrok:

```bash
ngrok http 5173
```

4. Copiar la URL pública generada por ngrok y compartirla para acceder a la página.

Ejemplo:

```txt
https://xxxx-xxxx-xxxx.ngrok-free.app
```

---

## Estructura general del proyecto

```txt
Cabana_Camaluna/
├── client/                  # Frontend React + Vite
│   ├── public/              # Imágenes, videos y archivos públicos
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Conexión con API
│   │   ├── data/            # Datos usados por el frontend
│   │   ├── context/         # Contextos globales
│   │   └── App.jsx          # Rutas principales
│   └── package.json
│
├── src/                     # Backend Node.js + Express
│   ├── server.js            # Archivo principal del servidor
│   ├── routes/              # Rutas API
│   ├── models/              # Lógica de manejo de datos
│   ├── data/                # Archivos JSON de almacenamiento
│   ├── utils/               # Funciones auxiliares
│   └── web/                 # Configuración adicional del servidor
│
├── package.json
├── .env.example
└── README.md
```

---

## Modelo cliente-servidor

El proyecto funciona bajo un modelo cliente-servidor.

El **cliente** corresponde al frontend desarrollado con React y Vite, ubicado en la carpeta `client/`. Esta parte se encarga de mostrar las páginas, formularios, navegación, calendario de reserva e interfaz visual.

El **servidor** corresponde al backend desarrollado con Node.js y Express, ubicado en la carpeta `src/`. Esta parte se encarga de recibir las peticiones del frontend, validar datos, manejar reservas, administrar sesiones y guardar información en archivos JSON.

### Flujo básico de datos

```txt
Usuario interactúa con la página
        ↓
Frontend React captura los datos
        ↓
Axios/fetch envía una petición HTTP al backend
        ↓
Backend Express recibe y valida la información
        ↓
Los datos se guardan o consultan en archivos JSON
        ↓
Backend responde al frontend
        ↓
El usuario visualiza el resultado en pantalla
```

### Ejemplo de flujo de reserva

```txt
Usuario selecciona fechas y huéspedes
        ↓
Completa datos personales
        ↓
Sube comprobante de pago
        ↓
Frontend envía la reserva al backend
        ↓
Backend guarda la reserva como pendiente
        ↓
Administrador revisa el comprobante
        ↓
Administrador aprueba o rechaza
        ↓
Si aprueba, se genera código de entrada
        ↓
Usuario visualiza confirmación de reserva
```

---

## Tecnologías usadas

### Frontend

| Tecnología | Función | Forma de integración |
|---|---|---|
| React | Construcción de la interfaz por componentes | Se usa en `client/src` para crear páginas y componentes |
| Vite | Servidor de desarrollo y empaquetado | Permite ejecutar el frontend en `localhost:5173` |
| React Router DOM | Manejo de navegación por rutas | Se usa en `client/src/App.jsx` para rutas como `/`, `/reserve`, `/admin` |
| Axios / Fetch | Comunicación con el backend | Se usa en `client/src/services/api.js` |
| Framer Motion | Animaciones y transiciones | Se usa en componentes visuales y transiciones de página |
| React Calendar | Selección de fechas | Se usa en el sistema de reservas |
| CSS Modules | Estilos por componente | Se usa en archivos `.module.css` |
| CSS global | Variables, colores y estilos base | Se usa en `index.css` o `global.css` |

### Backend

| Tecnología | Función | Forma de integración |
|---|---|---|
| Node.js | Entorno de ejecución del backend | Ejecuta el servidor del proyecto |
| Express | Creación del servidor y rutas API | Se usa en `src/server.js` |
| express-session | Manejo de sesión del administrador | Permite mantener sesión activa después del login |
| dotenv | Manejo de variables de entorno | Lee datos desde `.env` |
| ws | WebSocket para comunicación en tiempo real | Se usa para funciones como chat o calendario |
| Nodemon | Reinicio automático en desarrollo | Se usa con `npm run dev` |
| JSON | Almacenamiento local de datos | Se usa en `src/data/` para reservas, usuarios y otros registros |

---

## Librerías usadas

| Librería | Propósito |
|---|---|
| `react` | Permite crear interfaces dinámicas mediante componentes |
| `react-dom` | Renderiza la aplicación React en el navegador |
| `react-router-dom` | Gestiona las rutas internas de la aplicación |
| `axios` | Permite enviar y recibir datos desde el backend |
| `framer-motion` | Añade animaciones y transiciones visuales |
| `react-calendar` | Permite seleccionar fechas en el sistema de reservas |
| `vite` | Compila y ejecuta el frontend en desarrollo |
| `@vitejs/plugin-react` | Integra React con Vite |
| `express` | Permite crear el servidor backend |
| `express-session` | Maneja sesiones del administrador |
| `dotenv` | Permite usar variables de entorno |
| `ws` | Permite conexiones WebSocket |
| `nodemon` | Reinicia automáticamente el servidor durante desarrollo |

---

## Rutas API usadas

| Nombre | Ruta | Método | Función | Conexión |
|---|---|---|---|---|
| Login administrador | `/api/auth/login` | POST | Valida correo/usuario y contraseña del administrador | REST |
| Verificar sesión | `/api/auth/me` | GET | Consulta si el administrador tiene sesión activa | REST |
| Cerrar sesión | `/api/auth/logout` | POST | Finaliza la sesión del administrador | REST |
| Crear reserva | `/api/reservations` | POST | Registra una nueva reserva con datos, fechas, huéspedes y comprobante | REST |
| Consultar reserva | `/api/reservations/:id` | GET | Consulta el estado de una reserva específica | REST |
| Listar reservas admin | `/api/reservations/admin` | GET | Lista las reservas recibidas para revisión del administrador | REST |
| Aprobar reserva | `/api/reservations/:id/approve` | PATCH | Aprueba una reserva y genera código de entrada | REST |
| Rechazar reserva | `/api/reservations/:id/reject` | PATCH | Rechaza una reserva enviada | REST |
| Calendario | `/ws/calendar` | WebSocket | Permite sincronizar disponibilidad de fechas | WebSocket |
| Chat | `/ws/chat` | WebSocket | Permite comunicación mediante chat interactivo | WebSocket |

> Nota: Las rutas pueden variar ligeramente según la implementación final del backend. Se deben verificar en la carpeta `src/routes/`.

---

## Funcionalidades principales

### Página informativa

La página muestra información sobre la cabaña, su ubicación, servicios, experiencias, galería, contacto y recomendaciones para visitantes.

### Sistema de reservas

El sistema de reservas funciona por pasos:

1. Selección de fechas y cantidad de huéspedes.
2. Registro de información del cliente y acompañantes.
3. Información de pago, política de anticipo y carga de comprobante.
4. Estado de espera, aprobación o confirmación de reserva.

### Selector de huéspedes

El sistema permite seleccionar diferentes tipos de huéspedes:

```txt
- Adultos
- Niños
- Bebés
- Mascotas
```

Esto permite calcular y registrar mejor la información de la estadía.

### Comprobante de pago

El usuario puede subir un comprobante de pago durante el proceso de reserva. Este comprobante queda guardado junto con los datos del registro para que el administrador lo revise.

### Estado de espera

Después de enviar el comprobante, la reserva queda en estado pendiente mientras el administrador la revisa.

### Panel de administrador

El administrador puede iniciar sesión y acceder a una interfaz donde ve las reservas recibidas. En esta interfaz puede:

```txt
- Ver datos del cliente.
- Ver fechas de reserva.
- Ver cantidad de huéspedes.
- Visualizar comprobante de pago.
- Aprobar reserva.
- Rechazar reserva.
```

### Código de entrada

Cuando el administrador aprueba una reserva, el sistema genera un código aleatorio de entrada para el usuario. Este código se muestra cuando la reserva queda confirmada.

---

## Usuario administrador de prueba

```txt
Correo: admin@camaluna.com
Usuario alterno: admin
Contraseña: admin123
```

Ruta de acceso:

```txt
http://localhost:5173/admin
```

Panel de reservas:

```txt
http://localhost:5173/admin/reservas
```

---

## Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Entrar a la carpeta principal

```bash
cd Cabana_Camaluna
```

### 3. Instalar dependencias del backend

```bash
npm install
```

### 4. Instalar dependencias del frontend

```bash
cd client
npm install
```

### 5. Volver a la carpeta principal

```bash
cd ..
```

---

## Ejecución del proyecto

### Ejecutar backend

Desde la carpeta principal:

```bash
npm run dev
```

El backend se ejecuta en:

```txt
http://localhost:3000
```

### Ejecutar frontend

En otra terminal:

```bash
cd client
npm run dev
```

El frontend se ejecuta en:

```txt
http://localhost:5173
```

---

## Variables de entorno

El proyecto puede utilizar un archivo `.env` para configurar variables del backend.

Ejemplo:

```env
PORT=3000
SESSION_SECRET=camaluna_secret
WHATSAPP_NUMBER=573107777579
CONTACT_EMAIL=contacto@camaluna.com
```

También puede existir un archivo `.env.example` como guía para el equipo.

---

## Scripts disponibles

### Backend

```bash
npm run dev
```

Ejecuta el servidor backend con nodemon.

```bash
npm start
```

Ejecuta el servidor backend en modo normal.

### Frontend

```bash
cd client
npm run dev
```

Ejecuta el frontend con Vite.

```bash
cd client
npm run build
```

Genera la versión de producción del frontend.

```bash
cd client
npm run preview
```

Permite previsualizar la versión compilada.

---

## Conexión entre frontend y backend

El frontend se comunica con el backend mediante funciones ubicadas en:

```txt
client/src/services/api.js
```

Estas funciones permiten centralizar las peticiones HTTP para:

```txt
- Crear reservas.
- Consultar reservas.
- Iniciar sesión como administrador.
- Cerrar sesión.
- Aprobar reservas.
- Rechazar reservas.
- Consultar reseñas u otros datos.
```

Ejemplo general:

```js
fetch('/api/reservations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

---

## Almacenamiento de datos

El proyecto utiliza archivos JSON como almacenamiento local de datos durante el desarrollo.

Ejemplos:

```txt
src/data/reservations.json
src/data/users.json
src/data/reviews.json
```

Esto permite simular una base de datos sin necesidad de instalar un motor externo.

---

## Flujo de reserva y administración

```txt
1. Usuario ingresa a la página de reserva.
2. Selecciona fechas y número de huéspedes.
3. Llena los formularios solicitados.
4. Revisa información de pago.
5. Sube comprobante.
6. La reserva queda pendiente.
7. Administrador inicia sesión.
8. Administrador revisa el comprobante.
9. Administrador acepta o rechaza.
10. Si acepta, se genera código de entrada.
11. Usuario visualiza confirmación.
```

---

## Consideraciones de usabilidad y accesibilidad

El proyecto busca que la navegación sea clara y que el proceso de reserva sea comprensible para el usuario. Para ello se implementa un flujo por pasos, mensajes de estado y separación entre la vista del cliente y la vista del administrador.

También se recomienda mantener:

```txt
- Botones visibles.
- Textos claros.
- Contraste adecuado.
- Formularios organizados.
- Mensajes de error comprensibles.
- Validaciones antes de enviar datos.
```

---

## Recomendaciones para futuras mejoras

```txt
- Conectar el sistema a una base de datos real.
- Implementar autenticación más segura.
- Mejorar la gestión de archivos de comprobantes.
- Agregar envío automático de correo.
- Mejorar control de disponibilidad de fechas.
- Implementar panel administrativo completo.
- Añadir roles de usuario.
- Optimizar accesibilidad.
- Desplegar en un servidor permanente.
```

---

## Integrantes

```txt
- Jaime Esteban Rodríguez Sánchez
- Sara Jimena Barrera Mora
- Paula Ximena Antonio Franco
- Mery Helen Ortiz Suarez
```

---

## Conclusión

El proyecto Cabaña Boutique Camaluna integra una página informativa con funcionalidades interactivas de reserva y administración. Su arquitectura cliente-servidor permite separar la interfaz visual del manejo de datos, facilitando el mantenimiento del sistema y la incorporación de nuevas funcionalidades.
