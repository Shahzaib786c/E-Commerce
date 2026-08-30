import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import "./AdminLayout.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "ti-layout-dashboard", end: true },
  { to: "/admin/categories", label: "Categories", icon: "ti-category" },
  { to: "/admin/products", label: "Products", icon: "ti-box" },
  { to: "/admin/orders", label: "Orders", icon: "ti-shopping-bag" },
  { to: "/admin/customers", label: "Customers", icon: "ti-users" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="admin-sidebar-logo">Admin</p>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            >
              <i className={`ti ${item.icon}`} aria-hidden="true"></i>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span />
          <div className="admin-topbar-user">
            <span>{user?.name}</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Log out
            </button>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
