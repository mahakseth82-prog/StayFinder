import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { favoriteIds } = useFavorites();
  const { currentUser, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to={currentUser ? "/dashboard" : "/"} className="navbar__brand">
          <span className="navbar__brand-mark">◆</span>
          StayFinder
        </Link>
        <nav className="navbar__links">
          {currentUser ? (
            <>
              <Link className="navbar__ghost-btn" to="/dashboard?saved=1#hotels">
                Saved{favoriteIds.length > 0 ? ` (${favoriteIds.length})` : ""}
              </Link>
              <Link className="navbar__ghost-btn" to="/bookings">
                My bookings
              </Link>
              <button className="navbar__ghost-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="navbar__ghost-btn" to="/login">Log in</Link>
              <Link className="navbar__ghost-btn navbar__ghost-btn--solid" to="/signup">Sign up</Link>
            </>
          )}
          <button
            className="navbar__icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </nav>
      </div>
    </header>
  );
}
