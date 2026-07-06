# StayFinder — Hotel Discovery & Booking

A multi-page React app for browsing, searching, filtering, reviewing, and
booking hotels across India, built on top of the **Demo Hotels API**
(`https://demohotelsapi.pythonanywhere.com/hotels/`).

> "StayFinder" — fitting for an app
> about finding where to stay.

## Pages

| Route | Page | Access |
|---|---|---|
| `/` | Landing page — hero, features, how-it-works, testimonials | Public |
| `/login` | Log in | Public |
| `/signup` | Create an account | Public |
| `/dashboard` | Main hotel search & listing dashboard | Requires login |
| `/hotels/:id` | Hotel details — gallery, booking, reviews, similar stays | Requires login |
| `/bookings` | Booking history for the signed-in user | Requires login |
| any other path | 404 page | Public |

Auth is intentionally lightweight (no real backend — see **Auth notes**
below), and there's a **"Continue as guest"** button on both auth pages so
you can explore the app immediately without creating an account.

## Features

**Landing page**
- Marketing hero, feature highlights, a 3-step "how it works" section, and
  a testimonials/reviews section from fictional guests.
- Smart CTAs: shows "Get started" / "Log in" for visitors, or "Go to
  dashboard" if you're already signed in.

**Auth**
- Sign up, log in, log out — validated forms with inline error messages.
- Guest mode — skip auth entirely and use the full app as "Guest".
- Protected routes — `/dashboard`, `/hotels/:id`, and `/bookings` redirect
  to `/login` if you're not signed in.

**Dashboard (main app)**
- Personalized greeting header ("Welcome back, {name}").
- Live data — all 500 hotels fetched from the real API, no mock data.
- Debounced search by hotel name or city.
- Filters — city (chips), max price (slider), min rating, and a
  "saved stays only" toggle.
- Sorting — recommended, price (low→high / high→low), rating.
- Shareable URLs — filters, sort, saved-only, and page number are all
  synced to the URL query string; back/forward buttons work as expected.
- Recently viewed strip, favorites/wishlist with toast confirmations,
  pagination, skeleton loading states, and a retry button on API failure.

**Hotel details page**
- Full photo gallery with a keyboard-navigable lightbox (arrow keys, Escape).
- Save/unsave, a "welcome stamp" rating badge, and a booking modal with
  date pickers, guest count, live total, a focus trap, and Escape-to-close.
- **Customer reviews** — read existing reviews and post your own (star
  rating + comment), stored per-hotel.
- "Similar stays in this city" recommendations.

**My bookings**
- Every confirmed booking for the signed-in user, with hotel, dates,
  guests, and total — an empty state points back to the dashboard if
  you haven't booked anything yet.

**Global**
- Dark mode toggle (persisted, respects system preference on first visit).
- Toast notification system.
- Back-to-top button, staggered card entrance animation, respects
  `prefers-reduced-motion`, visible keyboard focus states throughout.

## Tech stack

- React 19 + Vite
- React Router (`react-router-dom`) for client-side routing and protected routes
- Plain CSS (no framework) using CSS custom properties for the design system
- No backend — hotel data comes from the provided API; auth, favorites,
  reviews, and bookings are all persisted client-side in `localStorage`

## Auth notes (read this before treating it as production-ready)

There is no backend for this project, so accounts are simulated entirely
in the browser:

- `signup` stores `{ name, email, password }` in `localStorage` under
  `StayFinder:users` — **passwords are stored in plain text**, which is fine
  for a demo/assignment but must never be done in a real product.
- `login` checks the email/password against that list.
- The "current user" session is just an object in `localStorage`
  (`StayFinder:currentUser`) — there's no token, expiry, or server-side check.
- Clearing your browser's site data or using a different browser/device
  will not carry your account over.

If you want to turn this into something real, the natural next step is
swapping `AuthContext` (`src/context/AuthContext.jsx`) for calls to a real
auth API (or something like Firebase Auth / Auth0) — every component
already just calls `useAuth()`, so the swap is isolated to that one file.

