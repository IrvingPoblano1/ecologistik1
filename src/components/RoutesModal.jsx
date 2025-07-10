// src/components/RoutesModal.jsx
import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";

const lineColor = "#2563EB";
const estados = ["Todos", "Pendiente", "En ruta", "Entregado"];

export default function RoutesModal({ open, onClose }) {
  const [routes, setRoutes] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  /* ── cargar rutas cada vez que se abra o cambie filtro ── */
  const load = useCallback(async () => {
    const qs = filtro !== "Todos" ? `?status=${encodeURIComponent(filtro)}` : "";
    const r = await fetch(`http://localhost:3000/api/routes${qs}`).then((x) => x.json());
    setRoutes(r);
  }, [filtro]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  /* ── cerrar con Esc ── */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* fondo difuminado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              zIndex: 1000,
            }}
            onClick={onClose}
          />

          {/* contenedor modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              position: "fixed",
              inset: 0,
              margin: "auto",
              width: "90%",
              height: "90%",
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* barra superior */}
            <div
              style={{
                padding: "8px 16px",
                background: "#1F2937",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{ padding: 4, borderRadius: 4 }}
              >
                {estados.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>

              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                }}
                title="Cerrar"
              >
                ✖
              </button>
            </div>

            {/* mapa */}
            <div style={{ flex: 1 }}>
              <MapContainer center={[23, -102]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {routes.map((r) =>
                  r.geojson.features.map((f, i) =>
                    f.geometry.type === "LineString" ? (
                      <Polyline
                        key={r.id + i}
                        positions={f.geometry.coordinates.map(([lon, lat]) => [lat, lon])}
                        pathOptions={{ color: lineColor }}
                      >
                        <Popup>{`Ruta ${r.id} (${r.status})`}</Popup>
                      </Polyline>
                    ) : null
                  )
                )}
              </MapContainer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
