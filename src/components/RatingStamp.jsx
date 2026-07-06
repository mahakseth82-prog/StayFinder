import { ratingLabel } from "../utils/format";

/**
 * The "welcome stamp" — a circular badge referencing the ceremonial
 * seals used on Indian invitations and welcome cards. It carries the
 * hotel's rating and sits proud of the photo corner.
 */
export default function RatingStamp({ rating, size = "md" }) {
  return (
    <div className={`rating-stamp rating-stamp--${size}`} title={ratingLabel(rating)}>
      <span className="rating-stamp__value">{rating.toFixed(1)}</span>
      <span className="rating-stamp__label">{ratingLabel(rating)}</span>
    </div>
  );
}
