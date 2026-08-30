import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email, password);
    if (result.ok) {
      // Admins always land in the admin panel, no matter where they came
      // from. Everyone else goes back to wherever they were headed (or home).
      if (result.user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error);
    }
  }

  return (
    <>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-md)", fontWeight: 600, marginBottom: 2 }}>
        Welcome back
      </p>
      <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-plum-soft)", marginBottom: "var(--sp-4)" }}>
        Log in to continue to checkout
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            className="input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <Link to="/auth/forgot" style={{ fontSize: "var(--fs-xs)", color: "var(--color-rose)", textAlign: "right" }}>
          Forgot password?
        </Link>
        <button type="submit" className="btn btn-primary btn-block">
          Log in
        </button>
      </form>

      <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)", textAlign: "center", marginTop: "var(--sp-4)" }}>
        New here?{" "}
        <Link to="/auth/register" style={{ color: "var(--color-rose)", fontWeight: 700 }}>
          Create an account
        </Link>
      </p>
      <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)", textAlign: "center", marginTop: "var(--sp-3)" }}>
        Demo login: ayesha@example.com / password123 · Admin: admin@cuddleco.com / admin123
      </p>
    </>
  );
}