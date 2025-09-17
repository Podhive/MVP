// src/pages/Login.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mic, Eye, EyeOff } from "lucide-react";
import useAuth from "../context/useAuth";
import Navbar from "../components/Navbar";

const Login = ({ isAdminLogin = false, isOwnerLogin = false }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: isAdminLogin ? "admin" : isOwnerLogin ? "owner" : "customer",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAdminLogin) {
      setFormData((prev) => ({ ...prev, userType: "admin" }));
    } else if (isOwnerLogin) {
      setFormData((prev) => ({ ...prev, userType: "owner" }));
    } else {
      setFormData((prev) => ({ ...prev, userType: "customer" }));
    }
  }, [isAdminLogin, isOwnerLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.userType) {
      newErrors.userType = "User type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(formData);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setErrors({
          general: "Invalid credentials. Please check your email and password.",
        });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    }
  };

  // Create variables for cleaner conditional rendering
  const isDedicatedLogin = isAdminLogin || isOwnerLogin;
  const title = isAdminLogin
    ? "Admin Sign In"
    : isOwnerLogin
    ? "Studio Partner Sign In"
    : "Welcome Back";
  const subtitle = isAdminLogin
    ? "Access the PodHive Admin Dashboard"
    : isOwnerLogin
    ? "Access your Studio Partner Dashboard"
    : "Sign in to your PodHive account";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-indigo-900 px-8 py-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-900 p-3 rounded-full">
                  <Mic className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-indigo-100 mt-1">{subtitle}</p>
            </div>

            <div className="px-8 py-8">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    {/* --- FIX: The conditional rendering wrapper has been removed --- */}
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-indigo-900 hover:text-indigo-800 transition-colors"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-900 text-white py-3 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {!isDedicatedLogin && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-indigo-900 hover:text-indigo-800 font-medium transition-colors"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
