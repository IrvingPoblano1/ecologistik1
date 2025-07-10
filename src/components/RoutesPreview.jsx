import React, { useState } from "react";
import RouteMapbox from "./RouteMapbox";
import { useRutas } from "../hooks/useRutas";

/**
 * Muestra un selector de estado, un selector de ruta,
 * y luego un solo mapa con la ruta elegida.
 */
export default function RoutesPreview() {
  const [estado, setEstado]       = useState("");
  const [selectedId, setSelectedId] = useState("");
  const { data: rutas = [], isLoading } = useRutas(estado);

  // Encuentra la ruta seleccionada
  const selected = rutas.find((r) => r.id === selectedId);

  // Extrae puntos de inicio/fin de su GeoJSON
  const getPoints = (route) => {
    const geo = typeof route.geojson === "string"
      ? JSON.parse(route.geojson)
      : route.geojson;
    const coords = geo.features[0].geometry.coordinates.map(
      ([lon, lat]) => [lat, lon]
    );
    return { from: coords[0], to: coords[coords.length - 1] };
  };

  const { from, to } = selected ? getPoints(selected) : { from: null, to: null };

  return (
    <div>
      {/* Filtrar por estado */}
      <select
        disabled={isLoading}
        value={estado}
        onChange={(e) => {
          setEstado(e.target.value);
          setSelectedId("");
        }}
        style={{ marginRight: 8, padding: 4 }}
      >
        <option value="">Todas las rutas</option>
        <option value="Pendiente">Pendientes</option>
        <option value="Entregado">Entregadas</option>
        <option value="Cancelado">Canceladas</option>
      </select>

      {/* Selector de ruta */}
      <select
        disabled={isLoading || !rutas.length}
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{ padding: 4 }}
      >
        <option value="">Selecciona ruta</option>
        {rutas.map((r) => (
          <option key={r.id} value={r.id}>
            {r.id}
          </option>
        ))}
      </select>

      {/* Mapa con la ruta seleccionada */}
      {selected && from && to && (
        <div style={{ marginTop: 12, height: 400 }}>
          <RouteMapbox
            from={from}
            to={to}
            info={{ id: selected.id, status: selected.status }}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
