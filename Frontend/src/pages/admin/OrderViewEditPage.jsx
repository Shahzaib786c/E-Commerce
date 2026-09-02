import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router";
import api from "../../api/axios.js";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_CLASS = {
  pending: "status-pending",
  confirmed: "status-pending",
  shipped: "status-shipped",
  delivered: "status-delivered",
  cancelled: "status-cancelled",
};

export default function OrderViewEditPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  async function handleStatusChange(status) {
    try {
      const res = await api.put(`/orders/${id}/status`, {
        orderStatus: status,
      });
      setOrder(res.data);
      showToast(`Order marked ${status}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update order");
    }
  }

  if (loading) return <p>Loading order...</p>;
  if (notFound || !order) return <Navigate to="/admin/orders" replace />;

  return (
    <div>
      <AdminPageHeader title={`Order #${order._id.slice(-6).toUpperCase()}`} />
      <div className="card" style={{ padding: "var(--sp-5)", maxWidth: 640 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--sp-4)",
          }}
        >
          <span className={`badge ${STATUS_CLASS[order.orderStatus]}`}>
            {order.orderStatus}
          </span>
          <select
            className="input status-select"
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>Customer</p>
        <p
          style={{
            color: "var(--color-plum-soft)",
            marginBottom: "var(--sp-3)",
          }}
        >
          {order.user?.name} · {order.user?.email}
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>Shipping address</p>
        <p
          style={{
            color: "var(--color-plum-soft)",
            marginBottom: "var(--sp-3)",
          }}
        >
          {order.shippingAddress?.fullName}, {order.shippingAddress?.street},{" "}
          {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>Items</p>
        {order.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "var(--fs-sm)",
              color: "var(--color-plum-soft)",
              marginBottom: 4,
            }}
          >
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}

        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            marginTop: "var(--sp-3)",
            paddingTop: "var(--sp-3)",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          <span>Total</span>
          <span>${order.totalAmount.toLocaleString()}</span>
        </div>
        <p
          style={{
            fontSize: "var(--fs-xs)",
            color: "var(--color-plum-soft)",
            marginTop: 4,
          }}
        >
          Payment: {order.paymentMethod}
        </p>
      </div>
    </div>
  );
}
