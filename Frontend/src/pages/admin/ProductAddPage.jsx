import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import ProductForm from "../../components/admin/ProductForm.jsx";

export default function ProductAddPage() {
  const { addProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleSubmit(form) {
    addProduct(form);
    showToast("Product added");
    navigate("/admin/products");
  }

  return (
    <div>
      <AdminPageHeader title="Add product" />
      <ProductForm onSubmit={handleSubmit} submitLabel="Save product" />
    </div>
  );
}
