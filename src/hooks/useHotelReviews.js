import { useLocalStorageState } from "./useLocalStorageState";

export function useHotelReviews(hotelId) {
  const [allReviews, setAllReviews] = useLocalStorageState("StayFinder:reviews", {});
  const reviews = allReviews[hotelId] || [];

  function addReview(review) {
    const record = {
      id: `rv_${Date.now()}`,
      date: new Date().toISOString(),
      ...review,
    };
    setAllReviews((current) => ({
      ...current,
      [hotelId]: [record, ...(current[hotelId] || [])],
    }));
  }

  return { reviews, addReview };
}
