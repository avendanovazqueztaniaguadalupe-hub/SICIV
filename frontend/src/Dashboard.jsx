import { useState } from "react";
import AcercaDe from "./components/AcercaDe";
import Inventario from "./components/Inventario";
import Reportes from "./components/Reportes";
import Sidebar from "./components/Sidebar";
import Ventas from "./components/Ventas";

export default function Dashboard({ rol, setUsuario }) {
  const [seccion, setSeccion] = useState("inicio");

  const renderContenido = () => {
    switch (seccion) {
      case "inventario":
        return <Inventario rol={rol} />;
      case "ventas":
        return <Ventas rol={rol} />;
      case "reportes":
        return <Reportes rol={rol} />;
      case "acerca":
        return <AcercaDe rol={rol} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-white text-3xl font-bold">
              Bienvenido, {rol === "admin" ? "Administrador 💼" : "Empleado 🧍"}
            </h1>
          </div>
        );
    }
  };

  const cerrarSesion = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      setUsuario(null);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0f172a] to-[#7c3aed]">
      <Sidebar setSeccion={setSeccion} rol={rol} cerrarSesion={cerrarSesion} />
      <div className="flex-1 p-8 overflow-y-auto">{renderContenido()}</div>
    </div>
  );
}

