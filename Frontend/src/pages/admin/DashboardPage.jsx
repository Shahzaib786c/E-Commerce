import { useEffect } from "react";
import { Link } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import "./DashboardPage.css";

const STATUS_CLASS = {
  pending: "status-pending",
  confirmed: "status-pending",
  shipped: "status-shipped",
  delivered: "status-delivered",
  cancelled: "status-cancelled",
};

const LOW_STOCK_THRESHOLD = 5;

export default function DashboardPage() {
  const { adminProducts, fetchAllProductsAdmin } = useProducts();
  const { orders, fetchAllOrders } = useOrders();
  const { customers, fetchCustomers } = useAuth();

  useEffect(() => {
    fetchAllOrders();
    fetchCustomers();
    fetchAllProductsAdmin();
  }, [fetchAllOrders, fetchCustomers]);

  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0;
  const pendingCount = orders.filter((o) => o.orderStatus === "pending").length;
  const lowStockProducts = adminProducts.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD,
  );

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});
  const statusOrder = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const columns = [
    {
      key: "_id",
      label: "Order",
      render: (row) => (
        <Link to={`/admin/orders/${row._id}`}>
          #{row._id.slice(-6).toUpperCase()}
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => row.user?.name || "Guest",
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (row) => `$${row.totalAmount.toLocaleString()}`,
    },
    {
      key: "orderStatus",
      label: "Status",
      render: (row) => (
        <span className={`badge ${STATUS_CLASS[row.orderStatus]}`}>
          {row.orderStatus}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="admin-page-title" style={{ marginBottom: "var(--sp-4)" }}>
        Dashboard
      </h1>

      <div className="stat-grid">
        <div className="card stat-card">
          <p className="stat-label">Total revenue</p>
          <p className="stat-value">${revenue.toLocaleString()}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Total orders</p>
          <p className="stat-value">{orders.length}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Avg. order value</p>
          <p className="stat-value">${avgOrderValue.toFixed(2)}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Customers</p>
          <p className="stat-value">{customers.length}</p>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: "var(--sp-3)" }}>
        <div
          className={`card stat-card ${pendingCount > 0 ? "stat-card-alert" : ""}`}
        >
          <p className="stat-label">Pending orders</p>
          <p className="stat-value">{pendingCount}</p>
          {pendingCount > 0 && (
            <Link to="/admin/orders" style={{ fontSize: "var(--fs-xs)" }}>
              Review now →
            </Link>
          )}
        </div>
        <div
          className={`card stat-card ${lowStockProducts.length > 0 ? "stat-card-alert" : ""}`}
        >
          <p className="stat-label">Low stock products</p>
          <p className="stat-value">{lowStockProducts.length}</p>
          {lowStockProducts.length > 0 && (
            <ul
              style={{
                fontSize: "var(--fs-xs)",
                marginTop: 4,
                paddingLeft: 16,
                color: "var(--color-plum-soft)",
              }}
            >
              {lowStockProducts.map((p) => (
                <li key={p._id}>
                  {p.name} ({p.stock} left)
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className="card"
        style={{ padding: "var(--sp-4)", marginTop: "var(--sp-4)" }}
      >
        <p style={{ fontWeight: 700, marginBottom: "var(--sp-3)" }}>
          Orders by status
        </p>
        <div className="status-chart">
          {statusOrder.map((status) => {
            const count = statusCounts[status] || 0;
            const widthPct = (count / maxStatusCount) * 100;
            return (
              <div key={status} className="status-chart-row">
                <span className="status-chart-label">{status}</span>
                <div className="status-chart-track">
                  <div
                    className={`status-chart-bar ${STATUS_CLASS[status]}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <span className="status-chart-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontWeight: 700, margin: "var(--sp-4) 0 var(--sp-3)" }}>
        Recent orders
      </p>
      <DataTable columns={columns} rows={recent} rowKey="_id" />
    </div>
  );
}
