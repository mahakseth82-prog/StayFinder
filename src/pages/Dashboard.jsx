import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useHotels } from "../hooks/useHotels";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import FilterPanel from "../components/FilterPanel";
import HotelCard from "../components/HotelCard";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import RecentlyViewed from "../components/RecentlyViewed";

const PAGE_SIZE = 12;

const DEFAULTS = {
  q: "",
  city: "",
  maxPrice: "10000",
  minRating: "0",
  sort: "recommended",
  page: "1",
  saved: "",
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { hotels, status, error, refetch } = useHotels();
  const { favoriteIds } = useFavorites();
  const [recentlyViewed] = useLocalStorageState("StayFinder:recently-viewed", []);
  const [searchParams, setSearchParams] = useSearchParams();

  const [queryInput, setQueryInput] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebouncedValue(queryInput, 250);

  const filters = {
    query: searchParams.get("q") ?? DEFAULTS.q,
    city: searchParams.get("city") ?? DEFAULTS.city,
    maxPrice: Number(searchParams.get("maxPrice") ?? DEFAULTS.maxPrice),
    minRating: Number(searchParams.get("minRating") ?? DEFAULTS.minRating),
    sort: searchParams.get("sort") ?? DEFAULTS.sort,
    savedOnly: searchParams.get("saved") === "1",
  };
  const page = Number(searchParams.get("page") ?? DEFAULTS.page);

  useEffect(() => {
    if (debouncedQuery === (searchParams.get("q") ?? "")) return;
    updateParams({ q: debouncedQuery || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next, { replace: true });
  }

  const cities = useMemo(
    () => [...new Set(hotels.map((h) => h.location))].sort(),
    [hotels]
  );

  const filtered = useMemo(() => {
    let list = hotels.filter((hotel) => {
      const matchesQuery =
        filters.query.trim() === "" ||
        hotel.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        hotel.location.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCity = filters.city === "" || hotel.location === filters.city;
      const matchesPrice = filters.maxPrice >= 10000 || hotel.price <= filters.maxPrice;
      const matchesRating = hotel.rating >= filters.minRating;
      const matchesSaved = !filters.savedOnly || favoriteIds.includes(hotel.id);
      return matchesQuery && matchesCity && matchesPrice && matchesRating && matchesSaved;
    });

    switch (filters.sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return list;
  }, [hotels, filters.query, filters.city, filters.maxPrice, filters.minRating, filters.sort, filters.savedOnly, favoriteIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleFilterChange(next) {
    updateParams({
      city: next.city || null,
      maxPrice: next.maxPrice === 10000 ? null : next.maxPrice,
      minRating: next.minRating === 0 ? null : next.minRating,
      sort: next.sort === "recommended" ? null : next.sort,
      saved: next.savedOnly ? "1" : null,
      page: null,
    });
  }

  return (
    <>
      <section className="dashboard-header">
        <div className="dashboard-header__inner">
          <div>
            <p className="dashboard-header__eyebrow">Dashboard</p>
            <h1 className="dashboard-header__title">
              {currentUser?.isGuest ? "Welcome, guest" : `Welcome back, ${currentUser?.name?.split(" ")[0]}`}
            </h1>
          </div>
          <p className="dashboard-header__subtitle">
            500 stays across 12 cities are waiting — search, filter, and book below.
          </p>
        </div>
      </section>

      <main id="hotels" className="page-container page-container--overlap">
        {recentlyViewed.length > 0 && (
          <RecentlyViewed ids={recentlyViewed} hotels={hotels} />
        )}

        <FilterPanel
          cities={cities}
          filters={{ ...filters }}
          queryInput={queryInput}
          onQueryInputChange={setQueryInput}
          onChange={handleFilterChange}
          resultCount={filtered.length}
        />

        {status === "error" && (
          <div className="state-banner state-banner--error">
            <p>Couldn't load hotels: {error}</p>
            <button className="btn btn--primary" onClick={refetch}>
              Try again
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="hotel-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {status === "success" && filtered.length === 0 && (
          <div className="state-banner">
            <p>
              {filters.savedOnly
                ? "You haven't saved any stays yet. Tap the heart on a hotel to add it here."
                : "No stays match those filters. Try widening your search."}
            </p>
          </div>
        )}

        {status === "success" && filtered.length > 0 && (
          <>
            <div className="hotel-grid">
              {paged.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} delayIndex={i % PAGE_SIZE} />
              ))}
            </div>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={(p) => {
                updateParams({ page: p === 1 ? null : p });
                document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </>
        )}
      </main>
    </>
  );
}
