import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // or a small spinner component if you have one
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}