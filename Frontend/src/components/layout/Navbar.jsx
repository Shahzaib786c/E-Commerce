import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProducts } from "../../context/ProductsContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { items } = useCart();
  const { productIds } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();
  const { categories } = useProducts();
  const [catOpen, setCatOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const catRef = useRef(null);
  const accRef = useRef(null);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Bahar click hone par dropdown band kar do
  useEffect(() => {
    function handleClickOutside(e) {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatOpen(false);
      }
      if (accRef.current && !accRef.current.contains(e.target)) {
        setAccOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          Cuddle & co.
        </Link>

        <nav className={`navbar-links ${mobileOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/products" onClick={() => setMobileOpen(false)}>
            Shop
          </Link>
          <div className="navbar-dropdown" ref={catRef}>
            <span onClick={() => setCatOpen((o) => !o)}>
              Categories <i className="ti ti-chevron-down" aria-hidden="true"></i>
            </span>
            {catOpen && (
              <div className="dropdown-menu">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/products?category=${c.slug}`}
                    onClick={() => {
                      setMobileOpen(false);
                      setCatOpen(false);
                    }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/about" onClick={() => setMobileOpen(false)}>
            About
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
        </nav>

        <div className="navbar-icons">
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <i className="ti ti-heart" aria-hidden="true"></i>
            {productIds.length > 0 && <span className="icon-badge">{productIds.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <i className="ti ti-shopping-bag" aria-hidden="true"></i>
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </Link>
          <div className="navbar-dropdown" ref={accRef}>
            <button
              className="icon-btn"
              aria-label="Account"
              onClick={() => setAccOpen((o) => !o)}
            >
              <i className="ti ti-user" aria-hidden="true"></i>
            </button>
            {accOpen && (
              <div className="dropdown-menu dropdown-menu-right">
                {isLoggedIn ? (
                  <>
                    <span className="dropdown-hello">Hi, {user.name.split(" ")[0]}</span>
                    <Link to="/my-orders" onClick={() => setAccOpen(false)}>
                      My orders
                    </Link>
                    <button
                      className="dropdown-logout"
                      onClick={() => {
                        logout();
                        setAccOpen(false);
                        navigate("/");
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setAccOpen(false)}>
                      Log in
                    </Link>
                    <Link to="/auth/register" onClick={() => setAccOpen(false)}>
                      Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            className="icon-btn mobile-toggle"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <i className="ti ti-menu-2" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>
  );
}