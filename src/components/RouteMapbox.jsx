// src/components/RouteMapbox.jsx
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Asegúrate de definir tu token en .env con VITE_MAPBOX_TOKEN
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function RouteMapbox({ from, to, style }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inicializar mapa UNA sola vez
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: from || [0, 0],
        zoom: 5,
      });
    }

    // Si cambia el punto 'from', ponemos un marker nuevo
    if (from) {
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat(from)
        .addTo(mapRef.current);
      mapRef.current.setCenter(from);
    }

    // Y lo mismo para 'to'
    if (to) {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat(to)
        .addTo(mapRef.current);
    }

    // Forzar resize (por si el contenedor cambió de tamaño)
    mapRef.current.resize();
  }, [from, to]);

  return <div ref={containerRef} style={style} />;
}
