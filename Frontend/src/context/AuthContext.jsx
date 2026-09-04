import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios.js";
import { useToast } from "./ToastContext.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
        if (err.response?.status === 403) {
          showToast(
            err.response.data?.message || "Your account has been deactivated.",
          );
        }
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
      await api.post("/users/logout");
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
      /* clear local state regardless */
    }
    setUser(null);
  }

  const fetchCustomers = useCallback(async () => {
    const res = await api.get("/users");
    setCustomers(res.data);
  }, []);

  async function updateCustomerRole(id, role) {
    const res = await api.put(`/users/${id}/role`, { role });
    setCustomers((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    return res.data;
  }

  async function updateCustomerStatus(id, isActive) {
    const res = await api.put(`/users/${id}/status`, { isActive });
    setCustomers((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    return res.data;
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
        fetchCustomers,
        updateCustomerRole,
        updateCustomerStatus,
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
