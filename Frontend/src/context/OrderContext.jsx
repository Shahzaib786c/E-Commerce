import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const OrderContext = createContext(null);

function generateOrderId() {
  return "CC-" + Math.floor(10000 + Math.random() * 90000);
}

export function OrderProvider({ children }) {
  // All orders live in one shared store — the admin panel and each customer's
  // "My orders" page both read/write here, so a status change is instantly
  // visible everywhere without needing a real backend yet.
  const [orders, setOrders] = useLocalStorage("cc_orders", []);

  function placeOrder({ userId, items, subtotal, delivery, address, paymentMethod }) {
    const order = {
      id: generateOrderId(),
      userId,
      items,
      subtotal,
      delivery,
      total: subtotal + delivery,
      address,
      paymentMethod,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }

  function updateOrderStatus(orderId, status) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }

  function getOrdersForUser(userId) {
    return orders.filter((o) => o.userId === userId);
  }

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, getOrdersForUser }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
