import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./CheckoutPage.css";

const DELIVERY_FLAT = 6;
const FREE_DELIVERY_THRESHOLD = 75;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("safepay");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FLAT;
  const total = subtotal + delivery;

  if (items.length === 0 && !processing) {
    return (
      <div className="container" style={{ padding: "var(--sp-7) 0" }}>
        <div className="empty-state">
          <i className="ti ti-shopping-bag" aria-hidden="true"></i>
          <p>Your cart is empty, nothing to check out yet.</p>

          <button
            className="btn btn-primary"
            style={{ marginTop: "var(--sp-3)" }}
            onClick={() => navigate("/products")}
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }

  function update(field, value) {
    setAddress((a) => ({ ...a, [field]: value }));
  }

  function validate() {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = "Required";
    if (!address.phone.trim()) {
      errs.phone = "Required";
    } else if (!/^[\d\s\-+()]{7,20}$/.test(address.phone.trim())) {
      errs.phone = "Please enter a valid phone number";
    }
    if (!address.street.trim()) errs.street = "Required";
    if (!address.city.trim()) errs.city = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handlePay() {
    if (!validate()) return;
    setProcessing(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      }));

      const order = await placeOrder({
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        deliveryFee: delivery,
      });

      clearCart();
      navigate("/order-success", { state: { order } });
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="container checkout-page">
      <h1 style={{ marginBottom: "var(--sp-4)" }}>Checkout</h1>
      <div className="checkout-grid">
        <div className="checkout-forms">
          <div className="card checkout-section">
            <p className="checkout-section-title">
              <i className="ti ti-map-pin" aria-hidden="true"></i> Shipping
              address
            </p>

            <div className="checkout-field-grid">
              <div className="field">
                <label>Full name</label>
                <input
                  className="input"
                  value={address.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
                {errors.fullName && (
                  <p className="error-text">{errors.fullName}</p>
                )}
              </div>

              <div className="field">
                <label>Phone number</label>
                <input
                  className="input"
                  value={address.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div className="field checkout-span-2">
                <label>Street address</label>
                <input
                  className="input"
                  value={address.street}
                  onChange={(e) => update("street", e.target.value)}
                />
                {errors.street && <p className="error-text">{errors.street}</p>}
              </div>

              <div className="field">
                <label>City</label>
                <input
                  className="input"
                  value={address.city}
                  onChange={(e) => update("city", e.target.value)}
                />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>

              <div className="field">
                <label>Postal code</label>
                <input
                  className="input"
                  value={address.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card checkout-section">
            <p className="checkout-section-title">Payment method</p>
            <label
              className={`payment-option ${paymentMethod === "safepay" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "safepay"}
                onChange={() => setPaymentMethod("safepay")}
              />
              Pay securely with Safepay
              <i className="ti ti-lock" aria-hidden="true"></i>
            </label>
            <label
              className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on delivery
              <i className="ti ti-cash" aria-hidden="true"></i>
            </label>
          </div>
        </div>

        <div className="card checkout-summary">
          <p className="checkout-section-title">Order review</p>
          {items.map((item) => (
            <div className="checkout-review-row" key={item.key}>
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="checkout-review-row checkout-delivery-row">
            <span>Delivery</span>
            <span>{delivery === 0 ? "Free" : `$${delivery}`}</span>
          </div>

          <div className="checkout-review-row checkout-total-row">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handlePay}
            disabled={processing}
          >
            <i className="ti ti-lock" aria-hidden="true"></i>
            {processing ? "Processing..." : `Pay $${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