## Project structure

```
hotel-booking-app/
├── index.html
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # App entry, provider tree, router setup
    ├── App.jsx                # Route definitions (public + protected)
    ├── index.css              # Design system + all component/page styles
    ├── api/
    │   └── hotelApi.js        # fetch + normalize hotel data from the API
    ├── hooks/
    │   ├── useHotels.js              # data-fetching hook (loading/error/data/refetch)
    │   ├── useLocalStorageState.js   # generic localStorage-synced state
    │   ├── useDebouncedValue.js      # debounce helper for the search input
    │   ├── useBookings.js            # booking history, persisted
    │   └── useHotelReviews.js        # per-hotel reviews, persisted
    ├── context/
    │   ├── AuthContext.jsx           # signup/login/logout/guest mode
    │   ├── ThemeContext.jsx          # light/dark mode, persisted + system-aware
    │   ├── FavoritesContext.jsx      # saved-stays wishlist, persisted
    │   └── ToastContext.jsx          # toast notification system
    ├── utils/
    │   └── format.js          # price formatting, rating labels, city colors
    ├── components/
    │   ├── Navbar.jsx           # auth-aware nav (login/signup vs saved/bookings/logout)
    │   ├── Footer.jsx
    │   ├── ProtectedRoute.jsx   # redirects to /login when signed out
    │   ├── FilterPanel.jsx      # search box, city chips, price/rating/sort, saved-only
    │   ├── HotelCard.jsx        # grid card with favorite button + entrance animation
    │   ├── FavoriteButton.jsx   # heart toggle, shared by card + details page
    │   ├── RatingStamp.jsx      # signature circular rating badge
    │   ├── StarRatingInput.jsx  # clickable star picker for review forms
    │   ├── HotelReviews.jsx     # review list + submission form
    │   ├── SkeletonCard.jsx     # loading placeholder
    │   ├── Pagination.jsx
    │   ├── PhotoGallery.jsx     # gallery + keyboard-navigable lightbox
    │   ├── SimilarStays.jsx     # "other stays in this city" recommendations
    │   ├── RecentlyViewed.jsx   # horizontal strip of recently opened hotels
    │   ├── BookingModal.jsx     # reservation form + confirmation + focus trap
    │   ├── ScrollToTop.jsx      # scrolls to top on route change
    │   └── BackToTop.jsx        # floating back-to-top button
    └── pages/
        ├── Landing.jsx          # public marketing homepage
        ├── Login.jsx
        ├── Signup.jsx
        ├── Dashboard.jsx        # main app: URL-synced filters + grid + pagination
        ├── HotelDetails.jsx     # single hotel page
        ├── MyBookings.jsx       # signed-in user's booking history
        └── NotFound.jsx         # 404 fallback
```

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`). You'll
land on the marketing homepage — sign up, log in, or hit **Continue as
guest** to reach the dashboard.

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## API integration notes

- Base URL: `https://demohotelsapi.pythonanywhere.com`
- Endpoint used: `GET /hotels/` — returns `{ status, message, data: [...] }`
- Since the API has no per-hotel endpoint or query params, the app fetches
  the full list once (`useHotels` hook) and does searching, filtering,
  sorting, and pagination entirely on the client.
- Prices are shown in INR using `Intl.NumberFormat`.
- The booking flow, reviews, favorites, and auth are all client-side only —
  the API doesn't expose endpoints for any of them, so those features are
  simulated and persisted in `localStorage` instead of a server.

## Pushing to your own GitHub repository

```bash
git init
git add .
git commit -m "Initial commit: StayFinder hotel booking app"
git remote add origin <https://github.com/mahakseth82-prog/StayFinder>
git push -u origin master
```

## Possible next steps

- Replace the mock `AuthContext` with a real backend/auth provider.
- Move bookings, reviews, and favorites from `localStorage` to a database.
- Add a map view of results.
- Add pagination or infinite scroll to the reviews list for popular hotels.
