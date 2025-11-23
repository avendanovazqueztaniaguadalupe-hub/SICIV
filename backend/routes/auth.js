import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

dotenv.config();
const router = express.Router();

// 🔹 Ruta de login (acepta tanto "correo"/"contraseña" como "email"/"password")
router.post("/login", async (req, res) => {
  const { correo, email, contraseña, password } = req.body;

  // Permite ambos formatos de campos desde el frontend
  const userEmail = correo || email;
  const userPassword = contraseña || password;

  try {
    const usuario = await Usuario.findOne({ correo: userEmail });
    if (!usuario)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const esValido = await bcrypt.compare(userPassword, usuario.contraseña);
    if (!esValido)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      rol: usuario.rol,
      nombre: usuario.nombre,
      correo: usuario.correo,
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔹 Ruta para registrar usuarios (solo si quieres crear más desde Postman)
router.post("/register", async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const existe = await Usuario.findOne({ correo });
    if (existe)
      return res.status(400).json({ message: "El correo ya está registrado" });

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña,
      rol,
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en /register:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

export default router;

