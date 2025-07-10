import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";


// ✅ Importa solo desde @tanstack/react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Estilos
import './index.css';
import 'leaflet/dist/leaflet.css';

// ✅ Crea el cliente
const queryClient = new QueryClient();

// ✅ Renderiza la App dentro del QueryClientProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
