import { useContext, useEffect, useState, useCallback } from "react";
import { ValuContext } from "../context/ValuContext";
import { showToast } from "../utils/toast";
import { LayoutNavFoo } from "../layouts/LayoutNavFoo";
import { useNavigate } from "react-router-dom";
import { formatearDinero } from "../utils/formatDiner";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { initialFormData } from "../utils/formData";
import { calculateMD5 } from "../utils/signature";
import { generateReferenceCode } from "../utils/referenceCode";



export const Carrito = () => {
  const { carrito, setCarrito, usuario, updateItem, removeItem } = useContext(ValuContext);
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

  

  const increment = async (itemId, cantidad) => {
    const item = carrito.items.find((it) => it.producto.id === itemId);
    if (!item) return;
    const available = item.producto.cantidad ?? 0; // stock available
    const newQuantity = cantidad + 1;
    if (newQuantity > available) {
      showToast("No hay suficiente producto disponible", "error");
      return;
    }
    try {
      await updateItem(itemId, newQuantity);
      setCarrito((prevCarrito) => ({
        ...prevCarrito,
        items: prevCarrito.items.map((it) =>
          it.producto.id === itemId ? { ...it, cantidad: newQuantity } : it
        ),
      }));
    } catch (err) {
      console.error(err);
      showToast("Error actualizando cantidad", "error");
    }
  };

  const decrement = async (itemId, cantidad) => {
    const newQuantity = cantidad - 1;
    if (newQuantity < 0) return;
    try {
      if (newQuantity > 0) {
        await updateItem(itemId, newQuantity);
        setCarrito((prevCarrito) => ({
          ...prevCarrito,
          items: prevCarrito.items.map((item) =>
            item.producto.id === itemId ? { ...item, cantidad: newQuantity } : item
          ),
        }));
      } else {
        await removeItem(itemId);
        setCarrito((prevCarrito) => ({
          ...prevCarrito,
          items: prevCarrito.items.filter((item) => item.producto.id !== itemId),
        }));
      }
    } catch (err) {
      console.error(err);
      showToast("Error actualizando cantidad", "error");
    }
  };

  const handleCheckout = () => {
    if (!usuario) {
      navigate("/register");
      return;
    }
    const form = document.createElement("form");
    form.method = "POST";
    form.action = import.meta.env.VITE_URL_PAYU;

    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
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
    // Debug: log items and image URLs
    console.log("Carrito items:", items);
    items.forEach((item) => {
      console.log(`Item ${item.producto.id}: imagen = ${item.producto.imagen}`);
    });
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
              {items?.map(({ cantidad, producto }) => {
                let imageUrl = "";
                if (producto.imagen) {
                  // If already a full URL (starts with http/https), use as-is
                  if (producto.imagen.startsWith("http://") || producto.imagen.startsWith("https://")) {
                    imageUrl = producto.imagen;
                  }
                  // If relative path starting with /, prepend backend URL
                  else if (producto.imagen.startsWith("/")) {
                    imageUrl = `${import.meta.env.VITE_BACK_URL_PROD}${producto.imagen}`;
                  }
                  // If just filename/path without /, prepend /media/ and backend URL
                  else {
                    imageUrl = `${import.meta.env.VITE_BACK_URL_PROD}/media/${producto.imagen}`;
                  }
                }
                return (
                <div
                  key={producto.id}
                  className="flex items-center justify-between mb-4 p-2 border-b"
                >
                  <img src={imageUrl} alt={producto.nombre} className="w-20 h-20 object-cover rounded" onError={(e) => { e.target.src = import.meta.env.VITE_BACK_URL_PROD + "/media/images/placeholder.jpg"; }} />
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
                );
              })}
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
