import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, rehydrate from localStorage
  useEffect(() => {
    const token = localStorage.getItem("eidolux_token");
    const savedUser = localStorage.getItem("eidolux_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      api.get("/auth/me")
        .then(({ data }) => setUser(data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("eidolux_token", data.token);
    localStorage.setItem("eidolux_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (formData) => {
    const { data } = await api.post("/auth/signup", formData);
    localStorage.setItem("eidolux_token", data.token);
    localStorage.setItem("eidolux_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("eidolux_token");
    localStorage.removeItem("eidolux_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
