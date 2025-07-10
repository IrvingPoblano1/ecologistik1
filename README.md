# ecologistik1
EcoLogistik es una startup ecológica que quiere ofrecer un servicio de entregas sustentables. Su sistema aún está en pruebas.

# Ecologistik

Esta es la aplicación full-stack de Ecologistik, compuesta por:

- **Backend** en Node.js/Express con Azure Cosmos DB  
- **Frontend** en React + Vite + React Query + Recharts + Mapbox

---

## 📁 Estructura

ecologistik/
├── backend/
│ ├── routes/
│ ├── db.js # cliente Cosmos
│ ├── index.js
│ └── .env # variables de entorno
└── frontend/
├── src/
│ ├── api/
│ ├── components/
│ ├── pages/
│ └── main.jsx
├── .env # variables para Vite
└── vite.config.js


---

## 🔧 Backend

1. Copia `.env.example` a `.env` y ajusta:
   ```dotenv
   COSMOS_ENDPOINT=...
   COSMOS_KEY=...
   COSMOS_DB=...
   COSMOS_CONTAINER_SHIPMENTS=shipments
   COSMOS_CONTAINER_VEHICLES=vehicles
   COSMOS_CONTAINER_STORAGE=storage
   COSMOS_CONTAINER_ROUTES=routes
   COSMOS_CONTAINER_DAILYSTATS=dailyStats
   COSMOS_CONTAINER_USERS=users

    Instala dependencias y arranca:

    cd backend
    npm install
    npm run dev   # usa nodemon

🔧 Frontend

    Copia frontend/.env.example a frontend/.env y añade:

VITE_API_URL=http://localhost:3000/api
VITE_MAPBOX_TOKEN=TU_MAPBOX_TOKEN_AQUÍ

Instala y arranca:

    cd frontend
    npm install
    npm run dev

🐳 Docker

Backend (backend/Dockerfile):

FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

Frontend (frontend/Dockerfile):

# si lo necesitas, similar al backend con NGINX

☁️ Despliegue en Azure

    az login

    Registra provider si hace falta:

az provider register --namespace Microsoft.ContainerRegistry

Crea un ACR y push:

az acr create -n <REG> -g <RG> --sku Basic
az acr login -n <REG>
docker build -t <REG>.azurecr.io/ecologistik-back:v1 backend
docker push <REG>.azurecr.io/ecologistik-back:v1

Configura tu WebApp para usar el contenedor.
