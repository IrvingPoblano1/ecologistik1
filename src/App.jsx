import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reporte from "./pages/Reporte";
import Detalle from "./pages/Detalle";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import NewShipmentForm from "./pages/NewShipmentForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* raíz → dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* rutas válidas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/detalle/:id" element={<Detalle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nuevo-envio" element={<NewShipmentForm />} />

        {/* catch-all: cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
