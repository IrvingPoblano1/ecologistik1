// src/pages/Reporte.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/** Modal que muestra el CSV generado */
function CsvModal({ csvContent, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "80vw",
          maxWidth: 800,
          height: "70vh",
          borderRadius: 8,
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={onClose}
          style={{
            alignSelf: "flex-end",
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <h2>Contenido del reporte CSV</h2>
        <textarea
          readOnly
          value={csvContent}
          style={{
            flex: 1,
            width: "100%",
            marginTop: 8,
            fontFamily: "monospace",
            fontSize: 12,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            resize: "none",
          }}
        />
      </div>
    </div>
  );
}

export default function Reporte() {
  const navigate = useNavigate();

  // fechas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  // campos disponibles y seleccionados
  const allFields = [
    "id",
    "origen",
    "destino",
    "tipoVehiculo",
    "cliente",
    "amountMXN",
    "description",
    "status",
    "fecha",
    "createdAt",
  ];
  const [selectedFields, setSelectedFields] = useState(allFields.slice(0, 5)); // por defecto los primeros 5
  // CSV y modal
  const [csvContent, setCsvContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // activa/desactiva un campo
  const toggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleMostrar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Selecciona ambas fechas.");
      return;
    }
    try {
      // Traemos como JSON para filtrar en cliente
      const url = `/api/shipments/report?start=${fechaInicio}&end=${fechaFin}&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudo obtener el reporte");
      const data = await res.json(); // array de objetos

      // Construimos el CSV con sólo los campos seleccionados
      const headerLine = selectedFields.join(",") + "\n";
      const rows = data.map((item) =>
        selectedFields
          .map((f) => {
            let v = item[f];
            if (v == null) return "";
            // escapamos comas y saltos
            return String(v).replace(/"/g, '""');
          })
          .map((cell) => `"${cell}"`)
          .join(",")
      );
      setCsvContent(headerLine + rows.join("\n"));
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Error al obtener reporte: " + err.message);
    }
  };

  return (
    <div
      style={{
        background: "#DFF5E1",
        minHeight: "100vh",
        padding: "2rem 1rem 1rem",
        position: "relative",
      }}
    >
      {/* ← Regresar */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          backgroundColor: "#1B332B",
          color: "#DFF5E1",
          border: "2px solid #1B332B",
          padding: "6px 12px",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        ← Regresar
      </button>

      {/* Formulario */}
      <div
        style={{
          maxWidth: 600,
          margin: "4rem auto 0",
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", margin: "0 0 1.5rem" }}>
          Selecciona rango de fechas y campos para el reporte
        </h2>

        {/* Fechas */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 14, color: "#333" }}>
              Fecha inicio:
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 14, color: "#333" }}>
              Fecha fin:
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* Campos a incluir */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {allFields.map((field) => (
            <label
              key={field}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => toggleField(field)}
              />
              {field}
            </label>
          ))}
        </div>

        {/* Botón Mostrar */}
        <button
          onClick={handleMostrar}
          style={{
            backgroundColor: "#DFF5E1",
            color: "#1B332B",
            border: "2px solid #1B332B",
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: 4,
            fontWeight: 600,
            width: "100%",
          }}
        >
          Mostrar reporte
        </button>
      </div>

      {/* Modal con textarea del CSV */}
      {modalOpen && (
        <CsvModal
          csvContent={csvContent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
