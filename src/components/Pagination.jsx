export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p += 1) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= page - windowSize && p <= page + windowSize)
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </nav>
  );
}
