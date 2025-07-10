// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

const handleLogin = async () => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  //        ↑ en prod será "/api"  |  en local (si tienes .env.local) "http://localhost:3000/api"

  try {
    const response = await fetch(`${API}/auth/login`, {   // ← URL dinámica
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciales incorrectas");

    const data = await response.json();
    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Lado izquierdo */}
      <div style={{
        backgroundColor: '#0F3D2E',
        flex: 1,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img src="/logo192.png" alt="logo" style={{ width: 60, marginBottom: '1rem' }} />
        <h2>Bienvenido de nuevo</h2>
        <img src="/grafico.png" alt="mockup" style={{ width: 250, marginTop: '2rem' }} />
      </div>

      {/* Lado derecho */}
      <div style={{
        flex: 1,
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={buttonStyle}>
          Log In
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
        )}

        <p style={{ marginTop: '1rem', fontSize: 14 }}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px',
  marginBottom: '1rem',
  fontSize: 14,
  borderRadius: 6,
  border: '1px solid #ccc',
  width: '100%'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#0F3D2E',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontSize: 16,
  marginTop: '1rem',
  cursor: 'pointer',
  width: '100%'
};
