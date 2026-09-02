import { useEffect } from "react";
import { Link } from "react-router";
import { useOrders } from "../../context/OrderContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersListPage() {
  const { orders, fetchAllOrders, updateOrderStatus, loading } = useOrders();
  const { showToast } = useToast();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      showToast(`Order marked ${status}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update order");
    }
  }

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
    { key: "paymentMethod", label: "Payment" },
    {
      key: "orderStatus",
      label: "Status",
      render: (row) => (
        <select
          className="input status-select"
          value={row.orderStatus}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
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

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <AdminPageHeader title="Orders" />
      <DataTable columns={columns} rows={orders} rowKey="_id" />
    </div>
  );
}
