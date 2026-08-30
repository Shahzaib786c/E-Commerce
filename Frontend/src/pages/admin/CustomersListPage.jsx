import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

export default function CustomersListPage() {
  const { customers, deleteCustomer } = useAuth();
  const { getOrdersForUser } = useOrders();
  const { showToast } = useToast();

  function handleDelete(c) {
    if (window.confirm(`Delete "${c.name}"? This can't be undone.`)) {
      deleteCustomer(c.id);
      showToast("Customer deleted");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "orders", label: "Orders", render: (row) => getOrdersForUser(row.id).length },
    { key: "joined", label: "Joined" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="data-table-actions">
          <Link to={`/admin/customers/${row.id}`} aria-label="View">
            <i className="ti ti-eye" aria-hidden="true"></i>
          </Link>
          <Link to={`/admin/customers/${row.id}/edit`} aria-label="Edit">
            <i className="ti ti-pencil" aria-hidden="true"></i>
          </Link>
          <button onClick={() => handleDelete(row)} aria-label="Delete">
            <i className="ti ti-trash" aria-hidden="true"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Customers" addLink="/admin/customers/add" addLabel="Add customer" />
      <DataTable columns={columns} rows={customers} />
    </div>
  );
}
