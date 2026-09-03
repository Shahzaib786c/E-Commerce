import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import api from "../../api/axios.js";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/users/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--fs-md)",
            fontWeight: 600,
            marginBottom: "var(--sp-2)",
          }}
        >
          Password reset!
        </p>
        <p
          style={{ fontSize: "var(--fs-sm)", color: "var(--color-plum-soft)" }}
        >
          Redirecting you to log in...
        </p>
      </div>
    );
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
        Set a new password
      </p>

      <p
        style={{
          fontSize: "var(--fs-sm)",
          color: "var(--color-plum-soft)",
          marginBottom: "var(--sp-4)",
        }}
      >
        Choose a new password for your account.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}
      >
        <div className="field">
          <label>New password</label>
          <input
            type="password"
            className="input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Confirm new password</label>
          <input
            type="password"
            className="input"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? "Resetting..." : "Reset password"}
        </button>
      </form>

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
          style={{ color: "var(--color-rose)", fontWeight: 700 }}
        >
          Back to login
        </Link>
      </p>
    </>
  );
}
