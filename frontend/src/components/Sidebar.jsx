export default function Sidebar({ setSeccion, rol, cerrarSesion }) {
  return (
    <div className="w-64 bg-gradient-to-b from-[#1e1b4b] to-[#7c3aed] text-white flex flex-col justify-between">
      {/* Encabezado */}
      <div>
        <div className="text-center py-6 border-b border-purple-500">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
            💜 SICIV
          </h1>
          <p className="text-sm italic mt-1">
            “La innovación es el nuevo orden del control.”
          </p>
        </div>

        {/* Menú de navegación */}
        <nav className="flex flex-col p-4 space-y-3">
          {/* Siempre visible para ambos roles */}
          <button
            onClick={() => setSeccion("inventario")}
            className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-left"
          >
            📦 Inventario
          </button>

          {/* Opciones exclusivas del administrador */}
          {rol === "admin" && (
            <>
              <button
                onClick={() => setSeccion("ventas")}
                className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-left"
              >
                💰 Ventas
              </button>

              <button
                onClick={() => setSeccion("reportes")}
                className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-left"
              >
                📊 Reportes
              </button>
            </>
          )}

          {/* Visible para ambos */}
          <button
            onClick={() => setSeccion("acerca")}
            className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-left"
          >
            ℹ️ Acerca de
          </button>
        </nav>
      </div>

      {/* Pie de barra lateral */}
      <div className="p-4 border-t border-purple-500 text-center">
        <button
          onClick={cerrarSesion}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg w-full transition-all"
        >
          🚪 Cerrar sesión
        </button>
        <p className="text-xs mt-4 opacity-75">
          © 2025 SICIV <br />
          By Tania Guadalupe Avendaño Vázquez
        </p>
      </div>
    </div>
  );
}


