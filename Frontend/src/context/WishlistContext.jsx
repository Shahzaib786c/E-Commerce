import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // Guests can use the wishlist freely — no login required, unlike checkout.
  const [productIds, setProductIds] = useLocalStorage("cc_wishlist", []);

  function toggle(productId) {
    setProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }

  function isWishlisted(productId) {
    return productIds.includes(productId);
  }

  return (
    <WishlistContext.Provider value={{ productIds, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
