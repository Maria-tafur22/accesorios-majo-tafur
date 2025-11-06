import { useEffect, useState } from "react";
import { LayoutNavFoo } from "../layouts/LayoutNavFoo";
import { api } from "../api/axiosConfig";
import { CardProduct } from "../atoms/CardProduct";

export const Categoria = ({ id, nombre, descripcion }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/productos/getByCategory/${id}`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [id]);
  return (
    <LayoutNavFoo>
      <div className="w-full p-4 bg-white rounded-lg  ">
        <h1 className="text-4xl font-bold text-center">{nombre}</h1>
        <p className="text-center mt-8">{descripcion}</p>
        <hr className="border border-gray-300 my-4" />
        <div className="flex flex-wrap justify-center gap-8 mt-8 px-44">
          {products.filter((product) => product.estado && product.cantidad > 0).map((product) => (
            <CardProduct
              key={product.id}
              id={product.id}
              img={`${import.meta.env.VITE_BACK_URL_PROD}${product.imagen}`}
              title={product.nombre}
              link={`/productos/${product.categoria}/${product.id}/${product.categoria}`}
              precio={product.precio}
              carrito={true}
              cantidad={product.cantidad}
              estado={product.estado}
            />
          ))}
        </div>
      </div>
    </LayoutNavFoo>
  );
};
