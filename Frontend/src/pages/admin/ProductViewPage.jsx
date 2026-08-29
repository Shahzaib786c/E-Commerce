import { useParams, Link, Navigate } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import ProductImagePlaceholder from "../../components/product/ProductImagePlaceholder.jsx";

export default function ProductViewPage() {
  const { id } = useParams();
  const { products, categories } = useProducts();
  const product = products.find((p) => p.id === id);

  if (!product) return <Navigate to="/admin/products" replace />;

  const category = categories.find((c) => c.slug === product.category);

  return (
    <div>
      <AdminPageHeader title="Product details" />
      <div className="card" style={{ padding: "var(--sp-5)", display: "grid", gridTemplateColumns: "160px 1fr", gap: "var(--sp-5)" }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: 160, height: 160, borderRadius: "var(--radius-md)", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: 160, height: 160, borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <ProductImagePlaceholder categorySlug={product.category} />
          </div>
        )}
        <div>
          <h2 style={{ marginBottom: 6 }}>{product.name}</h2>
          <p style={{ color: "var(--color-plum-soft)", marginBottom: "var(--sp-3)" }}>
            {category?.name} · ${product.price.toLocaleString()} · Stock: {product.stock}
          </p>
          <p style={{ color: "var(--color-plum-soft)", marginBottom: "var(--sp-3)" }}>{product.description}</p>
          {product.variants.length > 0 && (
            <p style={{ fontSize: "var(--fs-sm)", marginBottom: "var(--sp-3)" }}>
              Variants: {product.variants.join(", ")}
            </p>
          )}
          <Link to={`/admin/products/${id}/edit`} className="btn btn-primary btn-sm">
            Edit product
          </Link>
        </div>
      </div>
    </div>
  );
}
