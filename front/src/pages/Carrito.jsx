import { useContext, useEffect, useState, useCallback } from "react";
import { ValuContext } from "../context/ValuContext";
import { showToast } from "../utils/toast";
import { LayoutNavFoo } from "../layouts/LayoutNavFoo";
import { api } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { formatearDinero } from "../utils/formatDiner";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { initialFormData } from "../utils/formData";
import { calculateMD5 } from "../utils/signature";
import { generateReferenceCode } from "../utils/referenceCode";



export const Carrito = () => {
  const { carrito, setCarrito, idCarrito, usuario } = useContext(ValuContext);
  const { items } = carrito;
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (formData.amount && formData.currency) {
      const signature = calculateMD5(
        import.meta.env.VITE_API_KEY_PAYU,
        import.meta.env.VITE_MERCHANT_ID_PAYU,
        formData.referenceCode,
        formData.amount,
        formData.currency
      );
      setFormData((prevData) => ({
        ...prevData,
        signature: signature,
      }));
    }
  }, [formData.amount, formData.currency, formData.referenceCode]);

  const updateItemQuantity = (itemId, cantidad) => {
    return api.post("/items_carrito/create/", {
      carrito_id: idCarrito,
      producto_id: itemId,
      cantidad,
    });
  };

  const removeItemFromCart = async (itemId) => {
    setCarrito((prevCarrito) => ({
      ...prevCarrito,
      items: prevCarrito.items.filter((item) => item.producto.id !== itemId),
    }));
    showToast("Item eliminado del carrito", "success");
  };

  const increment = async (itemId, cantidad) => {
    const item = carrito.items.find((it) => it.producto.id === itemId);
    if (!item) return;
    const available = item.producto.cantidad ?? 0; // stock available
    const newQuantity = cantidad + 1;
    if (newQuantity > available) {
      showToast("No hay suficiente producto disponible", "error");
      return;
    }
    await updateItemQuantity(itemId, newQuantity);
    setCarrito((prevCarrito) => ({
      ...prevCarrito,
      items: prevCarrito.items.map((it) =>
        it.producto.id === itemId ? { ...it, cantidad: newQuantity } : it
      ),
    }));
  };

  const decrement = async (itemId, cantidad) => {
    const newQuantity = cantidad - 1;
    if (newQuantity < 0) return;
    await updateItemQuantity(itemId, newQuantity);
    if (newQuantity > 0) {
      setCarrito((prevCarrito) => ({
        ...prevCarrito,
        items: prevCarrito.items.map((item) =>
          item.producto.id === itemId
            ? { ...item, cantidad: newQuantity }
            : item
        ),
      }));
    } else {
      removeItemFromCart(itemId);
    }
  };

  const handleCheckout = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = import.meta.env.VITE_URL_PAYU;

    for (const key in formData) {
      // eslint-disable-next-line no-prototype-builtins
      if (formData.hasOwnProperty(key)) {
        const hiddenField = document.createElement("input");
        hiddenField.type = "hidden";
        hiddenField.name = key;
        hiddenField.value = formData[key];
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  const calcularTotal = useCallback(() => {
    if (!items) return 0;
    return items.reduce(
      (total, { cantidad, producto }) => total + cantidad * producto.precio,
      0
    );
  }, [items]);

  useEffect(() => {
    if (!items || !usuario) return;
    setFormData((prevData) => ({
      ...prevData,
      description: items?.map((item) => item.producto.nombre).join(", "),
      amount: calcularTotal(),
      buyerEmail: usuario.email,
      buyerFullName: `${usuario.first_name} ${usuario.last_name}`,
      telephone: usuario.celular,
      referenceCode: generateReferenceCode(usuario),
    }));
  }, [items, calcularTotal, usuario]);

  
  return (
    <LayoutNavFoo>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Carrito</h1>
        <div className="bg-white shadow-lg rounded-lg p-4">
          {items?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg mb-4">
                Tu carrito está vacío.
              </p>
              <p className="text-gray-500">
                ¡Explora nuestros productos y añade lo que más te guste!
              </p>
              <button
                className="mt-4 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
                onClick={() => navigate("/productos")}
              >
                Ir a Productos
              </button>
            </div>
          ) : (
            <>
              {items?.map(({ cantidad, producto }) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between mb-4 p-2 border-b"
                >
                  <img
                    src={`${import.meta.env.VITE_BACK_URL_PROD}${
                      producto.imagen
                    }`}
                    alt={producto.nombre}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 mx-4">
                    <h3 className="font-semibold">{producto.nombre}</h3>
                    <p className="text-gray-600">
                      Precio: {formatearDinero(producto.precio)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <IoMdRemoveCircle
                      className="text-pink-600 cursor-pointer w-8 h-8"
                      onClick={() => decrement(producto.id, cantidad)}
                    />
                    <span className="mx-2">{cantidad}</span>
                    <IoMdAddCircle
                      className="text-pink-600 cursor-pointer w-8 h-8"
                      onClick={() => increment(producto.id, cantidad)}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-4">
                <span>Total:</span>
                <span>{formatearDinero(calcularTotal())}</span>
              </div>
              <div className="mt-4">
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg"
                  onClick={handleCheckout}
                >
                  Pagar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutNavFoo>
    
  );
};
