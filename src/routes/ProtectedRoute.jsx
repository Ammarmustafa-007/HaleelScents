import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_SESSION_KEY = "haleelscents_admin";

export const ProtectedRoute = ({ children, type }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (type === "admin") {
    const isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
