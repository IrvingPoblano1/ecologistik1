require("dotenv").config();
const express = require("express");
const cors = require("cors");

const shipments = require("./routes/shipments");
const vehicles = require("./routes/vehicles");
const storage = require("./routes/storage");
const stats = require("./routes/stats");
const routeMap = require("./routes/routes");
const auth = require("./routes/auth");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Rutas
app.use("/api/shipments", shipments);
app.use("/api/vehicles", vehicles);
app.use("/api/storage", storage);
app.use("/api/daily-stats", stats);
app.use("/api/routes", routeMap);
app.use("/api/auth", auth);

// Arranque
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
