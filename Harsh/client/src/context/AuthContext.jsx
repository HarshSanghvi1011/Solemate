import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setCustomerAuth } from "../api/client.js";

const AuthContext = createContext(null);

const STORAGE = "solemate_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (t) => {
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    setCustomerAuth(t);
    try {
      const { data } = await api.get("/auth/me");
      if (data.user?.role !== "customer") {
        setUser(null);
        localStorage.removeItem(STORAGE);
        setCustomerAuth(null);
      } else {
        setUser(data.user);
      }
    } catch {
      setUser(null);
      localStorage.removeItem(STORAGE);
      setCustomerAuth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh(token);
  }, [token, refresh]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem(STORAGE, data.token);
    setCustomerAuth(data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (body) => {
    const { data } = await api.post("/auth/register", body);
    localStorage.setItem(STORAGE, data.token);
    setCustomerAuth(data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE);
    setCustomerAuth(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
