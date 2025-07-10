/**
 * Script de sembrado para Azure Cosmos DB (API for NoSQL)
 * Crea contenedores e inserta datos dummy para desarrollo
 *  - 6 vehículos
 *  - 50 envíos
 *  - 40 rutas GeoJSON (10 por estado)
 *  - métricas de storage
 *  - dailyStats del día
 *  - usuario admin
 * -----------------------------------------------------------
 *  Ejecuta:  npm run seed
 * -----------------------------------------------------------
 */

require("dotenv").config();
const { CosmosClient } = require("@azure/cosmos");
const bcrypt           = require("bcryptjs");
const { randomUUID }   = require("crypto");

/* ──────────────────── 1. conexión ─────────────────────── */
const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key:      process.env.COSMOS_KEY,
});

const DB_ID = "ecologistik";
const containers = [
  { id: "shipments",  partitionKey: { paths: ["/clientId"]   } },
  { id: "vehicles",   partitionKey: { paths: ["/status"]     } },
  { id: "routes",     partitionKey: { paths: ["/status"]     } },
  { id: "storage",    partitionKey: { paths: ["/type"]       } },
  { id: "dailyStats", partitionKey: { paths: ["/date"]       } },
  { id: "users",      partitionKey: { paths: ["/role"]       } },
];

/* ──────────────────── 2. helpers dummy ─────────────────── */
const cities = {
  CDMX:        [-99.13321, 19.4326],
  Guadalajara: [-103.3496, 20.6597],
  Monterrey:   [-100.3161, 25.6866],
  Puebla:      [-98.2060,  19.0413],
  Queretaro:   [-100.3899, 20.5888],
  Toluca:      [-99.6557,  19.2826],
};

const rnd = (min, max) => Math.random() * (max - min) + min;

function randomPointNear([lon, lat], km = 1.5) {
  const dx = rnd(-km, km) / 111;          // 1° lat ~111 km
  const dy = rnd(-km, km) / 111;
  return [lon + dx, lat + dy];
}

/* ──────────────────── 3. main async ────────────────────── */
(async () => {
  /* 3.1 crea DB/containers (idempotente) */
  const { database } = await client.databases.createIfNotExists({ id: DB_ID });
  for (const c of containers) await database.containers.createIfNotExists(c);

  const shipments   = database.container("shipments");
  const vehicles    = database.container("vehicles");
  const routesCt    = database.container("routes");
  const storageCt   = database.container("storage");
  const dailyStats  = database.container("dailyStats");
  const usersCt     = database.container("users");

  /* 3.2 vehículos */
  const vStatuses = ["Operando", "EnReparacion", "FueraServicio"];
  const vehicleDocs = Array.from({ length: 6 }, (_, i) => ({
    id: `V-${String(i + 1).padStart(3, "0")}`,
    status: vStatuses[i % 3],
    model: `Model-${1 + (i % 3)}`,
    lastServiceDate: new Date(Date.now() - rnd(0, 30) * 86_400_000).toISOString(),
  }));
  await Promise.all(vehicleDocs.map((v) => vehicles.items.upsert(v)));

  /* 3.3 shipments (50) */
  const sStatuses = ["Pendiente", "En ruta", "Entregado", "Cancelado"];
  const shipmentDocs = [];
  for (let i = 0; i < 50; i++) {
    const ori = Object.keys(cities)[Math.floor(rnd(0, 6))];
    let dst;
    do { dst = Object.keys(cities)[Math.floor(rnd(0, 6))]; } while (dst === ori);

    shipmentDocs.push({
      id:        randomUUID(),
      clientId:  `C-${String(Math.ceil(rnd(1, 40))).padStart(3,"0")}`,
      description: `Envío demo #${i+1}`,
      amountMXN: +(rnd(200, 1200)).toFixed(2),
      status: sStatuses[Math.floor(rnd(0, 4))],
      origin: ori,
      destination: dst,
      createdAt: new Date(Date.now() - rnd(0, 14)*86_400_000).toISOString(),
      vehicleId: vehicleDocs[Math.floor(rnd(0, vehicleDocs.length))].id,
      routeGeoJSONId: null,
    });
  }
  await Promise.all(shipmentDocs.map((s) => shipments.items.upsert(s)));

  /* 3.4 rutas GeoJSON (40 = 10 por estado) */
  const rStatuses = ["Pendiente","Entregado","Cancelado","En ruta"];
  const routeDocs = [];
  let rCount = 1;

  for (const st of rStatuses) {
    for (let i = 0; i < 10; i++) {
      const cityKeys = Object.keys(cities);
      const fromCity = cityKeys[Math.floor(rnd(0, cityKeys.length))];
      let toCity;
      do { toCity = cityKeys[Math.floor(rnd(0, cityKeys.length))]; } while (toCity === fromCity);

      const from = randomPointNear(cities[fromCity], 5);
      const to   = randomPointNear(cities[toCity],   5);

      routeDocs.push({
        id: `R-${String(rCount++).padStart(3,"0")}`,
        status: st,
        geojson: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: [from, to] }
          }]
        }
      });
    }
  }
  await Promise.all(routeDocs.map((r) => routesCt.items.upsert(r)));

  /* 3.5 storage */
  await storageCt.items.upsert({
    id: "overall",
    type: "metrics",
    usedGB: 22.35,
    totalGB: 50,
    fileCount: 223,
    updatedAt: new Date().toISOString(),
  });

  /* 3.6 dailyStats */
  const today = new Date().toISOString().slice(0, 10);
  const byStatus = shipmentDocs.reduce((a, { status }) => ((a[status]=(a[status]||0)+1), a), {});
  await dailyStats.items.upsert({ id: today, date: today, byStatus });

  /* 3.7 admin user */
  const hash = await bcrypt.hash("P4ssw0rd!", 12);
  await usersCt.items.upsert({
    id: randomUUID(),
    email: "admin@ecologistik.com",
    passwordHash: hash,
    name: "Admin",
    avatarUrl: "https://ui-avatars.com/api/?name=Admin",
    role: "admin",
  });

  console.log("🚀 Seed terminado: 6 vehículos, 50 envíos, 40 rutas, métricas, dailyStats y admin.\n");
  process.exit(0);
})();
