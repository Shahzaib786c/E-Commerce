import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import CustomerForm from "../../components/admin/CustomerForm.jsx";

export default function CustomerEditPage() {
  const { id } = useParams();
  const { customers, updateCustomer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const customer = customers.find((c) => c.id === id);
  if (!customer) return <Navigate to="/admin/customers" replace />;

  function handleSubmit(form) {
    updateCustomer(id, form);
    showToast("Customer updated");
    navigate("/admin/customers");
  }

  return (
    <div>
      <AdminPageHeader title="Edit customer" />
      <CustomerForm initialValues={customer} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
