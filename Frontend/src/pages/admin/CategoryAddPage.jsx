import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import CategoryForm from "../../components/admin/CategoryForm.jsx";

export default function CategoryAddPage() {
  const { addCategory } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleSubmit(form) {
    addCategory(form);
    showToast("Category added");
    navigate("/admin/categories");
  }

  return (
    <div>
      <AdminPageHeader title="Add category" />
      <CategoryForm onSubmit={handleSubmit} submitLabel="Save category" />
    </div>
  );
}
