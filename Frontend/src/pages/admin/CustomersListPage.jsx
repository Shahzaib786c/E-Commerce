import { useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

export default function CustomersListPage() {
  const { customers, fetchCustomers } = useAuth();
  const { orders, fetchAllOrders } = useOrders();

  useEffect(() => {
    fetchCustomers();
    fetchAllOrders(); // needed to compute each customer's order count below
  }, [fetchCustomers, fetchAllOrders]);

  function orderCountFor(customerId) {
    return orders.filter((o) => o.user?._id === customerId).length;
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
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
          <Link
            to={`/admin/customers/${row._id}/edit`}
            aria-label="Manage role"
          >
            <i className="ti ti-pencil" aria-hidden="true"></i>
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
