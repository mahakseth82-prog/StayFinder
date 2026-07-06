import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page-container">
      <div className="state-banner">
        <h1>404</h1>
        <p>This page wandered off somewhere. Let's get you back.</p>
        <Link to="/" className="btn btn--primary">Back to home</Link>
      </div>
    </main>
  );
}
