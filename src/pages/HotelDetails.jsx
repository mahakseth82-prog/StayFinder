import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useHotels } from "../hooks/useHotels";
import { getHotelById } from "../api/hotelApi";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import PhotoGallery from "../components/PhotoGallery";
import RatingStamp from "../components/RatingStamp";
import FavoriteButton from "../components/FavoriteButton";
import BookingModal from "../components/BookingModal";
import SimilarStays from "../components/SimilarStays";
import HotelReviews from "../components/HotelReviews";
import { formatPrice } from "../utils/format";

const RECENT_LIMIT = 12;

export default function HotelDetails() {
  const { id } = useParams();
  const { hotels, status } = useHotels();
  const [showBooking, setShowBooking] = useState(false);
  const [, setRecentlyViewed] = useLocalStorageState("StayFinder:recently-viewed", []);

  const hotel = getHotelById(hotels, id);

  // Record this hotel as recently viewed, most-recent first, deduped, capped.
  useEffect(() => {
    if (!hotel) return;
    setRecentlyViewed((current) => {
      const withoutCurrent = current.filter((entryId) => entryId !== hotel.id);
      return [hotel.id, ...withoutCurrent].slice(0, RECENT_LIMIT);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel?.id]);

  if (status === "loading") {
    return (
      <main className="page-container">
        <p className="state-banner">Loading hotel…</p>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="page-container">
        <div className="state-banner">
          <p>We couldn't find that hotel.</p>
          <Link to="/" className="btn btn--primary">Back to all stays</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container details">
      <Link to="/" className="details__back">← Back to all stays</Link>

      <div className="details__layout">
        <div className="details__gallery">
          <PhotoGallery photos={hotel.photos} hotelName={hotel.name} />
        </div>

        <aside className="details__summary">
          <div className="details__summary-header">
            <div>
              <p className="details__location">{hotel.location}, India</p>
              <h1 className="details__name">{hotel.name}</h1>
            </div>
            <div className="details__summary-badges">
              <RatingStamp rating={hotel.rating} size="lg" />
              <FavoriteButton hotel={hotel} className="details__favorite" />
            </div>
          </div>

          <p className="details__description">{hotel.description}</p>

          <div className="details__price-box">
            <div>
              <span className="details__price">{formatPrice(hotel.price)}</span>
              <span className="details__price-suffix"> / night</span>
            </div>
            <button className="btn btn--primary" onClick={() => setShowBooking(true)}>
              Reserve now
            </button>
          </div>

          <ul className="details__amenities">
            <li>Free cancellation within 24 hours</li>
            <li>Complimentary breakfast for all guests</li>
            <li>24/7 front desk & concierge</li>
          </ul>
        </aside>
      </div>

      <HotelReviews hotelId={hotel.id} hotelName={hotel.name} />

      <SimilarStays hotels={hotels} currentHotel={hotel} />

      {showBooking && (
        <BookingModal hotel={hotel} onClose={() => setShowBooking(false)} />
      )}
    </main>
  );
}
