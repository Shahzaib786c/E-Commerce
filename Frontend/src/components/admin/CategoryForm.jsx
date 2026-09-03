import { useState } from "react";
import { useNavigate } from "react-router";

const ICON_OPTIONS = [
  "ti-hearts",
  "ti-paw",
  "ti-gift",
  "ti-sparkles",
  "ti-star",
  "ti-flower",
];

export default function CategoryForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState(
    initialValues || { categoryName: "", slug: "", icon: "ti-hearts" },
  );

  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
      ...(field === "categoryName" && !initialValues
        ? { slug: value.toLowerCase().trim().replace(/\s+/g, "-") }
        : {}),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.categoryName.trim()) {
      setError("Category name is required.");
      return;
    }
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ padding: "var(--sp-5)", maxWidth: 480 }}
    >
      <div className="field" style={{ marginBottom: "var(--sp-3)" }}>
        <label>Category name</label>
        <input
          className="input"
          value={form.categoryName}
          onChange={(e) => update("categoryName", e.target.value)}
        />
      </div>

      <div className="field" style={{ marginBottom: "var(--sp-3)" }}>
        <label>Slug</label>
        <input
          className="input"
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
        />
      </div>

      <div className="field" style={{ marginBottom: "var(--sp-4)" }}>
        <label>Icon</label>
        <select
          className="input"
          value={form.icon}
          onChange={(e) => update("icon", e.target.value)}
        >
          {ICON_OPTIONS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="error-text" style={{ marginBottom: "var(--sp-3)" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "var(--sp-2)" }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={() => navigate("/admin/categories")}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
