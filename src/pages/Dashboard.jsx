// src/pages/Dashboard.jsx
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import RouteMapbox from "../components/RouteMapbox"; // Mapa básico con marcadores
import { apiFetch } from "../api";
import "leaflet/dist/leaflet.css";

/* Colores */
const statusColors = {
  Pendiente: "#F59E0B",
  "En ruta": "#3B82F6",
  Entregado: "#10B981",
  Cancelado: "#EF4444",
};
const vehColor = {
  Operando: "#10B981",
  EnReparacion: "#F59E0B",
  FueraServicio: "#EF4444",
};

export default function Dashboard() {
  const navigate = useNavigate();

  /* ── Estadísticas últimos 7 días ── */
  const { data: stats = [] } = useQuery({
    queryKey: ["daily-stats"],
    queryFn: () => apiFetch("/daily-stats").then((r) => r.json()),
  });
  const today = new Date();
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    return {
      date: iso,
      dia: d.toLocaleDateString("es-MX", { weekday: "short" }),
      Pendiente: 0,
      "En ruta": 0,
      Entregado: 0,
    };
  });
  stats.forEach((entry) => {
    const idx = last7.findIndex((d) => d.date === entry.date);
    if (idx > -1) {
      last7[idx].Pendiente = entry.byStatus.Pendiente || 0;
      last7[idx]["En ruta"] = entry.byStatus["En ruta"] || 0;
      last7[idx].Entregado = entry.byStatus.Entregado || 0;
    }
  });
  const barras = last7;

  /* ── Otros datos ── */
  const { data: shipments = [] } = useQuery({
    queryKey: ["shipments"],
    queryFn: () => apiFetch("/shipments").then((r) => r.json()),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => apiFetch("/vehicles").then((r) => r.json()),
  });

  const { data: storage = {} } = useQuery({
    queryKey: ["storage"],
    queryFn: () => apiFetch("/storage").then((r) => r.json()),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["routes"],
    queryFn: () => apiFetch("/routes").then((r) => r.json()),
  });

  /* ── Conteo de vehículos por estado ── */
  const vehCounts = vehicles.reduce(
    (acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    },
    { Operando: 0, EnReparacion: 0, FueraServicio: 0 }
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: "#1f2937", color: "#fff", padding: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Menú</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: 10 }}>Dashboard</li>
          <li style={{ marginBottom: 10 }}>Envíos</li>
          <li style={{ marginBottom: 10 }}>Vehículos</li>
          <li style={{ marginBottom: 10 }}>Rutas</li>
          <li style={{ marginBottom: 10 }}>
            <a href="/nuevo-envio" style={{ color: "#fff", textDecoration: "none" }}>
              Nuevo Envío
            </a>
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main style={{ flexGrow: 1, padding: 24, background: "#F6F8FB" }}>
        <h1 style={{ fontSize: 26, marginBottom: 24, color: "#111" }}>Dashboard</h1>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          {/* Columna izquierda */}
          <div>
            {/* Tabla Envíos */}
            <Card title="Envíos">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th>Descripción</Th>
                    <Th>Fecha</Th>
                    <Th>Monto</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.slice(0, 5).map((s) => (
                    <tr key={s.id}>
                      <Td>{s.description}</Td>
                      <Td>{new Date(s.createdAt).toLocaleDateString()}</Td>
                      <Td>${s.amountMXN.toFixed(2)}</Td>
                      <Td style={{ color: statusColors[s.status] }}>{s.status}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Vehículos & Almacenamiento */}
            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
              <Card title="Vehículos" style={{ flex: 1 }}>
                {Object.entries(vehCounts).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{k}</span>
                      <strong style={{ color: vehColor[k] }}>{v}</strong>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "#E5E7EB",
                        borderRadius: 4,
                        marginTop: 4,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: `${vehicles.length ? (v / vehicles.length) * 100 : 0}%`,
                          background: vehColor[k],
                          height: "100%",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Card>

              <Card title="Almacenamiento" style={{ flex: 1, textAlign: "center" }}>
                <Gauge used={storage.usedGB} total={storage.totalGB} />
                <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
                  Usado: {storage.usedGB} GB de {storage.totalGB} GB
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 10px",
                    fontSize: 13,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    📁
                    <div>
                      <div style={{ fontWeight: 600 }}>Reporte</div>
                      <div style={{ fontSize: 11, color: "#666" }}>
                        {shipments.length} archivos
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/reporte")}
                    style={{
                      background: "#111",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Descargar
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* Columna derecha */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card title="Envíos últimos 7 días">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barras}>
                  <XAxis dataKey="dia" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pendiente" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="En ruta" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="Entregado" stackId="a" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Rutas">
              {routes.map((r) => {
                const geo =
                  typeof r.geojson === "string" ? JSON.parse(r.geojson) : r.geojson;
                const coords = geo.features
                  .find((f) => f.geometry.type === "LineString")
                  .geometry.coordinates.map(([lon, lat]) => [lon, lat]); // [lng, lat]
                const start = coords[0];
                const end = coords[coords.length - 1];
                return (
                  <RouteMapbox
                    key={r.id}
                    from={start}
                    to={end}
                    style={{ marginBottom: 12, height: 200, width: "100%" }}
                  />
                );
              })}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Subcomponentes ── */
function Card({ title, children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,.05)",
        padding: 16,
        ...style,
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16, color: "#111" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
const Th = ({ children }) => (
  <th style={{ textAlign: "left", padding: "6px 4px", fontSize: 13 }}>
    {children}
  </th>
);
const Td = ({ children }) => (
  <td
    style={{
      padding: "6px 4px",
      fontSize: 13,
      borderBottom: "1px solid #EFF1F4",
    }}
  >
    {children}
  </td>
);
function Gauge({ used = 0, total = 50 }) {
  const pct = total ? Math.min(used / total, 1) : 0;
  return (
    <svg width="110" height="110" style={{ marginBottom: 8 }}>
      <circle cx="55" cy="55" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
      <circle
        cx="55"
        cy="55"
        r="45"
        stroke="#0EA5E9"
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${pct * 282.6} 282.6`}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
      <text
        x="55"
        y="60"
        textAnchor="middle"
        fontSize="16"
        fontWeight="bold"
        fill="#0EA5E9"
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}
