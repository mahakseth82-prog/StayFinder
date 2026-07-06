import { useLocalStorageState } from "./useLocalStorageState";

/**
 * All bookings across all users live in one localStorage list, each
 * tagged with the booking user's email so views can filter to "mine".
 */
export function useBookings() {
  const [bookings, setBookings] = useLocalStorageState("StayFinder:bookings", []);

  function addBooking(booking) {
    const record = { id: `bk_${Date.now()}`, bookedAt: new Date().toISOString(), ...booking };
    setBookings((current) => [record, ...current]);
    return record;
  }

  return { bookings, addBooking };
}
