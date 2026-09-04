import { useEffect } from "react";
import { Link } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getImageUrl } from "../../api/imageUrl.js";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import ProductImagePlaceholder from "../../components/product/ProductImagePlaceholder.jsx";

export default function ProductsListPage() {
  const {
    adminProducts,
    deleteProduct,
    fetchAllProductsAdmin,
    updateProductStatus,
  } = useProducts();
  const { showToast } = useToast();

  useEffect(() => {
    fetchAllProductsAdmin();
  }, []);

  function handleDelete(p) {
    if (window.confirm(`Delete "${p.name}"? This can't be undone.`)) {
      deleteProduct(p._id);
      showToast("Product deleted");
    }
  }
  async function handleStatusChange(row, isActive) {
    try {
      await updateProductStatus(row._id, isActive);
      showToast(`${row.name} ${isActive ? "activated" : "deactivated"}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status");
    }
  }

  const columns = [
    {
      key: "image",
      label: "",
      render: (row) =>
        row.images?.[0] ? (
          <img
            src={getImageUrl(row.images[0])}
            alt=""
            className="data-table-thumb"
          />
        ) : (
          <div className="data-table-thumb">
            <ProductImagePlaceholder
              categorySlug={row.category?.slug}
              size="thumb"
            />
          </div>
        ),
    },
    { key: "name", label: "Name" },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <>
          {row.category?.categoryName || "—"}
          {row.category?.isActive === false && (
            <span className="badge badge-out" style={{ marginLeft: 6 }}>
              Hidden
            </span>
          )}
        </>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => `$${row.price.toLocaleString()}`,
    },
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
          <Link to={`/admin/products/${row._id}`} aria-label="View">
            <i className="ti ti-eye" aria-hidden="true"></i>
          </Link>
          <Link to={`/admin/products/${row._id}/edit`} aria-label="Edit">
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
        title="Products"
        addLink="/admin/products/add"
        addLabel="Add product"
      />
      <DataTable columns={columns} rows={adminProducts} rowKey="_id" />
    </div>
  );
}
