import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";

export default function FavoriteButton({ hotel, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const active = isFavorite(hotel.id);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(hotel.id);
    showToast(
      active ? `Removed ${hotel.name} from saved stays` : `Saved ${hotel.name}`,
      active ? "default" : "success"
    );
  }

  return (
    <button
      type="button"
      className={`favorite-btn ${active ? "favorite-btn--active" : ""} ${className}`}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remove from saved stays" : "Save this stay"}
      title={active ? "Remove from saved stays" : "Save this stay"}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.7 4.5 5 3.6c2-.5 4 .4 5 2 .1.1.2.1.3 0 1-1.6 3-2.5 5-2 3.3.9 4.6 4.4 3 7.6-2.5 4.7-10 9.3-10 9.3"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
