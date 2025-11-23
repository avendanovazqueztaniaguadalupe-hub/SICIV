import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Importar rutas
import authRoutes from "./routes/auth.js";
import inventarioRoutes from "./routes/inventario.js";
import reportesRoutes from "./routes/reportes.js"; // 📊 Nuevo módulo de reportes
import ventasRoutes from "./routes/ventas.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("💜 Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor activo y funcionando 🚀");
});

// Registrar rutas del sistema
app.use("/api/auth", authRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/reportes", reportesRoutes); // 📊 Reportes ya listo para Chart.js

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));












