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

  const product = products.find((p) => p._id === id);
  if (!product) return <Navigate to="/admin/products" replace />;

  // ProductForm's category <select> needs a plain _id string to match its
  // <option value={c._id}>, but `product.category` is now a populated object
  // ({ _id, categoryName, slug, icon }) — unwrap it before handing it down.
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
