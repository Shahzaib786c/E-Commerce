import { Link } from "react-router-dom";
import { useOrders } from "../../context/OrderContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrdersListPage() {
  const { orders, updateOrderStatus } = useOrders();
  const { customers } = useAuth();
  const { showToast } = useToast();

  const columns = [
    {
      key: "id",
      label: "Order",
      render: (row) => <Link to={`/admin/orders/${row.id}`}>{row.id}</Link>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => customers.find((c) => c.id === row.userId)?.name || "Guest",
    },
    { key: "total", label: "Total", render: (row) => `$${row.total.toLocaleString()}` },
    { key: "paymentMethod", label: "Payment" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          className="input status-select"
          value={row.status}
          onChange={(e) => {
            updateOrderStatus(row.id, e.target.value);
            showToast(`Order ${row.id} marked ${e.target.value}`);
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Orders" />
      <DataTable columns={columns} rows={orders} />
    </div>
  );
}
