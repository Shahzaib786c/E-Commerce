import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import "./ProductForm.css";

const EMPTY = {
  name: "",
  category: "",
  price: "",
  stock: "",
  isNew: false,
  isBestseller: false,
  variants: [],
  images: [],
  description: "",
};

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const { categories } = useProducts();
  const [form, setForm] = useState(initialValues || { ...EMPTY, category: categories[0]?.slug || "" });
  const [variantInput, setVariantInput] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    update("images", [...form.images, ...urls]);
  }

  function removeImage(idx) {
    update(
      "images",
      form.images.filter((_, i) => i !== idx)
    );
  }

  function addVariant() {
    const v = variantInput.trim();
    if (v && !form.variants.includes(v)) {
      update("variants", [...form.variants, v]);
    }
    setVariantInput("");
  }

  function removeVariant(v) {
    update(
      "variants",
      form.variants.filter((x) => x !== v)
    );
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.category) errs.category = "Required";
    if (!form.price || Number(form.price) <= 0) errs.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Enter a valid stock count";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="product-form-grid">
      <div className="card product-form-fields">
        <div className="field">
          <label>Product name</label>
          <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="product-form-row">
          <div className="field">
            <label>Category</label>
            <select className="input" value={form.category} onChange={(e) => update("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>
          <div className="field">
            <label>Price ($)</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>
        </div>

        <div className="product-form-row">
          <div className="field">
            <label>Stock quantity</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
            {errors.stock && <p className="error-text">{errors.stock}</p>}
          </div>
          <div className="field">
            <label>Mark as</label>
            <select
              className="input"
              value={form.isBestseller ? "bestseller" : form.isNew ? "new" : "none"}
              onChange={(e) => {
                const v = e.target.value;
                update("isNew", v === "new");
                update("isBestseller", v === "bestseller");
              }}
            >
              <option value="none">None</option>
              <option value="new">New arrival</option>
              <option value="bestseller">Bestseller</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Variants (sizes)</label>
          <div className="filter-pills" style={{ marginBottom: 8 }}>
            {form.variants.map((v) => (
              <span key={v} className="pill active variant-chip">
                {v} <button type="button" onClick={() => removeVariant(v)}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              className="input"
              placeholder="e.g. Small"
              value={variantInput}
              onChange={(e) => setVariantInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addVariant();
                }
              }}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={addVariant}>
              Add
            </button>
          </div>
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className="field-label-standalone">Product images</p>
        <div className="product-image-grid">
          <label className="product-image-upload">
            <i className="ti ti-plus" aria-hidden="true"></i>
            <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
          </label>
          {form.images.map((img, i) => (
            <div key={img} className="product-image-thumb">
              <img src={img} alt="" />
              <button type="button" onClick={() => removeImage(i)} aria-label="Remove image">
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="card product-preview">
          <p className="field-label-standalone">Preview</p>
          <div className="product-preview-row">
            <div className="product-preview-image">
              {form.images[0] && <img src={form.images[0]} alt="" />}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{form.name || "Product name"}</p>
              <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-plum-soft)" }}>
                {categories.find((c) => c.slug === form.category)?.name || "Category"} · $
                {form.price || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--sp-2)" }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
