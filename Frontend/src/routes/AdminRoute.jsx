import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute() {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}