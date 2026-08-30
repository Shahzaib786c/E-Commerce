import { useState } from "react";
import { Link } from "react-router";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-md)", fontWeight: 600, marginBottom: 2 }}>
        Reset your password
      </p>
      {sent ? (
        <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-plum-soft)", marginTop: "var(--sp-3)" }}>
          If an account exists with that email, you'll receive reset instructions shortly.
        </p>
      ) : (
        <>
          <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-plum-soft)", marginBottom: "var(--sp-4)" }}>
            Enter your email and we'll send you a link to reset your password.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}
          >
            <div className="field">
              <label>Email</label>
              <input type="email" className="input" required placeholder="name@example.com" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Send reset link
            </button>
          </form>
        </>
      )}
      <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)", textAlign: "center", marginTop: "var(--sp-4)" }}>
        <Link to="/auth/login" style={{ color: "var(--color-rose)", fontWeight: 700 }}>
          Back to log in
        </Link>
      </p>
    </>
  );
}
