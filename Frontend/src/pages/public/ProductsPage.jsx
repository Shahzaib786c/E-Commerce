import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import FilterBar from "../../components/filters/FilterBar.jsx";
import PromoBanner from "../../components/common/PromoBanner.jsx";
import "./ProductsPage.css";
import product from "./product.mp4";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const activeCategory = searchParams.get("category") || "all";

  function setActiveCategory(slug) {
    setPage(1);
    if (slug === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  }

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));
    }
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "popular") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, activeCategory, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <p className="results-count">{filtered.length} products found</p>

      {pageItems.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-mood-sad" aria-hidden="true"></i>
          <p>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {pageItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

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
    </div>
  );
}
