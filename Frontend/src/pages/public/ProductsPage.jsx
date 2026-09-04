import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import api from "../../api/axios.js";
import ProductCard from "../../components/product/ProductCard.jsx";
import FilterBar from "../../components/filters/FilterBar.jsx";
import PromoBanner from "../../components/common/PromoBanner.jsx";
import "./ProductsPage.css";
import product from "./product.mp4";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const { categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // isInitialLoading = the very first load (nothing to show yet, so a text/skeleton state is fine)
  // isFetching = any load AFTER the first (previous results stay visible, just dimmed)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const hasLoadedOnce = useRef(false);

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function setActiveCategory(slug) {
    setPage(1);
    if (slug === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsFetching(true);
        setError(null);
        const params = { page, limit: PAGE_SIZE, sort: sortBy };
        if (activeCategory !== "all") params.category = activeCategory;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

        const res = await api.get("/products", { params });
        setProducts(res.data.products);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages || 1);
        hasLoadedOnce.current = true;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setIsFetching(false);
        setIsInitialLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, debouncedSearch, sortBy, page]);

  return (
    <div className="container products-page">
      <PromoBanner
        title="Made just for them"
        subtitle="Add a name, a note, or a keepsake touch — personalized gifts, from $14"
        videoSrc={product}
        tone="sage"
        ctaLabel="Shop now"
      />

      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={searchInput}
        onSearchChange={setSearchInput}
        sortBy={sortBy}
        onSortChange={(v) => {
          setSortBy(v);
          setPage(1);
        }}
      />

      {isInitialLoading ? (
        <p className="results-count">Loading products...</p>
      ) : error ? (
        <p className="results-count">Something went wrong: {error}</p>
      ) : (
        <>
          <p className="results-count">{totalCount} products found</p>

          {/* This wrapper never unmounts between fetches — only its opacity changes.
              That's what removes the jump-cut/flash: the grid stays in place and
              fades, instead of disappearing and being replaced. */}
          <div
            className={`products-fade-wrap ${isFetching ? "is-fetching" : ""}`}
          >
            {products.length === 0 ? (
              <div className="empty-state">
                <i className="ti ti-mood-sad" aria-hidden="true"></i>
                <p>No products found. Try a different search or category.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <i className="ti ti-chevron-left" aria-hidden="true"></i>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`btn btn-sm ${n === page ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <i className="ti ti-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
