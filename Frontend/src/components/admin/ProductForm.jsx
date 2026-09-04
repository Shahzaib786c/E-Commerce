import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { getImageUrl } from "../../api/imageUrl.js";
import "./ProductForm.css";

const EMPTY = {
  name: "",
  category: "",
  price: "",
  stock: "",
  isNewArrival: false,
  isBestseller: false,
  variants: [],
  description: "",
  rating: 0,
};

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const { adminCategories, fetchAllCategoriesAdmin } = useProducts();

  useEffect(() => {
    fetchAllCategoriesAdmin();
  }, []);

  const [form, setForm] = useState(
    initialValues || { ...EMPTY, category: adminCategories[0]?._id || "" },
  );
  const [variantInput, setVariantInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(
    initialValues?.images?.[0] || null,
  );
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  }

  function removeImage() {
    setImageFile(null);
    setExistingImage(null);
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
      form.variants.filter((x) => x !== v),
    );
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.category) errs.category = "Required";
    if (!form.price || Number(form.price) <= 0)
      errs.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0)
      errs.stock = "Enter a valid stock count";
    if (!imageFile && !existingImage) errs.image = "Product image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("category", form.category);
    formData.append("rating", form.rating || 0);
    formData.append("isNewArrival", form.isNewArrival);
    formData.append("isBestseller", form.isBestseller);
    formData.append("variants", form.variants.join(","));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSubmit(formData);
  }

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : getImageUrl(existingImage);

  return (
    <form onSubmit={handleSubmit} className="product-form-grid">
      <div className="card product-form-fields">
        <div className="field">
          <label>Product name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="product-form-row">
          <div className="field">
            <label>Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {adminCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryName}
                  {c.isActive === false ? " (Inactive)" : ""}
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
              value={
                form.isBestseller
                  ? "bestseller"
                  : form.isNewArrival
                    ? "new"
                    : "none"
              }
              onChange={(e) => {
                const v = e.target.value;
                update("isNewArrival", v === "new");
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
                {v}{" "}
                <button type="button" onClick={() => removeVariant(v)}>
                  ×
                </button>
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
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addVariant}
            >
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
        <p className="field-label-standalone">Product image</p>
        <div className="product-image-grid">
          {!previewUrl && (
            <label className="product-image-upload">
              <i className="ti ti-plus" aria-hidden="true"></i>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          )}
          {previewUrl && (
            <div className="product-image-thumb">
              <img src={previewUrl} alt="" />
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove image"
              >
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>
        {errors.image && <p className="error-text">{errors.image}</p>}

        <div className="card product-preview">
          <p className="field-label-standalone">Preview</p>
          <div className="product-preview-row">
            <div className="product-preview-image">
              {previewUrl && <img src={previewUrl} alt="" />}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>
                {form.name || "Product name"}
              </p>
              <p
                style={{
                  fontSize: "var(--fs-xs)",
                  color: "var(--color-plum-soft)",
                }}
              >
                {adminCategories.find((c) => c._id === form.category)
                  ?.categoryName || "Category"}{" "}
                · ${form.price || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--sp-2)" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => navigate("/admin/products")}
          >
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
