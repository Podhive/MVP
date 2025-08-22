import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "../pages/Home";
import StudioList from "../pages/StudioList";
import StudioDetails from "../pages/StudioDetails";
import AboutUs from "../pages/AboutUs";
import AddYourStudio from "../pages/AddYourStudio";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyOtp from "../pages/VerifyOtp";
import Unauthorized from "../pages/Unauthorized";
import HelpCenter from "../pages/HelpCenter";
import ContactUs from "../pages/ContactUs";
import TermsOfService from "../pages/TermsOfServices";
import PrivacyPolicy from "../pages/Privacy-info";

// --- NEWLY ADDED IMPORTS ---
import ForgotPassword from "../pages/ForgotPassword";
import VerifyPasswordOtp from "../pages/VerifyPasswordOtp";
import ResetPassword from "../pages/ResetPassword";
// --- END NEW IMPORTS ---

// Customer Pages
import CustomerDashboard from "../pages/Customer/CustomerDashboard";
import MyBookings from "../pages/Customer/MyBookings";

// Owner Pages
import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import MyStudios from "../pages/Owner/MyStudios";
import AddStudio from "../pages/Owner/AddStudio";
import EditStudio from "../pages/Owner/EditStudio";
import BookingsReceived from "../pages/Owner/BookingsReceived";

// Admin Pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import PendingStudios from "../pages/Admin/PendingStudios";
import AllBookings from "../pages/Admin/AllBookings";

import useAuth from "../context/useAuth";

const AppRouter = () => {
  const { role } = useAuth();

  // Helper function to redirect to the appropriate dashboard based on role
  const DashboardRedirect = () => {
    if (role === "admin") return <Navigate to="/dashboard/admin" replace />;
    if (role === "owner") return <Navigate to="/dashboard/owner" replace />;
    return <Navigate to="/dashboard/customer" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/studios" element={<StudioList />} />
      <Route path="/studios/:studioId" element={<StudioDetails />} />
      <Route path="/add-your-studio" element={<AddYourStudio />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Login isAdminLogin={true} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* --- NEWLY ADDED FORGOT PASSWORD ROUTES --- */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-password-otp" element={<VerifyPasswordOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* --- END NEW ROUTES --- */}

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Dashboard Redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Customer Routes */}
      <Route element={<ProtectedRoute requiredRole="customer" />}>
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/bookings/customer" element={<MyBookings />} />
      </Route>

      {/* Owner Routes */}
      <Route element={<ProtectedRoute requiredRole="owner" />}>
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        <Route path="/owner/studios" element={<MyStudios />} />
        <Route path="/owner/studios/new" element={<AddStudio />} />
        <Route path="/owner/studios/:studioId/edit" element={<EditStudio />} />
        <Route path="/owner/bookings" element={<BookingsReceived />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/admin/studios/pending" element={<PendingStudios />} />
        <Route path="/admin/bookings" element={<AllBookings />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
