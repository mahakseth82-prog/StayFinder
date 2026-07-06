import { Link } from "react-router-dom";
import RatingStamp from "./RatingStamp";
import FavoriteButton from "./FavoriteButton";
import { formatPrice, cityHue } from "../utils/format";

export default function HotelCard({ hotel, delayIndex = 0 }) {
  const hue = cityHue(hotel.location);

  return (
    <Link
      to={`/hotels/${hotel.id}`}
      className="hotel-card"
      style={{ "--stagger-delay": `${Math.min(delayIndex, 11) * 40}ms` }}
    >
      <div className="hotel-card__media">
        <img src={hotel.thumbnail} alt={hotel.name} loading="lazy" />
        <RatingStamp rating={hotel.rating} />
        <FavoriteButton hotel={hotel} className="hotel-card__favorite" />
        <span
          className="hotel-card__city-chip"
          style={{ "--chip-hue": hue }}
        >
          {hotel.location}
        </span>
      </div>
      <div className="hotel-card__body">
        <h3 className="hotel-card__name">{hotel.name}</h3>
        <p className="hotel-card__desc">{hotel.description}</p>
        <div className="hotel-card__footer">
          <span className="hotel-card__price">
            {formatPrice(hotel.price)}
            <small> / night</small>
          </span>
          <span className="hotel-card__cta">View stay →</span>
        </div>
      </div>
    </Link>
  );
}
