import { useParams, useNavigate, Navigate } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import ProductForm from "../../components/admin/ProductForm.jsx";

export default function ProductEditPage() {
  const { id } = useParams();
  const { products, updateProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  if (!product) return <Navigate to="/admin/products" replace />;

  function handleSubmit(form) {
    updateProduct(id, form);
    showToast("Product updated");
    navigate("/admin/products");
  }

  return (
    <div>
      <AdminPageHeader title="Edit product" />
      <ProductForm initialValues={product} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
