import { useEffect } from "react";
import { Link } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

export default function CategoriesListPage() {
  const {
    adminCategories,
    adminProducts,
    deleteCategory,
    updateCategoryStatus,
    fetchAllCategoriesAdmin,
    fetchAllProductsAdmin,
  } = useProducts();
  const { showToast } = useToast();

  useEffect(() => {
    fetchAllCategoriesAdmin();
    fetchAllProductsAdmin();
  }, []);

  function handleDelete(cat) {
    if (window.confirm(`Delete "${cat.categoryName}"? This can't be undone.`)) {
      deleteCategory(cat._id);
      showToast("Category deleted");
    }
  }

  async function handleStatusChange(cat, isActive) {
    try {
      await updateCategoryStatus(cat._id, isActive);
      showToast(
        `${cat.categoryName} ${isActive ? "activated" : "deactivated"}`,
      );
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status");
    }
  }

  const columns = [
    {
      key: "icon",
      label: "",
      render: (row) => (
        <i
          className={`ti ${row.icon}`}
          style={{ fontSize: 18, color: "var(--color-rose)" }}
          aria-hidden="true"
        ></i>
      ),
    },
    { key: "categoryName", label: "Name" },
    { key: "slug", label: "Slug" },
    {
      key: "count",
      label: "Products",
      render: (row) =>
        adminProducts.filter((p) => p.category?._id === row._id).length,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          className="input status-select"
          value={row.isActive ? "active" : "inactive"}
          onChange={(e) => handleStatusChange(row, e.target.value === "active")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="data-table-actions">
          <Link to={`/admin/categories/${row._id}/edit`} aria-label="Edit">
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
      <AdminPageHeader
        title="Categories"
        addLink="/admin/categories/add"
        addLabel="Add category"
      />
      <DataTable columns={columns} rows={adminCategories} rowKey="_id" />
    </div>
  );
}
