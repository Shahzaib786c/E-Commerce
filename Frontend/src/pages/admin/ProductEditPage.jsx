import { useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import ProductForm from "../../components/admin/ProductForm.jsx";

export default function ProductEditPage() {
  const { id } = useParams();
  const { adminProducts, updateProduct, fetchAllProductsAdmin } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProductsAdmin();
  }, []);

  const product = adminProducts.find((p) => p._id === id);
  if (!product) return <Navigate to="/admin/products" replace />;

  const initialValues = {
    ...product,
    category: product.category?._id || "",
  };

  async function handleSubmit(formData) {
    try {
      await updateProduct(id, formData);
      showToast("Product updated");
      navigate("/admin/products");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update product");
    }
  }

  return (
    <div>
      <AdminPageHeader title="Edit product" />
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  );
}
