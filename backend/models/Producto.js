import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String }
});

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;



