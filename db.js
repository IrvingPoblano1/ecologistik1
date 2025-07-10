// backend/db.js
// ————————————————————————————————————————————————————————————————————
// Este módulo simplemente re-exporta la conexión definida en cosmos.js
// de modo que todas las rutas que hagan `require('../db')` obtengan
// la misma instancia de CosmosClient.
// ————————————————————————————————————————————————————————————————————

module.exports = require("./cosmos");
