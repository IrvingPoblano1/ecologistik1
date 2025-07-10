const express = require("express");
const router  = express.Router();

const database  = require("../db");
const container = database.container(process.env.COSMOS_CONTAINER_VEHICLES);

/* GET /api/vehicles   (?status=Operando) */
router.get("/", async (req, res) => {
  try {
    const filtro = req.query.status;
    const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
    const data = filtro ? resources.filter(v => v.status === filtro) : resources;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
});

module.exports = router;
