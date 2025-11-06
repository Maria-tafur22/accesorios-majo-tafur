import { useNavigate } from "react-router-dom";
import { api } from "../api/axiosConfig";
import { useContext, useEffect, useState } from "react";
import { ValuContext } from "../context/ValuContext";
import { showToast } from "../utils/toast";
import { formatearDinero } from "../utils/formatDiner";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";

export const CardProduct = ({
  id,
  img,
  title,
  link,
  precio,
  cantidad: cantidadTotal,
  carrito: carritoState = false,
  estado = true,
}) => {
  const { idCarrito, carrito, setAdd, usuario } = useContext(ValuContext);
  const { items } = carrito;
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [alerta, setAlerta] = useState(""); // Nuevo estado para la alerta

  useEffect(() => {
    if (!items) return;
    const productInCart = items.find((item) => item.producto.id === id);
    if (productInCart) {
      setCantidad(productInCart.cantidad);
      setAddedToCart(true);
    }
  }, [items, id]);

  const handleClick = () => {
    navigate(link);
  };

  const addToCart = async () => {
    if (!estado || cantidadTotal <= 0) {
      showToast("Producto no disponible", "error");
      return;
    }
    if (!usuario) {
      showToast(
        "Debes iniciar sesión para agregar un producto al carrito",
        "error"
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }
    try {
      const response = await api.post("/items_carrito/create/", {
        carrito_id: idCarrito,
        producto_id: id,
        cantidad,
      });
      if (response.status === 201) {
        if (firstTime) {
          setAdd((prev) => !prev);
          showToast("Producto agregado al carrito", "success");
          setFirstTime(false);
        }
        setAddedToCart(true);
      }
    } catch {
      showToast("Error agregando el producto al carrito", "error");
    }
  };

  const increment = async () => {
    if (!addedToCart) {
      // If not yet in cart, adding increments the local counter only
      if (cantidad < cantidadTotal) setCantidad((prev) => prev + 1);
      return;
    }
    if (cantidad < cantidadTotal) {
      const newQty = cantidad + 1;
      setCantidad(newQty);
      setAlerta("");
      try {
        await api.post("/items_carrito/create/", {
          carrito_id: idCarrito,
          producto_id: id,
          cantidad: newQty,
        });
        setAdd((prev) => !prev);
      } catch (err) {
        // revert on error
        setCantidad((prev) => prev - 1);
        console.error(err);
        showToast("Error actualizando la cantidad", "error");
      }
    } else {
      setAlerta("No hay más artículos disponibles");
    }
  };

  const decrement = async () => {
    if (!addedToCart) {
      // not in cart: prevent decreasing below 1
      setCantidad((prev) => Math.max(prev - 1, 1));
      return;
    }

    if (cantidad > 1) {
      const newQty = cantidad - 1;
      setCantidad(newQty);
      setAlerta("");
      try {
        await api.post("/items_carrito/create/", {
          carrito_id: idCarrito,
          producto_id: id,
          cantidad: newQty,
        });
        setAdd((prev) => !prev);
      } catch (err) {
        // revert on error
        setCantidad((prev) => prev + 1);
        console.error(err);
        showToast("Error actualizando la cantidad", "error");
      }
    } else {
      // cantidad === 1 -> remove from cart
      try {
        await api.post("/items_carrito/create/", {
          carrito_id: idCarrito,
          producto_id: id,
          cantidad: 0,
        });
        setAddedToCart(false);
        setCantidad(1); // reset to 1 for future adds
        setAdd((prev) => !prev);
        setAlerta("");
      } catch (err) {
        console.error(err);
        showToast("Error eliminando el producto del carrito", "error");
      }
    }
  };

  return (
    <div
      onClick={() => {
        !carritoState && handleClick();
      }}
      className="relative flex flex-col w-64 mx-auto bg-gradient-to-r from-pink-50 to-pink-100 shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-[1.02] duration-300 border border-gray-200"
    >
      <img
        src={img}
        alt={title}
        className="w-full h-60 object-cover rounded-t-lg min-h-[60%]"
      />
      <div className="px-3 py-2 flex flex-col h-full">
        <h3 className="text-md font-bold text-center text-gray-800 mb-2 truncate">
          {title}
        </h3>
        <p className="text-xl text-center font-semibold text-pink-700 mb-3">
          {formatearDinero(precio)}
        </p>
        <div className="flex items-center justify-between flex-col text-sm text-gray-600 mb-4">
          <p className="font-medium mb-3">
            Cantidad disponible: {cantidadTotal}
          </p>
          {carritoState && !addedToCart ? (
            <button
              className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-300 ${(!estado || cantidadTotal <= 0) ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-pink-600 text-white hover:bg-pink-700"}`}
              onClick={addToCart}
              disabled={!estado || cantidadTotal <= 0}
            >
              {(!estado || cantidadTotal <= 0) ? "No disponible" : "Añadir al carrito"}
            </button>
          ) : (
            carritoState &&
            addedToCart && (
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-2">
                  <IoMdRemoveCircle
                    className="text-pink-600 cursor-pointer w-8 h-8"
                    onClick={decrement}
                  />
                  <span className="mx-2">{cantidad}</span>
                  <IoMdAddCircle
                    className="text-pink-600 cursor-pointer w-8 h-8"
                    onClick={increment}
                  />
                </div>
                {alerta && (
                  <span className="text-xs text-red-500 mt-1">{alerta}</span>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
