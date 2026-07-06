export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ratingLabel(rating) {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4) return "Excellent";
  if (rating >= 3.5) return "Very good";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Fair";
  return "Basic";
}

// A small fixed palette keyed off the city name, used for the
// destination chips. Cycling through a set of accent hues keeps
// cities visually distinct without needing per-city design work.
const CITY_HUES = [214, 340, 28, 165, 265, 195, 12, 100];

export function cityHue(city) {
  let hash = 0;
  for (let i = 0; i < city.length; i += 1) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CITY_HUES[Math.abs(hash) % CITY_HUES.length];
}
