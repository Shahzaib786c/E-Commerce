import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import CustomerForm from "../../components/admin/CustomerForm.jsx";

export default function CustomerAddPage() {
  const { addCustomer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleSubmit(form) {
    addCustomer({ ...form, joined: new Date().toISOString().slice(0, 10) });
    showToast("Customer added");
    navigate("/admin/customers");
  }

  return (
    <div>
      <AdminPageHeader title="Add customer" />
      <CustomerForm onSubmit={handleSubmit} submitLabel="Save customer" />
    </div>
  );
}
