// backend/routes/shipments.js
const express = require("express");
const { createObjectCsvStringifier } = require("csv-writer");
const router = express.Router();

// 👇 Único require al cliente de Cosmos exportado desde backend/db.js o backend/cosmos.js
const database  = require("../db");
const container = database.container(process.env.COSMOS_CONTAINER_SHIPMENTS);

/* ───────────── GET  /api/shipments/report ───────────── */
router.get("/report", async (req, res) => {
  try {
    const { format = "csv", start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: "Faltan parámetros de fecha" });
    }

    const s = new Date(start);
    const e = new Date(end);
    e.setUTCHours(23, 59, 59, 999);

    const query = {
      query: "SELECT * FROM c WHERE c.fecha >= @s AND c.fecha <= @e",
      parameters: [
        { name: "@s", value: s.toISOString() },
        { name: "@e", value: e.toISOString() }
      ],
    };
    const { resources } = await container.items.query(query).fetchAll();
    if (!resources.length) {
      return res.status(404).json({ error: "No hay registros" });
    }

    if (format === "json") {
      return res.json(resources);
    }

    const csv = createObjectCsvStringifier({
      header: Object.keys(resources[0]).map((k) => ({ id: k, title: k })),
    });

    res
      .status(200)
      .setHeader("Content-Disposition", 'attachment; filename="reporte.csv"')
      .type("text/csv")
      .send(csv.getHeaderString() + csv.stringifyRecords(resources));
  } catch (err) {
    console.error("Error al generar el reporte:", err);
    res.status(500).json({ error: "Error al generar el reporte" });
  }
});

/* ───────────── POST /api/shipments ───────────── */
router.post("/", async (req, res) => {
  try {
    const { origen, destino, tipoVehiculo, cliente, amountMXN } = req.body;
    if (!origen || !destino || !tipoVehiculo || !cliente || amountMXN == null) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const now = new Date().toISOString();
    const doc = {
      id: `envio-${Date.now()}`,
      origen,
      destino,
      tipoVehiculo,
      cliente,
      amountMXN: Number(amountMXN),
      description: `${origen} → ${destino}`,
      status: "Pendiente",
      fecha: now,
      createdAt: now,
    };

    const { resource } = await container.items.create(doc);
    res.status(201).json(resource);
  } catch (err) {
    console.error("❌ Error al registrar envío:", err);
    res.status(500).json({ error: "No se pudo guardar el envío" });
  }
});

/* ───────────── GET  /api/shipments ───────────── */
router.get("/", async (_req, res) => {
  try {
    const { resources } = await container.items
      .query("SELECT * FROM c ORDER BY c.createdAt DESC")
      .fetchAll();
    res.json(resources);
  } catch (err) {
    console.error("Error al obtener los envíos:", err);
    res.status(500).json({ error: "Error al obtener los envíos" });
  }
});

module.exports = router;
