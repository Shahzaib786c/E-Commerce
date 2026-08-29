import { useProducts } from "../../context/ProductsContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import "./DashboardPage.css";

const STATUS_CLASS = {
  Pending: "status-pending",
  Shipped: "status-shipped",
  Delivered: "status-delivered",
  Cancelled: "status-cancelled",
};

export default function DashboardPage() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { customers } = useAuth();

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const recent = orders.slice(0, 5);

  const columns = [
    { key: "id", label: "Order" },
    {
      key: "customer",
      label: "Customer",
      render: (row) => customers.find((c) => c.id === row.userId)?.name || "Guest",
    },
    { key: "total", label: "Total", render: (row) => `$${row.total.toLocaleString()}` },
    {
      key: "status",
      label: "Status",
      render: (row) => <span className={`badge ${STATUS_CLASS[row.status]}`}>{row.status}</span>,
    },
  ];

  return (
    <div>
      <h1 className="admin-page-title" style={{ marginBottom: "var(--sp-4)" }}>
        Dashboard
      </h1>
      <div className="stat-grid">
        <div className="card stat-card">
          <p className="stat-label">Total orders</p>
          <p className="stat-value">{orders.length}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Products</p>
          <p className="stat-value">{products.length}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Customers</p>
          <p className="stat-value">{customers.length}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Revenue</p>
          <p className="stat-value">${revenue.toLocaleString()}</p>
        </div>
      </div>

      <p style={{ fontWeight: 700, marginBottom: "var(--sp-3)" }}>Recent orders</p>
      <DataTable columns={columns} rows={recent} />
    </div>
  );
}
