import { useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

export default function CustomersListPage() {
  const {
    customers,
    fetchCustomers,
    updateCustomerRole,
    updateCustomerStatus,
    user: loggedInUser,
  } = useAuth();
  const { orders, fetchAllOrders } = useOrders();
  const { showToast } = useToast();

  useEffect(() => {
    fetchCustomers();
    fetchAllOrders();
  }, [fetchCustomers, fetchAllOrders]);

  function orderCountFor(customerId) {
    return orders.filter((o) => o.user?._id === customerId).length;
  }

  async function handleRoleChange(row, newRole) {
    try {
      await updateCustomerRole(row._id, newRole);
      showToast(
        `${row.name} is now ${newRole === "admin" ? "an admin" : "a customer"}`,
      );
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update role");
    }
  }

  async function handleStatusChange(row, isActive) {
    try {
      await updateCustomerStatus(row._id, isActive);
      showToast(`${row.name} ${isActive ? "activated" : "deactivated"}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => {
        const isSelf = row._id === loggedInUser?._id;
        return (
          <select
            className="input status-select"
            value={row.role}
            disabled={isSelf}
            title={isSelf ? "You cannot change your own role" : ""}
            onChange={(e) => handleRoleChange(row, e.target.value)}
          >
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const isSelf = row._id === loggedInUser?._id;
        return (
          <select
            className="input status-select"
            value={row.isActive ? "active" : "inactive"}
            disabled={isSelf}
            title={isSelf ? "You cannot deactivate your own account" : ""}
            onChange={(e) =>
              handleStatusChange(row, e.target.value === "active")
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        );
      },
    },
    { key: "orders", label: "Orders", render: (row) => orderCountFor(row._id) },
    {
      key: "createdAt",
      label: "Joined",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="data-table-actions">
          <Link to={`/admin/customers/${row._id}`} aria-label="View">
            <i className="ti ti-eye" aria-hidden="true"></i>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Customers" />
      <DataTable columns={columns} rows={customers} rowKey="_id" />
    </div>
  );
}
