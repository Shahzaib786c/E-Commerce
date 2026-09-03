import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import api from "../../api/axios.js";

export default function CustomerViewPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, ordersRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get("/orders/admin/all"),
        ]);
        setCustomer(userRes.data);
        setOrders(ordersRes.data.filter((o) => o.user?._id === id));
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (notFound || !customer) return <Navigate to="/admin/customers" replace />;

  return (
    <div>
      <h1 style={{ marginBottom: "var(--sp-4)" }}>Customer details</h1>
      <div
        className="card"
        style={{
          padding: "var(--sp-5)",
          maxWidth: 480,
          marginBottom: "var(--sp-4)",
        }}
      >
        <h2 style={{ marginBottom: 4 }}>{customer.name}</h2>
        <p
          style={{
            color: "var(--color-plum-soft)",
            marginBottom: "var(--sp-3)",
          }}
        >
          {customer.email} · {customer.role}
        </p>

        <p
          style={{
            fontSize: "var(--fs-xs)",
            color: "var(--color-plum-soft)",
            marginBottom: "var(--sp-3)",
          }}
        >
          Joined {new Date(customer.createdAt).toLocaleDateString()}
        </p>

        <Link
          to={`/admin/customers/${id}/edit`}
          className="btn btn-primary btn-sm"
        >
          Manage role
        </Link>
      </div>

      <p style={{ fontWeight: 700, marginBottom: "var(--sp-2)" }}>
        Order history ({orders.length})
      </p>
      {orders.length === 0 ? (
        <p
          style={{ color: "var(--color-plum-soft)", fontSize: "var(--fs-sm)" }}
        >
          No orders yet.
        </p>
      ) : (
        orders.map((o) => (
          <div
            key={o._id}
            className="card"
            style={{
              padding: "var(--sp-3)",
              marginBottom: "var(--sp-2)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>#{o._id.slice(-6).toUpperCase()}</span>
            <span>${o.totalAmount.toLocaleString()}</span>
            <span>{o.orderStatus}</span>
          </div>
        ))
      )}
    </div>
  );
}
