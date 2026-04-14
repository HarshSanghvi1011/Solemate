import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user || !token) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart/items", { productId, quantity });
    setCart(data);
    return data;
  };

  const updateQty = async (productId, quantity) => {
    const { data } = await api.patch(`/cart/items/${productId}`, { quantity });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/items/${productId}`);
    setCart(data);
  };

  const count =
    cart?.items?.reduce((n, i) => n + (i.quantity || 0), 0) ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, load, addItem, updateQty, removeItem, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
