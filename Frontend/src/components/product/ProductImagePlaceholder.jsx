import { useProducts } from "../../context/ProductsContext.jsx";
import "./ProductImagePlaceholder.css";

export default function ProductImagePlaceholder({
  categorySlug,
  size = "large",
}) {
  const { categories } = useProducts();
  const category = categories.find((c) => c.slug === categorySlug);
  const icon = category?.icon || "ti-photo";

  return (
    <div className={`img-placeholder img-placeholder-${size}`}>
      <div className="img-placeholder-blob">
        <i className={`ti ${icon}`} aria-hidden="true"></i>
      </div>
    </div>
  );
}
