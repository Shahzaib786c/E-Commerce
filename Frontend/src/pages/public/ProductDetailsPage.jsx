import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getImageUrl } from "../../api/imageUrl.js";
import ProductImagePlaceholder from "../../components/product/ProductImagePlaceholder.jsx";
import "./ProductDetailsPage.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { showToast } = useToast();

  const product = products.find((p) => p._id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);

  // Reset gallery/variant/quantity state whenever we land on a different
  // product. useState's initial value only runs on first mount, so without
  // this effect, navigating from one product's detail page straight to
  // another's (same route, different :id) would leave stale selections in
  // place — e.g. a variant that doesn't even exist on the new product.
  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setVariant(product.variants?.[0] || null);
      setQty(1);
    }
  }, [product?._id]);

  if (loading) return <div className="container details-page">Loading...</div>;
  if (!product) return <Navigate to="/products" replace />;

  const reviews = product.reviews || []; // backend has no reviews field yet — treat as empty
  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    addItem(product, qty, variant);
    showToast("Added to cart");
  }

  return (
    <div className="container details-page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> /{" "}
        <Link to={`/products?category=${product.category?.slug}`}>
          {product.category?.categoryName}
        </Link>{" "}
        / {product.name}
      </p>

      <div className="details-grid">
        <div>
          <div className="details-main-image">
            {product.images.length > 0 ? (
              <img
                src={getImageUrl(product.images[activeImage])}
                alt={product.name}
              />
            ) : (
              <ProductImagePlaceholder categorySlug={product.category?.slug} />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="details-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  className={`details-thumb ${i === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={getImageUrl(img)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="details-name">{product.name}</h1>
          <div className="details-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <i
                key={i}
                className={`ti ${i < Math.round(product.rating) ? "ti-star-filled" : "ti-star"}`}
                aria-hidden="true"
              ></i>
            ))}
            <span>
              {product.rating} ({reviews.length} reviews)
            </span>
          </div>
          <p className="details-price">${product.price.toLocaleString()}</p>
          <p className="details-desc">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="details-variants">
              <p className="details-label">Size</p>
              <div className="filter-pills">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    className={`pill ${variant === v ? "active" : ""}`}
                    onClick={() => setVariant(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="details-qty">
            <p className="details-label">Quantity</p>
            <div className="qty-stepper">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
              >
                -
              </button>
              <span>{qty}</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={outOfStock}
              >
                +
              </button>
              <span className={outOfStock ? "stock-out" : "stock-in"}>
                {outOfStock ? "Out of stock" : "In stock"}
              </span>
            </div>
          </div>

          <div className="details-actions">
            <button
              className="btn btn-primary details-add-btn"
              disabled={outOfStock}
              onClick={handleAddToCart}
            >
              {outOfStock ? "Sold out" : "Add to cart"}
            </button>
            <button
              className="btn btn-secondary details-wishlist-btn"
              onClick={() => toggle(product._id)}
            >
              <i
                className={`ti ${isWishlisted(product._id) ? "ti-heart-filled" : "ti-heart"}`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
      </div>

      <div className="details-reviews">
        <p className="details-reviews-title">Reviews ({reviews.length})</p>
        {reviews.length === 0 ? (
          <p className="details-no-reviews">No reviews yet for this product.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((r, i) => (
              <div key={i} className="review-card card">
                <div className="review-header">
                  <span>{r.name}</span>
                  <div>
                    {Array.from({ length: 5 }, (_, s) => (
                      <i
                        key={s}
                        className={`ti ${s < r.rating ? "ti-star-filled" : "ti-star"}`}
                        aria-hidden="true"
                      ></i>
                    ))}
                  </div>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
