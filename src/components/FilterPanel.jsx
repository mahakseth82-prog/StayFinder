const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
];

export default function FilterPanel({
  cities,
  filters,
  queryInput,
  onQueryInputChange,
  onChange,
  resultCount,
}) {
  const update = (patch) => onChange({ ...filters, ...patch });

  const hasActiveFilters =
    filters.city !== "" ||
    filters.maxPrice < 10000 ||
    filters.minRating > 0 ||
    filters.sort !== "recommended" ||
    filters.savedOnly;

  function resetFilters() {
    onQueryInputChange("");
    onChange({
      query: "",
      city: "",
      maxPrice: 10000,
      minRating: 0,
      sort: "recommended",
      savedOnly: false,
    });
  }

  return (
    <div className="filter-panel">
      <div className="filter-panel__search">
        <span className="filter-panel__search-icon" aria-hidden="true">⌕</span>
        <input
          type="text"
          placeholder="Search by hotel name or city..."
          value={queryInput}
          onChange={(e) => onQueryInputChange(e.target.value)}
          aria-label="Search hotels"
        />
      </div>

      <div className="filter-panel__row">
        <div className="filter-panel__chips" role="group" aria-label="Filter by city">
          <button
            className={`chip ${filters.city === "" ? "chip--active" : ""}`}
            onClick={() => update({ city: "" })}
          >
            All cities
          </button>
          {cities.map((city) => (
            <button
              key={city}
              className={`chip ${filters.city === city ? "chip--active" : ""}`}
              onClick={() => update({ city: filters.city === city ? "" : city })}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel__row filter-panel__row--controls">
        <label className="filter-panel__field">
          <span>Max price / night</span>
          <input
            type="range"
            min="0"
            max="10000"
            step="250"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          />
          <span className="filter-panel__field-value">
            {filters.maxPrice >= 10000 ? "No limit" : `₹${filters.maxPrice.toLocaleString("en-IN")}`}
          </span>
        </label>

        <label className="filter-panel__field">
          <span>Minimum rating</span>
          <select
            value={filters.minRating}
            onChange={(e) => update({ minRating: Number(e.target.value) })}
          >
            <option value={0}>Any rating</option>
            <option value={3}>3.0+</option>
            <option value={3.5}>3.5+</option>
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </label>

        <label className="filter-panel__field">
          <span>Sort by</span>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-panel__footer">
        <label className="filter-panel__saved-toggle">
          <input
            type="checkbox"
            checked={filters.savedOnly}
            onChange={(e) => update({ savedOnly: e.target.checked })}
          />
          <span>Saved stays only</span>
        </label>

        <div className="filter-panel__footer-right">
          <p className="filter-panel__count" aria-live="polite">
            {resultCount} {resultCount === 1 ? "stay" : "stays"} found
          </p>
          {hasActiveFilters && (
            <button className="filter-panel__reset" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
