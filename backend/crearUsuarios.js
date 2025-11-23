import dotenv from "dotenv";
import mongoose from "mongoose";
import Usuario from "./models/Usuario.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB, creando usuarios...");

    // Usuarios de prueba
    const usuarios = [
      {
        nombre: "Administrador",
        correo: "admin@inv.com",
        contraseña: "209064",
        rol: "admin"
      },
      {
        nombre: "Tania",
        correo: "tania@inv.com",
        contraseña: "monaen",
        rol: "empleado"
      }
    ];

    for (const u of usuarios) {
      const existe = await Usuario.findOne({ correo: u.correo });
      if (!existe) {
        await Usuario.create(u);
        console.log(`👤 Usuario ${u.correo} creado.`);
      } else {
        console.log(`⚠️ El usuario ${u.correo} ya existe.`);
      }
    }

    console.log("✅ Todos los usuarios listos.");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error al conectar:", err);
    mongoose.connection.close();
  });
