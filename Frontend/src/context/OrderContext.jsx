import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios.js";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]); // admin: all orders
  const [myOrders, setMyOrders] = useState([]); // customer: their own orders
  const [loading, setLoading] = useState(false);

  async function placeOrder({
    items,
    shippingAddress,
    paymentMethod,
    deliveryFee = 0,
  }) {
    const res = await api.post("/orders", {
      items,
      shippingAddress,
      paymentMethod,
      deliveryFee,
    });
    const order = res.data;

    // Safepay is treated as paid instantly in this simulated flow. Cash on
    // delivery has no Payment record yet — that gets created when the
    // customer actually pays the courier (a future admin action).
    if (paymentMethod === "safepay") {
      try {
        await api.post("/payments", {
          orderId: order._id,
          paymentMethod: "card",
          amountPaid: order.totalAmount,
        });
      } catch (err) {
        console.error("Failed to record payment:", err.response?.data?.message);
      }
    }

    return order;
  }

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/my-orders");
      setMyOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  async function updateOrderStatus(orderId, orderStatus) {
    const res = await api.put(`/orders/${orderId}/status`, { orderStatus });
    setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
    return res.data;
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        myOrders,
        loading,
        placeOrder,
        fetchMyOrders,
        fetchAllOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
