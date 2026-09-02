import { useNavigate } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import CategoryForm from "../../components/admin/CategoryForm.jsx";

export default function CategoryAddPage() {
  const { addCategory } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(form) {
    try {
      await addCategory(form);
      showToast("Category added");
      navigate("/admin/categories");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add category");
    }
  }

  return (
    <div>
      <AdminPageHeader title="Add category" />
      <CategoryForm onSubmit={handleSubmit} submitLabel="Save category" />
    </div>
  );
}
