import { Link } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";

export default function CategoriesListPage() {
  const { categories, products, deleteCategory } = useProducts();
  const { showToast } = useToast();

  function handleDelete(cat) {
    if (window.confirm(`Delete "${cat.name}"? This can't be undone.`)) {
      deleteCategory(cat.id);
      showToast("Category deleted");
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
    {
      key: "name",
      label: "Name",
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "count",
      label: "Products",
      render: (row) => products.filter((p) => p.category === row.slug).length,
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="data-table-actions">
          <Link to={`/admin/categories/${row.id}/edit`} aria-label="Edit">
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
      <DataTable columns={columns} rows={categories} />
    </div>
  );
}
