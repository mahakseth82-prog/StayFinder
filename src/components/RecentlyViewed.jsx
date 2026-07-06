import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";

export default function RecentlyViewed({ ids, hotels }) {
  const items = ids
    .map((id) => hotels.find((h) => h.id === id))
    .filter(Boolean)
    .slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className="recently-viewed">
      <h2 className="recently-viewed__title">Recently viewed</h2>
      <div className="recently-viewed__scroller">
        {items.map((hotel) => (
          <Link
            to={`/hotels/${hotel.id}`}
            key={hotel.id}
            className="recently-viewed__item"
          >
            <img src={hotel.thumbnail} alt={hotel.name} loading="lazy" />
            <div className="recently-viewed__item-body">
              <span className="recently-viewed__item-name">{hotel.name}</span>
              <span className="recently-viewed__item-price">{formatPrice(hotel.price)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
