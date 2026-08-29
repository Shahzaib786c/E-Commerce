import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const result = register(form);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  }

  return (
    <>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-md)", fontWeight: 600, marginBottom: 2 }}>
        Create your account
      </p>
      <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-plum-soft)", marginBottom: "var(--sp-4)" }}>
        Join to save your orders and wishlist
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
        <div className="field">
          <label>Full name</label>
          <input className="input" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Phone number</label>
          <input className="input" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            className="input"
            required
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">
          Create account
        </button>
      </form>

      <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)", textAlign: "center", marginTop: "var(--sp-4)" }}>
        Already have an account?{" "}
        <Link to="/auth/login" style={{ color: "var(--color-rose)", fontWeight: 700 }}>
          Log in
        </Link>
      </p>
    </>
  );
}
