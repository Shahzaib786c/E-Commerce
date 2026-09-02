import { Link } from "react-router";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getImageUrl } from "../../api/imageUrl.js";
import ProductImagePlaceholder from "./ProductImagePlaceholder.jsx";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product._id);

  function handleAddToCart(e) {
    e.preventDefault();
    addItem(product, 1, product.variants?.[0] || null);
    showToast("Added to cart");
  }

  function handleWishlist(e) {
    e.preventDefault();
    toggle(product._id);
  }

  const lowStock = product.stock > 0 && product.stock <= 3;
  const outOfStock = product.stock === 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className={`product-card ${outOfStock ? "is-out" : ""}`}
    >
      <div className="product-card-image">
        {product.images?.[0] ? (
          <img src={getImageUrl(product.images[0])} alt={product.name} />
        ) : (
          <ProductImagePlaceholder categorySlug={product.category?.slug} />
        )}
        <button
          className={`wishlist-btn ${wishlisted ? "is-active" : ""}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? (
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
          )}
        </button>
        {product.isNewArrival && (
          <span className="badge badge-new product-card-badge">New</span>
        )}
        {lowStock && (
          <span className="badge badge-low product-card-badge">
            Only {product.stock} left
          </span>
        )}
        {outOfStock && (
          <span className="badge badge-out product-card-badge">
            Out of stock
          </span>
        )}
      </div>
      <div className="product-card-body">
        <p className="product-card-name">{product.name}</p>
        <div className="product-card-rating">
          <i className="ti ti-star" aria-hidden="true"></i>
          <span>{product.rating}</span>
        </div>
        <p className="product-card-price">${product.price.toLocaleString()}</p>
        <button
          className="btn btn-primary btn-sm btn-block"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </Link>
  );
}
