import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { seedProducts } from "../data/products.js";
import { seedCategories } from "../data/categories.js";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useLocalStorage("cc_products", seedProducts);
  const [categories, setCategories] = useLocalStorage(
    "cc_categories",
    seedCategories,
  );

  function addProduct(product) {
    const id = "p" + Date.now();
    setProducts((prev) => [
      ...prev,
      { id, reviews: [], rating: 0, ...product },
    ]);
    return id;
  }

  function updateProduct(id, updates) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function addCategory(category) {
    setCategories((prev) => [
      ...prev,
      { id: "cat-" + Date.now(), ...category },
    ]);
  }

  function updateCategory(id, updates) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  }

  function deleteCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
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
