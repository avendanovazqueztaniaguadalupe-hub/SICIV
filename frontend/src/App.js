import "@fontsource/poppins";
import axios from "axios";
import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import "./index.css";

function App() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        correo,
        contraseña,
      });

      setMensaje("✅ Inicio de sesión exitoso. Bienvenido a SICIV.");
      setUsuario({
        rol: res.data.rol,
        nombre: res.data.nombre,
      });
    } catch (error) {
      setMensaje("❌ Credenciales incorrectas.");
    }
  };

  // 🔹 Si ya hay usuario logueado, mostrar el Dashboard
  if (usuario) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard rol={usuario.rol} setUsuario={setUsuario} />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  // 🔹 Pantalla de login
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-purple-500 font-[Poppins]">
      <div className="text-center">
        <h1 className="text-white text-5xl font-bold mb-2 flex items-center justify-center">
          💜 SICIV
        </h1>
        <p className="text-white italic mb-8">
          "La innovación es el nuevo orden del control."
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-80 mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Iniciar sesión
          </h2>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300 text-gray-700 placeholder-gray-400"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300 text-gray-700 placeholder-gray-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-all font-semibold"
          >
            Entrar
          </button>
        </form>

        {mensaje && (
          <p
            className={`mt-6 text-sm ${
              mensaje.includes("✅") ? "text-green-300" : "text-red-300"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;








