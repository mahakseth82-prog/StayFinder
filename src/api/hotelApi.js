const BASE_URL = "https://demohotelsapi.pythonanywhere.com";

/**
 * Fetches the full hotel list from the Demo Hotels API.
 * The API returns everything in one shot (no pagination),
 * so we fetch once and let the UI filter/sort/paginate client-side.
 */
export async function fetchHotels() {
  const response = await fetch(`${BASE_URL}/hotels/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch hotels (status ${response.status})`);
  }

  const payload = await response.json();

  if (payload.status !== 200 || !Array.isArray(payload.data)) {
    throw new Error(payload.message || "Unexpected response from hotels API");
  }

  // Normalize once here so the rest of the app never has to think
  // about string prices or missing fields again.
  return payload.data.map((hotel) => ({
    id: hotel.id,
    name: hotel.name,
    price: Number(hotel.price) || 0,
    rating: Number(hotel.rating) || 0,
    location: hotel.location || "Unknown",
    description: hotel.description || "",
    thumbnail: hotel.thumbnail,
    photos: Array.isArray(hotel.photos) ? hotel.photos : [],
  }));
}

export function getHotelById(hotels, id) {
  return hotels.find((hotel) => String(hotel.id) === String(id));
}
