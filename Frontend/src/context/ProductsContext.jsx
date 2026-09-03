import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real products + categories from the backend on load
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function addProduct(formData) {
    // formData must be a real FormData object (includes the image file)
    const res = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    setProducts((prev) => [...prev, res.data]);
    return res.data._id;
  }

  async function updateProduct(id, formData) {
    const res = await api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
  }

  async function deleteProduct(id) {
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  async function addCategory(category) {
    const res = await api.post("/categories", category);
    setCategories((prev) => [...prev, res.data]);
  }

  async function updateCategory(id, updates) {
    const res = await api.put(`/categories/${id}`, updates);
    setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
  }

  async function deleteCategory(id) {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
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
