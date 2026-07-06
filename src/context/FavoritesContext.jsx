import { createContext, useContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useLocalStorageState("StayFinder:favorites", []);

  const toggleFavorite = (id) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  };

  const isFavorite = (id) => favoriteIds.includes(id);

  const value = { favoriteIds, toggleFavorite, isFavorite };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
