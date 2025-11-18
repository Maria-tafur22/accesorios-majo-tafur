import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LoadingFullScreen } from "../atoms/LoadingFullScreen";
import { checkAuth } from "./validateAuth";

export const ProtectedRoute = ({ element: Component, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const result = await checkAuth();
      if (result && result.user) {
        setIsAuthenticated(result.user);
        setIsAdmin(result.user.is_admin || false);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingFullScreen />;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si requiere admin y no es admin, redirigir a home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return Component;
};
