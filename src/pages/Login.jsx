import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    try {
      login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  function handleGuest() {
    loginAsGuest();
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Log in to pick up where you left off.</p>

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <p className="auth-card__error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--block">
            Log in
          </button>
        </form>

        <div className="auth-card__divider"><span>or</span></div>

        <button className="btn btn--outline btn--block" onClick={handleGuest}>
          Continue as guest
        </button>

        <p className="auth-card__switch">
          New to StayFinder? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
