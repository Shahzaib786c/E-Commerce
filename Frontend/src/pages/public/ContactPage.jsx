import { useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import api from "../../api/axios.js";

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      showToast("Message sent, we'll get back to you soon");
      setForm({ name: "", email: "", message: "" , website: ""});
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="container"
      style={{ padding: "var(--sp-7) 0", maxWidth: 480 }}
    >
      <h1 style={{ marginBottom: "var(--sp-2)" }}>Contact us</h1>
      <p
        style={{ color: "var(--color-plum-soft)", marginBottom: "var(--sp-4)" }}
      >
        Questions about an order or a product? Send us a message.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}
      >
        <div className="field">
          <label>Name</label>
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea
            className="input"
            rows={4}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          style={{ position: "absolute", left: "-9999px" }}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
        />
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
