import { useParams, useNavigate, Navigate } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import CategoryForm from "../../components/admin/CategoryForm.jsx";

export default function CategoryEditPage() {
  const { id } = useParams();
  const { categories, updateCategory } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const category = categories.find((c) => c._id === id);
  if (!category) return <Navigate to="/admin/categories" replace />;

  async function handleSubmit(form) {
    try {
      await updateCategory(id, form);
      showToast("Category updated");
      navigate("/admin/categories");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update category");
    }
  }

  return (
    <div>
      <AdminPageHeader title="Edit category" />
      <CategoryForm
        initialValues={category}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  );
}
