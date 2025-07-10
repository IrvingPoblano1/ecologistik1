const express = require("express");
const router  = express.Router();

const database  = require("../db");
const container = database.container(process.env.COSMOS_CONTAINER_STORAGE);

/* GET /api/storage */
router.get("/", async (_req, res) => {
  try {
    const { resource } = await container.item("overall", "metrics").read();
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener métricas" });
  }
});

module.exports = router;
