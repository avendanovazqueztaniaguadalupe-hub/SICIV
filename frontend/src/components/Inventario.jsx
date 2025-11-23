import axios from "axios";
import { useEffect, useState } from "react";

export default function Inventario({ rol }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  const [nuevo, setNuevo] = useState({
    id: null,
    codigo: "",
    nombre: "",
    categoria: "",
    cantidad: "",
    precio: "",
    descripcion: "",
  });

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/inventario");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Cargar producto al formulario para editar
  const cargarProductoParaEditar = (p) => {
    setNuevo({
      id: p._id,
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      cantidad: p.cantidad,
      precio: p.precio,
      descripcion: p.descripcion,
    });
  };

  // ✔ Validaciones
  const validarProducto = () => {
    const codigo = nuevo.codigo.trim();
    const nombre = nuevo.nombre.trim();
    const categoria = nuevo.categoria.trim();
    const cantidad = Number(nuevo.cantidad);
    const precio = Number(nuevo.precio);
    const descripcion = nuevo.descripcion.trim();

    if (!codigo || !nombre || !categoria || !descripcion) {
      alert("Completa todos los campos obligatorios.");
      return null;
    }
    if (nombre.length < 3) return alert("El nombre es demasiado corto.");
    if (categoria.length < 3) return alert("La categoría es demasiado corta.");
    if (isNaN(cantidad) || cantidad < 0) return alert("Cantidad inválida.");
    if (isNaN(precio) || precio < 0) return alert("Precio inválido.");

    return { codigo, nombre, categoria, cantidad, precio, descripcion };
  };

  // ➕ AGREGAR producto
  const agregarProducto = async () => {
    const productoValido = validarProducto();
    if (!productoValido) return;

    const existe = productos.some(
      (p) => p.codigo === productoValido.codigo
    );
    if (existe) return alert("Ya existe un producto con ese código.");

    try {
      await axios.post("http://localhost:4000/api/inventario", productoValido);
      setNuevo({
        id: null,
        codigo: "",
        nombre: "",
        categoria: "",
        cantidad: "",
        precio: "",
        descripcion: "",
      });
      obtenerProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // ✏️ EDITAR producto
  const editarProducto = async () => {
    if (!nuevo.id) return;

    const productoValido = validarProducto();
    if (!productoValido) return;

    try {
      await axios.put(
        `http://localhost:4000/api/inventario/${nuevo.id}`,
        productoValido
      );

      alert("Producto actualizado correctamente.");

      setNuevo({
        id: null,
        codigo: "",
        nombre: "",
        categoria: "",
        cantidad: "",
        precio: "",
        descripcion: "",
      });

      obtenerProductos();
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };

  // 🗑️ Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/inventario/${id}`);
      obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // 🔍 Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;

    return coincideBusqueda && coincideCategoria;
  });

  const categoriasUnicas = ["Todas", ...new Set(productos.map((p) => p.categoria))];

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">📦 Inventario</h1>

      {/* Buscar + filtro */}
      <div className="bg-purple-800 bg-opacity-30 p-4 rounded-lg mb-6 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, código o categoría"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 rounded text-black col-span-2"
        />

        <select
          className="p-2 rounded text-black"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          {categoriasUnicas.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Formulario */}
      {rol === "admin" && (
        <div className="bg-purple-800 bg-opacity-30 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Código"
              value={nuevo.codigo}
              onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })}
              className="p-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
              className="p-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="Categoría"
              value={nuevo.categoria}
              onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
              className="p-2 rounded text-black"
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={nuevo.cantidad}
              onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })}
              className="p-2 rounded text-black"
            />
            <input
              type="number"
              placeholder="Precio"
              value={nuevo.precio}
              onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
              className="p-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevo.descripcion}
              onChange={(e) =>
                setNuevo({ ...nuevo, descripcion: e.target.value })
              }
              className="p-2 rounded text-black col-span-2"
            />

            <button
              onClick={nuevo.id ? editarProducto : agregarProducto}
              className={`py-2 px-4 rounded text-white transition-all ${
                nuevo.id ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {nuevo.id ? "Guardar cambios" : "+ Agregar"}
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <table className="w-full bg-purple-900 bg-opacity-40 rounded-lg">
        <thead>
          <tr className="text-left text-purple-200 border-b border-purple-500">
            <th className="p-3">Código</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Categoría</th>
            <th className="p-3">Cantidad</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Descripción</th>
            {rol === "admin" && <th className="p-3">Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p._id} className="hover:bg-purple-800">
              <td className="p-3">{p.codigo}</td>
              <td className="p-3">{p.nombre}</td>
              <td className="p-3">{p.categoria}</td>
              <td className="p-3">{p.cantidad}</td>
              <td className="p-3">${p.precio}</td>
              <td className="p-3">{p.descripcion}</td>

              {rol === "admin" && (
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => cargarProductoParaEditar(p)}
                    className="bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded text-sm text-white"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(p._id)}
                    className="bg-red-500 hover:bg-red-700 px-2 py-1 rounded text-sm text-white"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


