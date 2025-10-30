# Notas Rápidas — PWA (Nuxt 3, Offline)

Pequeña app de notas que funciona sin conexión, se instala en el móvil y guarda datos localmente (IndexedDB).

## Requisitos
- Node.js 18+
- npm o pnpm

## Pasos
```bash
npm i
npm run dev
```

Abre http://localhost:3000 y prueba a:
- Crear, editar y borrar notas
- Apagar Internet: la app sigue funcionando (gracias al Service Worker y a IndexedDB)
- Instalarla: en Chrome/Edge verás el botón "Instalar" (o el ícono de plus). En Android, también desde el menú "Añadir a pantalla de inicio".

## Build / Preview / Empaquetado
```bash
npm run build
npm run preview
```

> Si quieres empacarla como app nativa, puedes usar Capacitor (Android/iOS) más adelante.
