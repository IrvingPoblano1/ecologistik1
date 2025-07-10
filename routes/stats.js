const express = require("express");
const router  = express.Router();

const database  = require("../db");
const container = database.container(process.env.COSMOS_CONTAINER_STATS);

/* GET /api/daily-stats  (los 7 últimos) */
router.get("/", async (_req, res) => {
  try {
    const { resources } = await container.items
      .query("SELECT * FROM c ORDER BY c.date DESC OFFSET 0 LIMIT 7")
      .fetchAll();
    res.json(resources.reverse());              // del más viejo al más nuevo
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

module.exports = router;
