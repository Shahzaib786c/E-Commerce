import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { seedCustomers } from "../data/customers.js";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check session on load

  // Customers list stays mock/local for now — no backend endpoint yet (Step 8 in our plan)
  const [customers, setCustomers] = useLocalStorage(
    "cc_customers",
    seedCustomers,
  );

  // On first load, ask the backend "am I still logged in?" via the cookie
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        setUser(null); // no valid cookie / not logged in
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post("/users/login", { email, password });
      setUser(res.data);
      return { ok: true, user: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Login failed. Please try again.",
      };
    }
  }

  async function register({ name, email, password }) {
    try {
      await api.post("/users/register", { name, email, password });
      await api.post("/users/logout"); // clear the auto-issued cookie — force a real login step
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  }

  async function logout() {
    try {
      await api.post("/users/logout");
    } catch (err) {
      // even if this fails, clear local state so the UI reflects logged-out
    }
    setUser(null);
  }

  function updateCustomer(id, updates) {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  }

  function addCustomer(customer) {
    setCustomers((prev) => [...prev, { id: "u" + Date.now(), ...customer }]);
  }

  function deleteCustomer(id) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
        loading,
        customers,
        login,
        register,
        logout,
        updateCustomer,
        addCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
