import { useCallback, useEffect, useState } from "react";
import { fetchHotels } from "../api/hotelApi";

/**
 * Loads every hotel once on mount and exposes loading/error state
 * alongside the data, so pages can render skeletons or error banners
 * without duplicating fetch logic. Exposes `refetch` for retry buttons.
 */
export function useHotels() {
  const [hotels, setHotels] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        const data = await fetchHotels();
        if (!cancelled) {
          setHotels(data);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong");
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return { hotels, status, error, refetch };
}
