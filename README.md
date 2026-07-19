# mfe-reportes

Micro-frontend remote (Webpack 5 Module Federation) que expone el componente `TablaTransacciones`, consumido por `shell-app`.

- Nombre del remote: `reportes`
- Módulo expuesto: `./TablaTransacciones` (`remoteEntry.js`)
- Consume `GET /api/transacciones/:cuentaId` de `api-node`, vía la variable de entorno `API_URL`.

## Correr standalone (desarrollo)

```bash
npm install
API_URL=http://localhost:3001 npm start
```

Abre `http://localhost:3003` — el componente `TablaTransacciones` se renderiza standalone dentro de un wrapper simple, consumiendo la API local.

## Tests

```bash
npm test
```

## Build de producción

```bash
API_URL=http://api-node:3001 npm run build
```

Genera `dist/remoteEntry.js` y los estáticos que consumirá el shell vía Module Federation.

## Docker

```bash
docker build --build-arg API_URL=http://localhost:3001 -t mfe-reportes .
docker run -p 3003:80 mfe-reportes
```

El contenedor sirve `remoteEntry.js` y los estáticos con nginx en el puerto `80`, con CORS habilitado para que el shell pueda cargarlo desde otro origen.
