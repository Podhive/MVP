import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await api.signup(userData);
      toast.success(response.data.message);
      navigate("/verify-otp", { state: { email: userData.email } });
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpData) => {
    setLoading(true);
    try {
      const response = await api.verifyOtp(otpData);
      setToken(response.data.token);
      setRole(response.data.role);

      // Decode token to get user info (basic implementation)
      try {
        const tokenPayload = JSON.parse(
          atob(response.data.token.split(".")[1])
        );
        setUser({ _id: tokenPayload.id, userType: response.data.role });
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
      }

      toast.success("OTP verification successful");

      // Redirect based on role
      if (response.data.role === "admin") {
        navigate("/");
      } else if (response.data.role === "owner") {
        navigate("/");
      } else {
        navigate("/");
      }

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.login(credentials);
      setToken(response.data.token);
      setRole(response.data.role);

      // Decode token to get user info
      try {
        const tokenPayload = JSON.parse(
          atob(response.data.token.split(".")[1])
        );
        setUser({ _id: tokenPayload.id, userType: response.data.role });
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
      }

      toast.success("Login successful");

      // Redirect based on role
      if (response.data.role === "admin") {
        navigate("/");
      } else if (response.data.role === "owner") {
        navigate("/");
      } else {
        navigate("/");
      }

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const hasRole = (requiredRole) => {
    if (!role) return false;

    // Admin has access to all roles
    if (role === "admin") return true;

    // Owner has access to owner and customer roles
    if (
      role === "owner" &&
      (requiredRole === "owner" || requiredRole === "customer")
    )
      return true;

    // Customer has access only to customer role
    if (role === "customer" && requiredRole === "customer") return true;

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        signup,
        verifyOtp,
        login,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
