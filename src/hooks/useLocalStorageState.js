import { useEffect, useState } from "react";

/**
 * Like useState, but persisted to localStorage under `key`.
 * Safe against SSR/private-browsing failures — falls back to
 * in-memory state if storage is unavailable.
 */
export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — fail silently, state still works in-memory.
    }
  }, [key, value]);

  return [value, setValue];
}
