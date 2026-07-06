import { useEffect, useRef, useState } from "react";
import { formatPrice } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../hooks/useBookings";

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function BookingModal({ hotel, onClose }) {
  const [checkIn, setCheckIn] = useState(todayPlus(1));
  const [checkOut, setCheckOut] = useState(todayPlus(2));
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const { addBooking } = useBookings();
  const nameInputRef = useRef(null);
  const modalRef = useRef(null);

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );
  const total = nights * hotel.price;

  // Lock body scroll, focus the first field, and let Escape close the modal.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameInputRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          "input, button, select, textarea, [tabindex]"
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      location: hotel.location,
      checkIn,
      checkOut,
      guests,
      total,
      userEmail: currentUser?.email || "guest",
      guestName: name.trim(),
    });
    setConfirmed(true);
    showToast(`Booking confirmed at ${hotel.name}`, "success");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {confirmed ? (
          <div className="modal__confirmation">
            <div className="modal__confirmation-stamp">✓</div>
            <h3>Booking confirmed</h3>
            <p>
              {name}, your stay at <strong>{hotel.name}</strong> is booked for{" "}
              {nights} {nights === 1 ? "night" : "nights"} ({checkIn} → {checkOut}),
              {" "}{guests} {guests === 1 ? "guest" : "guests"}.
            </p>
            <p className="modal__confirmation-total">{formatPrice(total)} total</p>
            <button className="btn btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="modal__title" id="booking-modal-title">
              Reserve {hotel.name}
            </h3>
            <p className="modal__subtitle">{hotel.location} · {formatPrice(hotel.price)} / night</p>

            <form className="modal__form" onSubmit={handleSubmit}>
              <label>
                <span>Full name</span>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <div className="modal__form-row">
                <label>
                  <span>Check-in</span>
                  <input
                    type="date"
                    value={checkIn}
                    min={todayPlus(0)}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Check-out</span>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label>
                <span>Guests</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </label>

              <div className="modal__total">
                <span>{nights} {nights === 1 ? "night" : "nights"}</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button type="submit" className="btn btn--primary btn--block">
                Confirm booking
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
