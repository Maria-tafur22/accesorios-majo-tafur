import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Home } from "./pages/Home";
import { ValuContext } from "./context/ValuContext";
import { AdminPanel } from "./pages/AdminPanel";
import { NotFound } from "./pages/NotFound";
import { Productos } from "./pages/Productos";
import { useContext } from "react";
import { Categoria } from "./components/Categoria";
import { About } from "./pages/About";
import { Carrito } from "./pages/Carrito";
import { Pedidos } from "./pages/Pedidos";
import { Confirmation } from "./pages/Confirmation";

function App() {
  const { categories } = useContext(ValuContext);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminPanel />} />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route
          path="/Carrito"
          element={<ProtectedRoute element={<Carrito />} />}
        />
        <Route
          path="/pedidos"
          element={<ProtectedRoute element={<Pedidos />} />}
        />
        <Route path="/confirmation" element={<Confirmation />} />

        {Array.isArray(categories) &&
          categories.map(({ id, nombre, descripcion }) => (
            <Route
              key={id}
              path={`/productos/${nombre}`}
              element={
                <Categoria id={id} nombre={nombre} descripcion={descripcion} />
              }
            />
          ))}

        <Route path="/about" element={<About />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
