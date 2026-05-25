# Camaluna

Proyecto web de Camaluna con arquitectura separada:

```txt
src/          Backend: servidor, rutas, datos, WebSocket y API
client/src/   Frontend: React, páginas, componentes, estilos y servicios
```

## Corrección aplicada

- El `src` principal queda solo para backend.
- El frontend queda únicamente dentro de `client/src`.
- Se rectificó el uso de React Router.
- Se agregó estructura de rutas animadas como en el proyecto guía del profesor: `BrowserRouter`, `Routes`, `Route`, `useLocation`, `AnimatePresence`, `PageTransition`, `Suspense` y `lazy`.
- Se agregó barra de progreso de scroll.

## Ejecutar backend

```bash
npm install
npm run dev
```

## Ejecutar frontend

En otra terminal:

```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000
