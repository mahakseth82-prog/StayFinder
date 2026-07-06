import { useState } from "react";

export default function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-input__star"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          {(hovered || value) >= star ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
