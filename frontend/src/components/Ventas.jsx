import axios from "axios";
import { useEffect, useState } from "react";

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    producto: "",
    cantidad: "",
  });

  // 🟣 Obtener productos desde el inventario
  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/inventario");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // 🟣 Obtener las ventas registradas
  const obtenerVentas = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/ventas");
      setVentas(res.data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  // 🟣 Cargar datos al montar el componente
  useEffect(() => {
    obtenerProductos();
    obtenerVentas();
  }, []);

  // 🟣 Registrar nueva venta
  const registrarVenta = async () => {
    if (!nuevaVenta.producto || !nuevaVenta.cantidad)
      return alert("Por favor completa todos los campos.");

    const prod = productos.find((p) => p.nombre === nuevaVenta.producto);
    if (!prod) return alert("Producto no encontrado en el inventario.");

    if (nuevaVenta.cantidad > prod.cantidad)
      return alert("⚠️ No hay suficiente stock disponible.");

    const total = prod.precio * nuevaVenta.cantidad;

    try {
      await axios.post("http://localhost:4000/api/ventas", {
        producto: nuevaVenta.producto,
        cantidad: nuevaVenta.cantidad,
        total,
      });

      alert("✅ Venta registrada correctamente.");
      setNuevaVenta({ producto: "", cantidad: "" });
      obtenerProductos();
      obtenerVentas();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      alert("❌ Error al registrar la venta.");
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        💰 Módulo de Ventas
      </h1>

      {/* 🟪 Formulario de registro */}
      <div className="bg-purple-800 bg-opacity-30 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select
            value={nuevaVenta.producto}
            onChange={(e) =>
              setNuevaVenta({ ...nuevaVenta, producto: e.target.value })
            }
            className="p-2 rounded text-black"
          >
            <option value="">Seleccionar producto</option>
            {productos.map((p) => (
              <option key={p._id} value={p.nombre}>
                {p.nombre} - ${p.precio} ({p.cantidad} disponibles)
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            value={nuevaVenta.cantidad}
            onChange={(e) =>
              setNuevaVenta({ ...nuevaVenta, cantidad: Number(e.target.value) })
            }
            className="p-2 rounded text-black"
          />

          <button
            onClick={registrarVenta}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-all"
          >
            Registrar Venta
          </button>
        </div>
      </div>

      {/* 🟪 Tabla de ventas */}
      <table className="w-full bg-purple-900 bg-opacity-40 rounded-lg">
        <thead>
          <tr className="text-left text-purple-200 border-b border-purple-500">
            <th className="p-3">Producto</th>
            <th className="p-3">Cantidad</th>
            <th className="p-3">Total</th>
            <th className="p-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-purple-300">
                No hay ventas registradas.
              </td>
            </tr>
          ) : (
            ventas.map((v) => (
              <tr key={v._id} className="hover:bg-purple-800">
                <td className="p-3">{v.producto}</td>
                <td className="p-3">{v.cantidad}</td>
                <td className="p-3">${v.total}</td>
                <td className="p-3">
                  {new Date(v.fecha).toLocaleDateString("es-MX")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
