import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  // Public-facing — only ever active categories/products. Read by the storefront.
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Admin-facing — everything, including inactive. Read by the admin panel only.
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchPublicData() {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data.products); // <-- .products, since the endpoint now returns an object
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPublicData();
  }, []);

  async function fetchAllCategoriesAdmin() {
    const res = await api.get("/categories/admin/all");
    setAdminCategories(res.data);
  }

  async function fetchAllProductsAdmin() {
    const res = await api.get("/products/admin/all");
    setAdminProducts(res.data);
  }

  async function updateCategoryStatus(id, isActive) {
    const res = await api.put(`/categories/${id}/status`, { isActive });
    // Update the admin list (source of truth for the admin panel)...
    setAdminCategories((prev) =>
      prev.map((c) => (c._id === id ? res.data : c)),
    );
    // ...and refresh the public list too, so the storefront reflects this
    // change without needing a full page reload.
    await fetchPublicData();
    return res.data;
  }

  async function addProduct(formData) {
    const res = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setAdminProducts((prev) => [...prev, res.data]);
    await fetchPublicData();
    return res.data._id;
  }

  async function updateProduct(id, formData) {
    const res = await api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setAdminProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    await fetchPublicData();
  }

  async function deleteProduct(id) {
    await api.delete(`/products/${id}`);
    setAdminProducts((prev) => prev.filter((p) => p._id !== id));
    await fetchPublicData();
  }

  async function addCategory(category) {
    const res = await api.post("/categories", category);
    setAdminCategories((prev) => [...prev, res.data]);
    await fetchPublicData();
  }

  async function updateCategory(id, updates) {
    const res = await api.put(`/categories/${id}`, updates);
    setAdminCategories((prev) =>
      prev.map((c) => (c._id === id ? res.data : c)),
    );
    await fetchPublicData();
  }

  async function updateProductStatus(id, isActive) {
    const res = await api.put(`/products/${id}/status`, { isActive });
    setAdminProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    return res.data;
}

  async function deleteCategory(id) {
    await api.delete(`/categories/${id}`);
    setAdminCategories((prev) => prev.filter((c) => c._id !== id));
    await fetchPublicData();
  }

  return (
    <ProductsContext.Provider
      value={{
        // Public
        products,
        categories,
        loading,
        error,
        fetchPublicData,
        // Admin
        adminProducts,
        adminCategories,
        fetchAllCategoriesAdmin,
        fetchAllProductsAdmin,
        // Mutations (used by admin, but now keep BOTH lists in sync)
        updateCategoryStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateProductStatus,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
