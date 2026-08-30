import { useState } from "react";
import { useNavigate } from "react-router";

export default function CustomerForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState(
    initialValues || { name: "", email: "", phone: "", password: "" }
  );
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!initialValues && !form.password) errs.password = "Required for new accounts";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: "var(--sp-5)", maxWidth: 480 }}>
      <div className="field" style={{ marginBottom: "var(--sp-3)" }}>
        <label>Full name</label>
        <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>
      <div className="field" style={{ marginBottom: "var(--sp-3)" }}>
        <label>Email</label>
        <input className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>
      <div className="field" style={{ marginBottom: "var(--sp-3)" }}>
        <label>Phone</label>
        <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        {errors.phone && <p className="error-text">{errors.phone}</p>}
      </div>
      {!initialValues && (
        <div className="field" style={{ marginBottom: "var(--sp-4)" }}>
          <label>Temporary password</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
      )}
      <div style={{ display: "flex", gap: "var(--sp-2)" }}>
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate("/admin/customers")}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
