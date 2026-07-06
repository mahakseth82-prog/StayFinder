import { Link } from "react-router-dom";
import RatingStamp from "./RatingStamp";
import { formatPrice } from "../utils/format";

export default function SimilarStays({ hotels, currentHotel }) {
  const similar = hotels
    .filter((h) => h.id !== currentHotel.id && h.location === currentHotel.location)
    .sort((a, b) => Math.abs(a.price - currentHotel.price) - Math.abs(b.price - currentHotel.price))
    .slice(0, 4);

  if (similar.length === 0) return null;

  return (
    <section className="similar-stays">
      <h2 className="similar-stays__title">Other stays in {currentHotel.location}</h2>
      <div className="similar-stays__grid">
        {similar.map((hotel) => (
          <Link to={`/hotels/${hotel.id}`} key={hotel.id} className="similar-stays__card">
            <div className="similar-stays__media">
              <img src={hotel.thumbnail} alt={hotel.name} loading="lazy" />
              <RatingStamp rating={hotel.rating} />
            </div>
            <div className="similar-stays__body">
              <span className="similar-stays__name">{hotel.name}</span>
              <span className="similar-stays__price">{formatPrice(hotel.price)} / night</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
