import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }
    try {
      signup({ name, email, password });
      navigate("/dashboard", { replace: true });
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
        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">Save stays, track bookings, and pick up where you left off.</p>

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>
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
              placeholder="At least 4 characters"
              required
            />
          </label>

          {error && <p className="auth-card__error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--block">
            Create account
          </button>
        </form>

        <div className="auth-card__divider"><span>or</span></div>

        <button className="btn btn--outline btn--block" onClick={handleGuest}>
          Continue as guest
        </button>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
