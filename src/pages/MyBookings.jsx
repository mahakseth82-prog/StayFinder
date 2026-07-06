import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../hooks/useBookings";
import { formatPrice } from "../utils/format";

export default function MyBookings() {
  const { currentUser } = useAuth();
  const { bookings } = useBookings();

  const mine = bookings.filter((b) => b.userEmail === currentUser?.email);

  return (
    <main className="page-container bookings-page">
      <div className="section-heading">
        <p className="section-heading__eyebrow">Your trips</p>
        <h1 className="section-heading__title">My bookings</h1>
      </div>

      {mine.length === 0 ? (
        <div className="state-banner">
          <p>You haven't booked a stay yet.</p>
          <Link to="/dashboard" className="btn btn--primary">Browse hotels</Link>
        </div>
      ) : (
        <ul className="bookings-list">
          {mine.map((b) => (
            <li className="bookings-list__item" key={b.id}>
              <div>
                <p className="bookings-list__hotel">{b.hotelName}</p>
                <p className="bookings-list__meta">
                  {b.location} · {b.checkIn} → {b.checkOut} · {b.guests} guest{b.guests === 1 ? "" : "s"}
                </p>
              </div>
              <div className="bookings-list__right">
                <span className="bookings-list__total">{formatPrice(b.total)}</span>
                <Link to={`/hotels/${b.hotelId}`} className="bookings-list__link">View hotel →</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
