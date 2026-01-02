import React, { createContext, useContext, useEffect, useState } from "react";

import { apiFetch } from "../api/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const isAuthenticated = !!token;

  // 🔄 Sync localStorage on change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // 🔐 LOGIN
  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // 🔥 WRITE FIRST (this is the fix)
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // THEN update React state
    setToken(data.token);
    setUser(data.user);
  };

  // 🏢 REGISTER ORG (OWNER)
  const registerOrg = async (payload) => {
    await apiFetch("/auth/register/organization", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // auto-login after register
    await login(payload.email, payload.password);
  };

  // 👤 REGISTER USER
  const registerUser = async (payload) => {
    await apiFetch("/auth/register/user", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    await login(payload.email, payload.password);
  };

  // 🚪 LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        registerOrg,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook (important)
export const useAuth = () => useContext(AuthContext);
