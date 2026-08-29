import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import ProductImagePlaceholder from "../../components/product/ProductImagePlaceholder.jsx";
import "./CartPage.css";

const DELIVERY_FLAT = 6;
const FREE_DELIVERY_THRESHOLD = 75;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const delivery = items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FLAT;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "var(--sp-7) 0" }}>
        <div className="empty-state">
          <i className="ti ti-shopping-bag" aria-hidden="true"></i>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: "var(--sp-3)" }}>
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="cart-title">Your cart ({items.length} items)</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.key} className="cart-item card">
              <div className="cart-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                ) : (
                  <ProductImagePlaceholder categorySlug={item.category} size="thumb" />
                )}
              </div>
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-variant">{item.variant ? `Size: ${item.variant}` : "No variant"}</p>
              </div>
              <div className="qty-stepper">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-item-price">${(item.price * item.quantity).toLocaleString()}</p>
              <button
                className="cart-item-remove"
                onClick={() => {
                  removeItem(item.key);
                  showToast("Removed from cart");
                }}
                aria-label="Remove item"
              >
                <i className="ti ti-trash" aria-hidden="true"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <p className="cart-summary-title">Order summary</p>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery</span>
            <span>{delivery === 0 ? "Free" : `$${delivery}`}</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </button>
          <p className="cart-summary-note">You'll be asked to log in first</p>
        </div>
      </div>
    </div>
  );
}
