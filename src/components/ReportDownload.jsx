import { useState } from "react";

export default function ReportDownload() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const downloadReport = async () => {
    if (!startDate || !endDate) {
      alert("Selecciona ambas fechas.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/report?start=${startDate}&end=${endDate}&format=csv`
      );

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.error);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Error inesperado: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        Selecciona un rango de fechas para descargar el reporte
      </h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ flex: 1 }}>
          <label>Fecha de inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Fecha final:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </div>
      </div>

      <button
        onClick={downloadReport}
        style={{
          backgroundColor: "#135c13",
          color: "#fff",
          border: "none",
          padding: "0.6rem 1.2rem",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        Descargar
      </button>
    </div>
  );
}
