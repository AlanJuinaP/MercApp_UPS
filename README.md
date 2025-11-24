# Autor #

Alan Juiña — Ingeniería en Software
Universidad Politécnica Salesiana

## Descripción

MercApp es una aplicación web tipo catálogo/mercado desarrollada como parte de la Unidad 2 y Unidad 3 de la asignatura Aplicaciones Web.
Incluye frontend con Vue 3 + Vite y un backend con Node.js, Express y MongoDB.

La app permite:

- Visualizar productos desde una API
- Filtrar por categoría
- Realizar búsquedas
- Ver detalle del producto
- Añadir productos a un carrito (localStorage)
- Sembrar datos iniciales en MongoDB (seed)

# Tecnologías utilizadas
Frontend

- Vue 3 (Composition API)
- Vue Router
- Fetch API
- CSS responsivo

Backend

- Node.js + Express
- MongoDB + Mongoose
- Dotenv
- Nodemon
- Seed de datos
- Estructura REST API

# Estructura de carpetas
mercapp/
 ├── backend/
 │   ├── routes/
 │   ├── models/
 │   ├── seed/
 │   └── app.js
 ├── frontend/
 │   ├── src/
 │   │   ├── views/
 │   │   ├── components/
 │   │   ├── router/
 │   │   └── assets/
 │   └── vite.config.js
 └── README.md

## Insatalacin y ejecicion
Clonar repositorio
git clone <url>

1. Instalar dependencias del backend
cd backend
npm install

2. Configurar variables

Crear .env:

MONGODB_URI=mongodb://localhost:27017/mercapp
SESSION_SECRET=secret

3. Ejecutar backend
npm run dev

4.  Poblar base de datos (seed)
node seed/seed.js

# Endpoints API
Productos
GET /api/products

Categorías
GET /api/categories

Producto por ID
GET /api/products/:id

# Ejecutar frontend
cd frontend
npm install
npm run dev


# Abrir en navegador:

http://localhost:5173/