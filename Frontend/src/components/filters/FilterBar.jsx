import "./FilterBar.css";

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-search">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input
            type="text"
            className="input"
            placeholder="Search teddy bears, gift hampers..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select className="input filter-sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="newest">Sort: newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="popular">Most popular</option>
        </select>
      </div>

      <div className="filter-pills">
        <button
          className={`pill ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => onCategoryChange("all")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`pill ${activeCategory === c.slug ? "active" : ""}`}
            onClick={() => onCategoryChange(c.slug)}
          >
            <i className={`ti ${c.icon}`} aria-hidden="true"></i>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
