import { Outlet, Link } from "react-router";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <Link to="/" className="auth-logo">
        Cuddle & co.
      </Link>
      <div className="auth-card card">
        <Outlet />
      </div>
    </div>
  );
}
