import express from "express";
import Producto from "../models/Producto.js";
import Venta from "../models/Venta.js";

const router = express.Router();

// Obtener todas las ventas
router.get("/", async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 });
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas" });
  }
});

// Registrar una nueva venta
router.post("/", async (req, res) => {
  try {
    const { producto, cantidad, total } = req.body;

    // Guardar la venta
    const nuevaVenta = new Venta({ producto, cantidad, total });
    await nuevaVenta.save();

    // Descontar del inventario
    const prod = await Producto.findOne({ nombre: producto });
    if (prod) {
      prod.cantidad -= cantidad;
      if (prod.cantidad < 0) prod.cantidad = 0;
      await prod.save();
    }

    res.status(201).json({ message: "Venta registrada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar la venta" });
  }
});

export default router;
