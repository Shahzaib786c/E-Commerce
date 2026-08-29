import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { seedCustomers } from "../data/customers.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("cc_auth_user", null);
  // All registered customers live here — this is the one place we'd swap
  // for a real API call (e.g. GET /api/customers) later.
  const [customers, setCustomers] = useLocalStorage("cc_customers", seedCustomers);

  function login(email, password) {
    const found = customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (!found) {
      return { ok: false, error: "That email or password doesn't match our records." };
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    return { ok: true };
  }

  function register({ name, email, phone, password }) {
    const exists = customers.some((c) => c.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newCustomer = {
      id: "u" + (customers.length + 1) + "-" + Date.now(),
      name,
      email,
      phone,
      password,
      joined: new Date().toISOString().slice(0, 10),
    };
    setCustomers([...customers, newCustomer]);
    const { password: _pw, ...safeUser } = newCustomer;
    setUser(safeUser);
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  function updateCustomer(id, updates) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (user?.id === id) setUser((prev) => ({ ...prev, ...updates }));
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
