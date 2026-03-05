"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("inkfinity_token");
    const storedUser = localStorage.getItem("inkfinity_user");
    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setUser(JSON.parse(storedUser));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setToken(storedToken);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        localStorage.removeItem("inkfinity_token");
        localStorage.removeItem("inkfinity_user");
      }
    }
    setLoading(false);
  }, []);

  // login: stores auth state — caller is responsible for redirecting
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("inkfinity_token", tokenData);
    localStorage.setItem("inkfinity_user", JSON.stringify(userData));
  };

  // logout: clears auth state — caller is responsible for redirecting
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("inkfinity_token");
    localStorage.removeItem("inkfinity_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
