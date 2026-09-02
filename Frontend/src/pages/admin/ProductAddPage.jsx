import { useNavigate } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import ProductForm from "../../components/admin/ProductForm.jsx";

export default function ProductAddPage() {
  const { addProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(formData) {
    try {
      await addProduct(formData);
      showToast("Product added");
      navigate("/admin/products");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add product");
    }
  }

  return (
    <div>
      <AdminPageHeader title="Add product" />
      <ProductForm onSubmit={handleSubmit} submitLabel="Save product" />
    </div>
  );
}
