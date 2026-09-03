import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import api from "../../api/axios.js";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

export default function CustomerEditPage() {
  const { id } = useParams();
  const { updateCustomerRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await api.get(`/users/${id}`);
        setCustomer(res.data);
        setRole(res.data.role);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateCustomerRole(id, role);
      showToast("Customer role updated");
      navigate("/admin/customers");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (notFound || !customer) return <Navigate to="/admin/customers" replace />;

  return (
    <div>
      <AdminPageHeader title="Manage customer role" />
      <div className="card" style={{ padding: "var(--sp-5)", maxWidth: 480 }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{customer.name}</p>
        <p
          style={{
            color: "var(--color-plum-soft)",
            marginBottom: "var(--sp-4)",
          }}
        >
          {customer.email}
        </p>

        <div className="field" style={{ marginBottom: "var(--sp-4)" }}>
          <label>Role</label>
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "var(--sp-2)" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => navigate("/admin/customers")}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
