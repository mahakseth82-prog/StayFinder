import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHotelReviews } from "../hooks/useHotelReviews";
import { useToast } from "../context/ToastContext";
import StarRatingInput from "./StarRatingInput";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function HotelReviews({ hotelId, hotelName }) {
  const { currentUser } = useAuth();
  const { reviews, addReview } = useHotelReviews(hotelId);
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;
    addReview({
      author: currentUser?.name || "Guest",
      rating,
      comment: comment.trim(),
    });
    setRating(0);
    setComment("");
    showToast("Thanks for your review!", "success");
  }

  return (
    <section className="reviews">
      <div className="reviews__header">
        <h2 className="reviews__title">Guest reviews</h2>
        {average && (
          <span className="reviews__average">★ {average} · {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
        )}
      </div>

      <form className="reviews__form" onSubmit={handleSubmit}>
        <label className="reviews__form-label">
          <span>Your rating</span>
          <StarRatingInput value={rating} onChange={setRating} />
        </label>
        <textarea
          placeholder={`Share what you thought about ${hotelName}...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          required
        />
        <button type="submit" className="btn btn--primary" disabled={rating === 0 || !comment.trim()}>
          Post review
        </button>
      </form>

      {reviews.length === 0 ? (
        <p className="reviews__empty">No reviews yet — be the first to share your stay.</p>
      ) : (
        <ul className="reviews__list">
          {reviews.map((review) => (
            <li key={review.id} className="reviews__item">
              <div className="reviews__item-header">
                <span className="reviews__avatar">{review.author.charAt(0).toUpperCase()}</span>
                <div>
                  <p className="reviews__author">{review.author}</p>
                  <p className="reviews__date">{formatDate(review.date)}</p>
                </div>
                <span className="reviews__item-rating">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              </div>
              <p className="reviews__comment">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
