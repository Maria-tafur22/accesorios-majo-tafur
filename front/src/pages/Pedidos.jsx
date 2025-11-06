import { useEffect, useState } from "react";
import { api } from "../api/axiosConfig";
import { LayoutNavFoo } from "../layouts/LayoutNavFoo";

export const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get("/pedidos/get");
        // Mostrar los pedidos desde el más reciente al más antiguo
        setPedidos(response.data.slice().reverse());
      } catch (error) {
        console.error(error);
      }
    };

    fetchPedidos();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (pedidos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <LayoutNavFoo>
      <div className="max-w-5xl mx-auto p-4 ">
        <h1 className="text-center text-3xl font-bold mb-6 text-pink-600">
          Pedidos
        </h1>
        {pedidos.map((pedido, index) => (
          <div
            key={pedido.id}
            className="bg-white shadow-lg rounded-lg mb-4 overflow-hidden border border-pink-200"
          >
            <div
              className="p-6 cursor-pointer hover:bg-pink-100 transition"
              onClick={() => toggleAccordion(index)}
            >
              <h2 className="text-2xl font-bold mb-2 text-pink-600">
                Pedido #{pedido.id}
              </h2>
              <h3 className="text-xl font-semibold">
                Cliente: {pedido.usuario?.first_name}{" "}
                {pedido.usuario?.last_name}
              </h3>
              <p className="text-gray-600">
                {new Date(pedido.fecha).toLocaleDateString()}
              </p>
            </div>
            {openIndex === index && (
              <div className="p-6 border-t border-pink-200 bg-pink-50">
                {pedido.usuario && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-pink-600">
                      Detalles del Cliente
                    </h3>
                    <p>{pedido.usuario.email}</p>
                    <p>
                      {pedido.usuario.direccion}, {pedido.usuario.barrio}
                    </p>
                    <p>
                      {pedido.usuario.ciudad}, {pedido.usuario.departamento}
                    </p>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-pink-600">
                    Estado
                  </h3>
                  <p>{pedido.estado.nombre}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-pink-600">
                    Detalles del Pedido
                  </h3>
                  {pedido.detalles_pedidos.map((detalle) => (
                    <div
                      key={detalle.producto.id}
                      className="flex items-center mb-2 border-b border-gray-200 py-2"
                    >
                      <img
                        src={`${import.meta.env.VITE_BACK_URL_PROD}${
                          detalle.producto.imagen
                        }`}
                        alt={detalle.producto.nombre}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <p className="font-semibold">
                          {detalle.producto.nombre}
                        </p>
                        <p>Cantidad: {detalle.cantidad}</p>
                        <p className="text-pink-500 font-semibold">
                          Precio: ${detalle.precio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="font-bold text-lg text-pink-600">
                  Total: ${pedido.total}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </LayoutNavFoo>
  );
};
