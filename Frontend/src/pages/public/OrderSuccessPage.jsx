import { Link, useLocation, Navigate } from "react-router";

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div
      className="container"
      style={{
        padding: "var(--sp-8) 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--color-sage-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--sp-4)",
          }}
        >
          <i
            className="ti ti-check"
            style={{ fontSize: 30, color: "var(--color-sage)" }}
            aria-hidden="true"
          ></i>
        </div>
        <h1 style={{ marginBottom: "var(--sp-2)" }}>Order placed</h1>
        <p
          style={{
            color: "var(--color-plum-soft)",
            marginBottom: "var(--sp-2)",
          }}
        >
          Thanks for your order, it's on its way to being prepared with care.
        </p>
        <p
          style={{
            fontSize: "var(--fs-sm)",
            color: "var(--color-plum-soft)",
            marginBottom: "var(--sp-5)",
          }}
        >
          Order #{order._id.slice(-6).toUpperCase()} · $
          {order.totalAmount.toLocaleString()} · {order.paymentMethod}
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--sp-2)",
            justifyContent: "center",
          }}
        >
          <Link to="/my-orders" className="btn btn-secondary">
            View my orders
          </Link>
          <Link to="/products" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
