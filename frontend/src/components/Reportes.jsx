import axios from "axios";
import { useEffect, useState } from "react";

// 📊 Gráficas
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Registrar módulos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Reportes() {
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    const obtenerReporte = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/reportes");
        setReporte(res.data);
      } catch (error) {
        console.error("Error al obtener reporte:", error);
      }
    };
    obtenerReporte();
  }, []);

  if (!reporte)
    return (
      <p className="text-white text-center mt-10">Cargando reportes...</p>
    );

  // 📊 Datos para gráficas

  // Datos: productos por categoría
  const categorias =
    reporte.productosPorCategoria?.map((c) => c.categoria) || [];
  const cantidades =
    reporte.productosPorCategoria?.map((c) => c.total) || [];

  // Datos: ventas por día
  const dias = reporte.ventasPorDia?.map((v) => v.dia) || [];
  const montos = reporte.ventasPorDia?.map((v) => v.total) || [];

  // Gráfica de barras
  const dataBarras = {
    labels: categorias,
    datasets: [
      {
        label: "Productos por categoría",
        data: cantidades,
        backgroundColor: "rgba(147, 51, 234, 0.6)",
        borderColor: "rgba(147, 51, 234, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  // Gráfica de líneas
  const dataLineas = {
    labels: dias,
    datasets: [
      {
        label: "Ventas por día",
        data: montos,
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.4)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        📊 Módulo de Reportes
      </h1>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-purple-700 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-lg font-semibold mb-2">🧩 Productos</h2>
          <p className="text-3xl font-bold">{reporte.totalProductos}</p>
        </div>

        <div className="bg-purple-700 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-lg font-semibold mb-2">🛒 Ventas</h2>
          <p className="text-3xl font-bold">{reporte.totalVentas}</p>
        </div>

        <div className="bg-purple-700 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-lg font-semibold mb-2">💰 Ingreso Total</h2>
          <p className="text-3xl font-bold">${reporte.ingresoTotal}</p>
        </div>

        <div className="bg-purple-700 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-lg font-semibold mb-2">🕓 Última Venta</h2>
          <p className="text-xl font-bold">{reporte.ultimaVenta}</p>
        </div>
      </div>

      {/* 📦 Gráfica: productos por categoría */}
      <div className="bg-purple-800 bg-opacity-30 mt-10 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📦 Productos por Categoría</h2>
        <Bar data={dataBarras} />
      </div>

      {/* 📅 Gráfica: ventas por día */}
      <div className="bg-purple-800 bg-opacity-30 mt-10 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📅 Ventas por Día</h2>
        <Line data={dataLineas} />
      </div>
    </div>
  );
}
