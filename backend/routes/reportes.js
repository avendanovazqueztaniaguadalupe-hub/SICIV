import express from "express";
import Producto from "../models/Producto.js";
import Venta from "../models/Venta.js";

const router = express.Router();

// 📊 API de reportes completos
router.get("/", async (req, res) => {
  try {
    // Total de productos
    const totalProductos = await Producto.countDocuments();

    // Total de ventas
    const totalVentas = await Venta.countDocuments();

    // Ingreso total (suma de todos los totales de ventas)
    const ventas = await Venta.find();
    const ingresoTotal = ventas.reduce((sum, v) => sum + v.total, 0);

    // Última venta registrada
    const ultimaVenta =
      ventas.length > 0 ? ventas[ventas.length - 1].fecha : "Sin ventas";

    // 📦 Productos agrupados por categoría
    const productosPorCategoria = await Producto.aggregate([
      { $group: { _id: "$categoria", total: { $sum: 1 } } },
      { $project: { categoria: "$_id", total: 1, _id: 0 } },
    ]);

    // 📅 Ventas agrupadas por fecha (solo yyyy-mm-dd)
    const ventasPorDia = await Venta.aggregate([
      {
        $group: {
          _id: { $substr: ["$fecha", 0, 10] },
          total: { $sum: "$total" },
        },
      },
      { $project: { dia: "$_id", total: 1, _id: 0 } },
      { $sort: { dia: 1 } },
    ]);

    // Enviar reporte al frontend
    res.json({
      totalProductos,
      totalVentas,
      ingresoTotal,
      ultimaVenta,
      productosPorCategoria,
      ventasPorDia,
    });
  } catch (error) {
    console.error("Error en reportes:", error);
    res.status(500).json({ message: "Error al generar reportes" });
  }
});

export default router;



