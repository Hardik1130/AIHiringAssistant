import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth.service";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [hasJobsPostedToday, setHasJobsPostedToday] = useState(false);

  // profile helpers
  const fetchProfile = async () => {
    try {
      const data = await authService.fetchProfile();
      // authService.fetchProfile may return wrapper { error, data: {...}, message }
      // or { user: {...} } or plain profile object
      const profile = data?.user || data?.data || data;
      if (profile) setUser(profile);
      return profile;
    } catch (err) {
      console.error("fetchProfile error", err);
      return null;
    }
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...updates };
      try {
        localStorage.setItem("user", JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      const loggedUser = result?.user ?? result?.userEntity ?? null;
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      const registeredUser = result?.user ?? result?.userEntity ?? null;
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("user");
    try {
      // toast.info("Logged out");
    } catch (e) {}
  };

  // log user whenever it changes (helps debug async updates)
  useEffect(() => {
    console.log("AuthContext user state changed:", user);
  }, [user]);

  // helper to check HR role
  const isHR = () => {
    // depending on backend naming, adjust property check
    return user?.userType === "HR" || user?.role === "HR";
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    fetchProfile,
    updateProfile,
    isHR,
    hasJobsPostedToday,
    setHasJobsPostedToday,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
