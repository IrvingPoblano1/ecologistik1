// src/pages/NewShipmentForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NewShipmentForm.css";

// Catálogo de 20 ciudades y su multiplicador base
const CITIES = [
  { name: "Ciudad de México", lat: 19.4326, lon: -99.1332, mult: 1.0 },
  { name: "Guadalajara",    lat: 20.6597, lon: -103.3496, mult: 1.1 },
  { name: "Monterrey",      lat: 25.6866, lon: -100.3161, mult: 1.2 },
  { name: "Puebla",         lat: 19.0413, lon: -98.2062,  mult: 1.0 },
  { name: "Toluca",         lat: 19.2826, lon: -99.6557,  mult: 1.0 },
  { name: "Querétaro",      lat: 20.5888, lon: -100.3899, mult: 1.1 },
  { name: "León",           lat: 21.1222, lon: -101.6798, mult: 1.1 },
  { name: "Tijuana",        lat: 32.5149, lon: -117.0382, mult: 1.3 },
  { name: "Mérida",         lat: 20.9674, lon: -89.5926,  mult: 1.4 },
  { name: "Cancún",         lat: 21.1619, lon: -86.8515,  mult: 1.5 },
  { name: "Chihuahua",      lat: 28.6320, lon: -106.0691, mult: 1.3 },
  { name: "Saltillo",       lat: 25.4232, lon: -101.0058, mult: 1.2 },
  { name: "Aguascalientes", lat: 21.8853, lon: -102.2916, mult: 1.1 },
  { name: "Morelia",        lat: 19.7008, lon: -101.1847, mult: 1.2 },
  { name: "Veracruz",       lat: 19.1738, lon: -96.1342,  mult: 1.3 },
  { name: "Culiacán",       lat: 24.8091, lon: -107.3940, mult: 1.4 },
  { name: "Hermosillo",     lat: 29.0729, lon: -110.9559, mult: 1.4 },
  { name: "Tampico",        lat: 22.2455, lon: -97.8611,  mult: 1.3 },
  { name: "Durango",        lat: 24.0277, lon: -104.6532, mult: 1.3 },
  { name: "Tuxtla Gutiérrez", lat: 16.7600, lon: -93.1292, mult: 1.5 },
];

// Calcula distancia en km entre dos puntos lat/lon
function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6371; // km
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NewShipmentForm() {
  const [origen, setOrigen]       = useState("");
  const [destino, setDestino]     = useState("");
  const [pesoGr, setPesoGr]       = useState(0);
  const [vehiculo, setVehiculo]   = useState("Camión");
  const [clientes, setClientes]   = useState([]);
  const [cliente, setCliente]     = useState("");
  const [nuevoCliente, setNuevoCliente] = useState("");
  const [precio, setPrecio]       = useState(0);
  const [mensaje, setMensaje]     = useState("");
  const navigate = useNavigate();

  // Carga lista de clientes existentes
  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((r) => r.json())
      .then(setClientes)
      .catch(() => setClientes([]));
  }, []);

  // Recalcula precio y tipo de vehículo cada vez que cambian origen/destino/peso
  useEffect(() => {
    if (!origen || !destino || !pesoGr) return setPrecio(0);

    const o = CITIES.find((c) => c.name === origen);
    const d = CITIES.find((c) => c.name === destino);
    if (!o || !d) return setPrecio(0);

    const dist = haversine([o.lat, o.lon], [d.lat, d.lon]);
    // vehículo automático
    let veh = "Motocicleta";
    if (dist >= 200) veh = "Camión";
    else if (dist >= 50) veh = "Furgoneta";
    setVehiculo(veh);

    const pesoKg = pesoGr / 1000;
    const cost = dist * pesoKg * ((o.mult + d.mult) / 2);
    setPrecio(cost);
  }, [origen, destino, pesoGr]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientId = cliente || nuevoCliente;
    if (!clientId) return alert("Elige o crea un cliente.");
    const envio = {
      origen,
      destino,
      pesoGr,
      tipoVehiculo: vehiculo,
      cliente: clientId,
      amountMXN: +precio.toFixed(2),
      description: `${origen} → ${destino}`,
      status: "Pendiente",
      fecha: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("http://localhost:3000/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(envio),
      });
      if (!res.ok) throw new Error("Error al registrar envío");
      setMensaje("✅ Envío registrado!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMensaje("❌ " + err.message);
    }
  };

  return (
    <div className="page-background">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Regresar
      </button>
      <div className="form-wrapper">
        <h2>Agregar nuevo envío</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Origen
            <select value={origen} onChange={e => setOrigen(e.target.value)} required>
              <option value="">Selecciona...</option>
              {CITIES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label>
            Destino
            <select value={destino} onChange={e => setDestino(e.target.value)} required>
              <option value="">Selecciona...</option>
              {CITIES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label>
            Peso (gr)
            <input
              type="number"
              min={1}
              value={pesoGr}
              onChange={e => setPesoGr(+e.target.value)}
              required
            />
          </label>
          <p>Precio estimado: <strong>${precio.toFixed(2)} MXN</strong></p>
          <label>
            Vehículo
            <input value={vehiculo} disabled />
          </label>
          <label>
            Cliente existente
            <select
              value={cliente}
              onChange={e => { setCliente(e.target.value); setNuevoCliente(""); }}
            >
              <option value="">-- ninguno --</option>
              {clientes.map(u => (
                <option key={u.id} value={u.id}>{u.name || u.email}</option>
              ))}
            </select>
          </label>
          <label>
            O crea nuevo cliente
            <input
              placeholder="Nombre o email"
              value={nuevoCliente}
              onChange={e => { setNuevoCliente(e.target.value); setCliente(""); }}
            />
          </label>
          <button type="submit" className="btn-primary">
            Registrar envío
          </button>
        </form>
        {mensaje && <p className="msg">{mensaje}</p>}
      </div>
    </div>
  );
}
