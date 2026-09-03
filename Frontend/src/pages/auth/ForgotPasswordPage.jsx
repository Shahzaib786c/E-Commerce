import { useState } from "react";
import { Link } from "react-router";
import api from "../../api/axios.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/users/forgot-password", { email });
      setSent(true); // always show success, even if the email doesn't exist — this matches the backend's security design
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--fs-md)",
          fontWeight: 600,
          marginBottom: 2,
        }}
      >
        Reset your password
      </p>
      {sent ? (
        <p
          style={{
            fontSize: "var(--fs-sm)",
            color: "var(--color-plum-soft)",
            marginTop: "var(--sp-3)",
          }}
        >
          If an account exists with that email, you'll receive reset
          instructions shortly.
        </p>
      ) : (
        <>
          <p
            style={{
              fontSize: "var(--fs-sm)",
              color: "var(--color-plum-soft)",
              marginBottom: "var(--sp-4)",
            }}
          >
            Enter your email and we'll send you a link to reset your password.
          </p>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--sp-3)",
            }}
          >
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                className="input"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        </>
      )}
      <p
        style={{
          fontSize: "var(--fs-xs)",
          color: "var(--color-plum-soft)",
          textAlign: "center",
          marginTop: "var(--sp-4)",
        }}
      >
        <Link
          to="/auth/login"
          style={{
            color: "var(--color-rose)",
            fontWeight: 700,
          }}
        >
          Back to log in
        </Link>
      </p>
    </>
  );
}
