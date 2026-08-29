import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useProducts } from "../../context/ProductsContext.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";

export default function WishlistPage() {
  const { productIds } = useWishlist();
  const { products } = useProducts();
  const items = products.filter((p) => productIds.includes(p.id));

  return (
    <div className="container" style={{ padding: "var(--sp-5) 0 var(--sp-7)" }}>
      <h1 style={{ marginBottom: "var(--sp-4)" }}>My wishlist</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-heart" aria-hidden="true"></i>
          <p>Your wishlist is empty.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: "var(--sp-3)" }}>
            Browse products
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
