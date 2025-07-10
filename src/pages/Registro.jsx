import { Link } from 'react-router-dom';

export default function Registro() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Lado izquierdo con imagen y texto */}
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
        <h2>Bienvenido a Ecologistik</h2>
        <img src="/grafico.png" alt="mockup" style={{ width: 250, marginTop: '2rem' }} />
      </div>

      {/* Lado derecho con formulario */}
      <div style={{
        flex: 1,
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>Registro</h2>

        <input placeholder="Usuario" style={inputStyle} />
        <input type="email" placeholder="Email" style={inputStyle} />
        <input type="password" placeholder="Contraseña" style={inputStyle} />
        <p style={{ fontSize: 12, color: '#777' }}>Su contraseña debe tener al menos 8 caracteres.</p>

        <button style={buttonStyle}>Sign Up</button>

        <p style={{ marginTop: '1rem', fontSize: 14 }}>
          ¿Ya tienes cuenta? <Link to="/login">Log In</Link>
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
