const express = require("express");
const router  = express.Router();

const database  = require("../db");
const container = database.container(process.env.COSMOS_CONTAINER_ROUTES);

/* GET /api/routes  (opcional ?status=Pendiente) */
router.get("/", async (req, res) => {
  try {
    const filtro = req.query.status;
    const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
    const data = filtro ? resources.filter(r => r.status === filtro) : resources;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener rutas" });
  }
});

module.exports = router;
