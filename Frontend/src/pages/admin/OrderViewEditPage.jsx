import { useParams, Navigate } from "react-router";
import { useOrders } from "../../context/OrderContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];
const STATUS_CLASS = {
  Pending: "status-pending",
  Shipped: "status-shipped",
  Delivered: "status-delivered",
  Cancelled: "status-cancelled",
};

export default function OrderViewEditPage() {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useOrders();
  const { customers } = useAuth();
  const { showToast } = useToast();

  const order = orders.find((o) => o.id === id);
  if (!order) return <Navigate to="/admin/orders" replace />;

  const customer = customers.find((c) => c.id === order.userId);

  return (
    <div>
      <AdminPageHeader title={`Order #${order.id}`} />
      <div className="card" style={{ padding: "var(--sp-5)", maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
          <span className={`badge ${STATUS_CLASS[order.status]}`}>{order.status}</span>
          <select
            className="input status-select"
            value={order.status}
            onChange={(e) => {
              updateOrderStatus(order.id, e.target.value);
              showToast(`Order marked ${e.target.value}`);
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>Customer</p>
        <p style={{ color: "var(--color-plum-soft)", marginBottom: "var(--sp-3)" }}>
          {customer?.name} · {customer?.email} · {customer?.phone}
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>Shipping address</p>
        <p style={{ color: "var(--color-plum-soft)", marginBottom: "var(--sp-3)" }}>
          {order.address.fullName}, {order.address.street}, {order.address.city}{" "}
          {order.address.postalCode}
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>Items</p>
        {order.items.map((item) => (
          <div key={item.key} style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-sm)", color: "var(--color-plum-soft)", marginBottom: 4 }}>
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}

        <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "var(--sp-3)", paddingTop: "var(--sp-3)", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Total</span>
          <span>${order.total.toLocaleString()}</span>
        </div>
        <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)", marginTop: 4 }}>
          Payment: {order.paymentMethod}
        </p>
      </div>
    </div>
  );
}
