// backend/cosmos.js
require("dotenv").config();
const { CosmosClient } = require("@azure/cosmos");

/* ─── Validar variables de entorno ───────────────────────────── */
const endpoint = process.env.COSMOS_ENDPOINT;      // p. ej. https://ecologisk.documents.azure.com:443/
const key      = process.env.COSMOS_KEY;           // PRIMARY KEY
const dbName   = process.env.COSMOS_DB || "ecologistik";

if (!endpoint || !key) {
  console.error("❌ Falta COSMOS_ENDPOINT o COSMOS_KEY en .env");
  process.exit(1);
}

/* ─── Crear cliente y base de datos ──────────────────────────── */
const client   = new CosmosClient({ endpoint, key });
const database = client.database(dbName);

console.log("✅ Cosmos DB listo:", endpoint);
module.exports = database;            // 👉  exportamos la BD (no el cliente)
