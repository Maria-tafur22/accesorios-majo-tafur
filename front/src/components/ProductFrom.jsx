import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IoMdCloseCircle } from "react-icons/io";
import { api } from "../api/axiosConfig";
import { showToast } from "../utils/toast";

export const ProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    imagen: null,
    estado: "",
    cantidad: 0,
    categoria: "",
    isFavorite: false,
  });
  const [categories, setCategories] = useState([]);
  const { nombre, precio, estado, cantidad, categoria, isFavorite } = formData;
  const [img, setImg] = useState(null);
  const queryClient = useQueryClient();

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categorias/get");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (product && product.id) {
      // No mutamos `product`. Mapear campos al estado del formulario.
      const mapped = {
        nombre: product.nombre || "",
        precio: product.precio || "",
        estado: product.estado === true || product.estado === "1" ? "1" : "0",
        cantidad: product.cantidad || 0,
        categoria: product.categoria && product.categoria.id ? product.categoria.id : product.categoria || "",
        isFavorite: !!product.isFavorite,
        imagen: null,
      };
      setFormData(mapped);

      // Configurar vista previa de imagen si existe
      const imgUrl = product.imagen
        ? product.imagen.startsWith("http")
          ? product.imagen
          : `${import.meta.env.VITE_BACK_URL_PROD}${product.imagen}`
        : null;
      setImg(imgUrl);
    }
  }, [product]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, imagen: files[0] }));
          setImg(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    // Normalizar precio: remover separadores de miles y comas
    const precioClean = String(formData.precio).replace(/[^0-9]/g, "");
    formDataToSend.append("precio", precioClean);
    formDataToSend.append("estado", formData.estado);
    formDataToSend.append("cantidad", formData.cantidad);
    formDataToSend.append("categoria", parseInt(formData.categoria));
    formDataToSend.append("isFavorite", formData.isFavorite); // Enviar isFavorite

    if (formData.imagen && formData.imagen instanceof File) {
      formDataToSend.append("imagen", formData.imagen);
    }
    try {
      if (product && product.id) {
        await api.put(`/productos/products/${product.id}/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Producto actualizado exitosamente", "success");
      } else {
        await api.post("/productos/products/", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Producto creado exitosamente", "success");
      }

      // Forzar refetch inmediato de productos
      try {
        queryClient.invalidateQueries(["productos"]);
      } catch (err) {
        // no-op si falla invalidation
      }

      onClose();
    } catch (error) {
      showToast(error.response?.data?.detail || "Error en el servidor", "error");
      console.error("Error submitting form:", error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="max-h-[95vh] overflow-auto relative flex flex-col w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg border border-gray-300 p-4">
        <IoMdCloseCircle
          size={24}
          className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 cursor-pointer"
          onClick={onClose}
        />
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Imagen del Producto
        </label>
        <div className="mb-4">
          <input
            type="file"
            name="imagen"
            onChange={handleChange}
            className="mb-2 hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="flex justify-center items-center border-2 border-gray-300 rounded-lg h-60 overflow-hidden relative">
              <img
                src={img || "https://via.placeholder.com/300"}
                alt={nombre}
                className="object-cover w-full h-full"
              />
              {!img && (
                <span className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Selecciona una imagen
                </span>
              )}
            </div>
          </label>
        </div>
        <input
          type="text"
          name="nombre"
          onChange={handleChange}
          value={nombre || ""}
          className="w-full p-2 border border-gray-300 rounded-lg text-lg mb-4 outline-pink-200"
          placeholder="Nombre del producto"
        />
        <input
          type="number"
          name="precio"
          onChange={handleChange}
          value={precio || ""}
          className="w-full p-2 border border-gray-300 rounded-lg text-lg mb-4 outline-pink-200"
          placeholder="Precio"
        />
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Estado:
        </label>
        <select
          name="estado"
          onChange={handleChange}
          value={estado || ""}
          className="w-full p-2 border border-gray-300 rounded-lg text-lg mb-4 outline-pink-200 cursor-pointer"
        >
          <option value="">Selecciona un estado</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Categoría:
        </label>
        <select
          name="categoria"
          onChange={handleChange}
          value={categoria || ""}
          className="w-full p-2 border border-gray-300 rounded-lg text-lg mb-4 outline-pink-200 cursor-pointer"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <label className="font-medium">
            Cantidad:
            <input
              type="number"
              name="cantidad"
              onChange={handleChange}
              value={cantidad || ""}
              className="ml-2 p-1 border border-gray-300 rounded-lg outline-pink-200"
            />
          </label>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="isFavorite"
            checked={isFavorite}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm text-gray-600">Marcar como favorito</label>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
        >
          {product.id ? "Actualizar" : "Agregar"}
        </button>
      </div>
    </div>,
    document.body
  );
};
