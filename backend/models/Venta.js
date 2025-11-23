import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema(
  {
    producto: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Venta", ventaSchema);

