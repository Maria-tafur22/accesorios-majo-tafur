import { createContext, useEffect, useState } from "react";
import { checkAuth } from "../auth/validateAuth";
import { api } from "../api/axiosConfig";

export const ValuContext = createContext(null);

export const ValuProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [categories, setCategories] = useState([]);
  // carrito structure: { items: [ { producto: {...}, cantidad } ] }
  const [carrito, setCarrito] = useState(() => {
    const guest = localStorage.getItem("guest_cart");
    if (!guest) return { items: [] };
    try {
      const parsed = JSON.parse(guest);
      // Ensure image URLs are proper when loading from localStorage
      if (parsed.items && Array.isArray(parsed.items)) {
        parsed.items = parsed.items.map((item) => {
          if (item.producto && item.producto.imagen) {
            let imageUrl = item.producto.imagen;
            // If it's a full URL already, keep it
            if (!imageUrl.startsWith("http")) {
              // If relative path, ensure it has proper format
              if (!imageUrl.startsWith("/")) {
                imageUrl = `/${imageUrl}`;
              }
            }
            return {
              ...item,
              producto: {
                ...item.producto,
                imagen: imageUrl,
              },
            };
          }
          return item;
        });
      }
      return parsed;
    } catch (err) {
      console.error("Error parsing guest cart from localStorage:", err);
      return { items: [] };
    }
  });
  const [idCarrito, setIdCarrito] = useState(null);
  const [add, setAdd] = useState(false);
  
  // Helper to persist guest cart to localStorage
  const persistGuestCart = (cart) => {
    try {
      localStorage.setItem("guest_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Error persisting guest cart", err);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categorias/get/");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [carrito]);

  useEffect(() => {
    if (!usuario) return;
    const fetchCarrito = async () => {
      try {
        const response = await api.get(`/carrito/get/${usuario.id}`, {});
        setCarrito(response.data);
        setIdCarrito(response.data.carrito_id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCarrito();
  }, [usuario, add]);

  // When user logs in, if there is a guest cart, sync it to server
  useEffect(() => {
    const syncGuestCart = async () => {
      if (!usuario) return;
      const guest = localStorage.getItem("guest_cart");
      if (!guest) return;
      const guestCart = JSON.parse(guest);
      if (!guestCart.items || guestCart.items.length === 0) return;

      try {
        // Ensure we have idCarrito for the logged user
        const response = await api.get(`/carrito/get/${usuario.id}`);
        const serverCarritoId = response.data.carrito_id;
        // Add each guest item to server
        for (const item of guestCart.items) {
          await api.post("/items_carrito/create/", {
            carrito_id: serverCarritoId,
            producto_id: item.producto.id,
            cantidad: item.cantidad,
          });
        }
        // Clear guest cart
        localStorage.removeItem("guest_cart");
        setCarrito(response.data);
        setIdCarrito(serverCarritoId);
        setAdd((prev) => !prev);
      } catch (err) {
        console.error("Error syncing guest cart", err);
      }
    };
    syncGuestCart();
  }, [usuario]);

  // Cart manipulation functions (handle guest and logged-in users)
  const addItem = async (producto, cantidad = 1) => {
    if (usuario) {
      // server side
      try {
        await api.post("/items_carrito/create/", {
          carrito_id: idCarrito,
          producto_id: producto.id,
          cantidad,
        });
        setAdd((prev) => !prev);
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      // guest: update localStorage
      const existing = carrito.items.find((it) => it.producto.id === producto.id);
      let newCart;
      if (existing) {
        newCart = {
          items: carrito.items.map((it) =>
            it.producto.id === producto.id ? { ...it, cantidad: it.cantidad + cantidad } : it
          ),
        };
      } else {
        newCart = { items: [...carrito.items, { producto, cantidad }] };
      }
      setCarrito(newCart);
      persistGuestCart(newCart);
    }
  };

  const updateItem = async (productoId, cantidad) => {
    if (usuario) {
      try {
        await api.post("/items_carrito/create/", {
          carrito_id: idCarrito,
          producto_id: productoId,
          cantidad,
        });
        setAdd((prev) => !prev);
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      const newCart = {
        items: carrito.items
          .map((it) => (it.producto.id === productoId ? { ...it, cantidad } : it))
          .filter((it) => it.cantidad > 0),
      };
      setCarrito(newCart);
      persistGuestCart(newCart);
    }
  };

  const removeItem = async (productoId) => {
    if (usuario) {
      try {
        await api.post("/items_carrito/create/", {
          carrito_id: idCarrito,
          producto_id: productoId,
          cantidad: 0,
        });
        setAdd((prev) => !prev);
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      const newCart = { items: carrito.items.filter((it) => it.producto.id !== productoId) };
      setCarrito(newCart);
      persistGuestCart(newCart);
    }
  };

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const result = await checkAuth();
          setUsuario(result.user);
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
      }
    };
    fetchAuthData();
  }, []);

  return (
    <ValuContext.Provider
      value={{
        usuario,
        setUsuario,
        categories,
        carrito,
        setCarrito,
        idCarrito,
        setAdd,
        // cart helpers
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </ValuContext.Provider>
  );
};
