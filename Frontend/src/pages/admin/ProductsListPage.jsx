import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import ProductImagePlaceholder from "../../components/product/ProductImagePlaceholder.jsx";

export default function ProductsListPage() {
  const { products, categories, deleteProduct } = useProducts();
  const { showToast } = useToast();

  function handleDelete(p) {
    if (window.confirm(`Delete "${p.name}"? This can't be undone.`)) {
      deleteProduct(p.id);
      showToast("Product deleted");
    }
  }

  const columns = [
    {
      key: "image",
      label: "",
      render: (row) =>
        row.images?.[0] ? (
          <img src={row.images[0]} alt="" className="data-table-thumb" />
        ) : (
          <div className="data-table-thumb">
            <ProductImagePlaceholder categorySlug={row.category} size="thumb" />
          </div>
        ),
    },
    { key: "name", label: "Name" },
    {
      key: "category",
      label: "Category",
      render: (row) => categories.find((c) => c.slug === row.category)?.name || row.category,
    },
    { key: "price", label: "Price", render: (row) => `$${row.price.toLocaleString()}` },
    {
      key: "stock",
      label: "Stock",
      render: (row) =>
        row.stock === 0 ? (
          <span className="badge badge-out">Out of stock</span>
        ) : (
          row.stock
        ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="data-table-actions">
          <Link to={`/admin/products/${row.id}`} aria-label="View">
            <i className="ti ti-eye" aria-hidden="true"></i>
          </Link>
          <Link to={`/admin/products/${row.id}/edit`} aria-label="Edit">
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
      <AdminPageHeader title="Products" addLink="/admin/products/add" addLabel="Add product" />
      <DataTable columns={columns} rows={products} />
    </div>
  );
}
