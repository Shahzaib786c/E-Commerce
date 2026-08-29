import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";

const STATUS_CLASS = {
  Pending: "status-pending",
  Shipped: "status-shipped",
  Delivered: "status-delivered",
  Cancelled: "status-cancelled",
};

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { getOrdersForUser } = useOrders();
  const orders = getOrdersForUser(user.id);

  return (
    <div className="container" style={{ padding: "var(--sp-5) 0 var(--sp-7)" }}>
      <h1 style={{ marginBottom: "var(--sp-4)" }}>My orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-package" aria-hidden="true"></i>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: "var(--sp-3)" }}>
            Start shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: "var(--sp-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-2)" }}>
                <span style={{ fontWeight: 700 }}>#{order.id}</span>
                <span className={`badge ${STATUS_CLASS[order.status]}`}>{order.status}</span>
              </div>
              <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)", marginBottom: "var(--sp-2)" }}>
                {new Date(order.createdAt).toLocaleDateString()} · {order.paymentMethod}
              </p>
              <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-plum-soft)" }}>
                {order.items.map((i) => i.name).join(", ")}
              </p>
              <p style={{ fontWeight: 700, marginTop: "var(--sp-2)" }}>${order.total.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
