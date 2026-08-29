import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

export default function CustomerViewPage() {
  const { id } = useParams();
  const { customers } = useAuth();
  const { getOrdersForUser } = useOrders();

  const customer = customers.find((c) => c.id === id);
  if (!customer) return <Navigate to="/admin/customers" replace />;

  const orders = getOrdersForUser(id);

  return (
    <div>
      <AdminPageHeader title="Customer details" />
      <div className="card" style={{ padding: "var(--sp-5)", maxWidth: 480, marginBottom: "var(--sp-4)" }}>
        <h2 style={{ marginBottom: 4 }}>{customer.name}</h2>
        <p style={{ color: "var(--color-plum-soft)", marginBottom: "var(--sp-3)" }}>
          {customer.email} · {customer.phone}
        </p>
        <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)", marginBottom: "var(--sp-3)" }}>
          Joined {customer.joined}
        </p>
        <Link to={`/admin/customers/${id}/edit`} className="btn btn-primary btn-sm">
          Edit customer
        </Link>
      </div>

      <p style={{ fontWeight: 700, marginBottom: "var(--sp-2)" }}>Order history ({orders.length})</p>
      {orders.length === 0 ? (
        <p style={{ color: "var(--color-plum-soft)", fontSize: "var(--fs-sm)" }}>No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="card" style={{ padding: "var(--sp-3)", marginBottom: "var(--sp-2)", display: "flex", justifyContent: "space-between" }}>
            <span>#{o.id}</span>
            <span>${o.total.toLocaleString()}</span>
            <span>{o.status}</span>
          </div>
        ))
      )}
    </div>
  );
}
