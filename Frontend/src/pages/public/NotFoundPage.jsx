import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: "var(--sp-8) 0", textAlign: "center" }}>
      <i className="ti ti-mood-confuzed" style={{ fontSize: 48, color: "var(--color-border-strong)" }} aria-hidden="true"></i>
      <h1 style={{ margin: "var(--sp-3) 0 var(--sp-2)" }}>Page not found</h1>
      <p style={{ color: "var(--color-plum-soft)", marginBottom: "var(--sp-4)" }}>
        We couldn't find the page you were looking for.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
