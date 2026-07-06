import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    title: "Real listings, real-time",
    desc: "Every hotel on StayFinder is pulled live from our catalog — 500 stays across 12 Indian cities, always current.",
  },
  {
    title: "Search that keeps up",
    desc: "Filter by city, price, and rating, or just type — results update instantly as you narrow things down.",
  },
  {
    title: "Save stays for later",
    desc: "Heart any hotel to add it to your saved list, and pick up exactly where you left off next time.",
  },
  {
    title: "Book in seconds",
    desc: "Pick your dates and guests, confirm, done. Your booking history is always one click away.",
  },
];

const STEPS = [
  { step: "01", title: "Create an account", desc: "Sign up in seconds, or continue as a guest to browse right away." },
  { step: "02", title: "Find your stay", desc: "Search and filter across 500 hotels until you find the one that fits." },
  { step: "03", title: "Reserve & relax", desc: "Confirm your dates, get instant confirmation, and you're set." },
];

const TESTIMONIALS = [
  {
    name: "Ananya Rao",
    city: "Bengaluru",
    quote: "Found a beautiful courtyard stay in Jaipur in under five minutes. The filters actually work the way you'd want them to.",
  },
  {
    name: "Vikram Shah",
    city: "Mumbai",
    quote: "I liked being able to save a shortlist and come back to it later instead of losing track of tabs.",
  },
  {
    name: "Priya Menon",
    city: "Chennai",
    quote: "Booking took less time than ordering food. Clean, fast, no clutter.",
  },
];

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">500 stays · 12 cities across India</p>
          <h1 className="hero__title">
            Find a stay that feels <em>like a good story</em>.
          </h1>
          <p className="hero__subtitle">
            From Jodhpur-blue courtyards to Jaipur-pink terraces — search,
            filter, save, and book real hotel listings in a few clicks.
          </p>
          <div className="hero__ctas">
            {currentUser ? (
              <Link to="/dashboard" className="btn btn--primary btn--lg">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn--primary btn--lg">
                  Get started free
                </Link>
                <Link to="/login" className="btn btn--outline btn--lg">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="page-container landing__section">
        <div className="section-heading">
          <p className="section-heading__eyebrow">Why StayFinder</p>
          <h2 className="section-heading__title">Everything you need, nothing you don't</h2>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing__steps-section">
        <div className="page-container">
          <div className="section-heading">
            <p className="section-heading__eyebrow">How it works</p>
            <h2 className="section-heading__title">Three steps to your next stay</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step-card" key={s.step}>
                <span className="step-card__number">{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container landing__section">
        <div className="section-heading">
          <p className="section-heading__eyebrow">Guests say</p>
          <h2 className="section-heading__title">Trusted by travelers across India</h2>
        </div>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <figure className="testimonial-card" key={t.name}>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <span className="testimonial-card__avatar">{t.name.charAt(0)}</span>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__city">{t.city}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="landing__cta">
        <div className="page-container landing__cta-inner">
          <h2>Ready to find your next stay?</h2>
          <p>Join StayFinder and start browsing real hotels across India today.</p>
          {currentUser ? (
            <Link to="/dashboard" className="btn btn--primary btn--lg">Go to dashboard</Link>
          ) : (
            <Link to="/signup" className="btn btn--primary btn--lg">Create free account</Link>
          )}
        </div>
      </section>
    </div>
  );
}
