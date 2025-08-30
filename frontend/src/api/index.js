import axios from "axios";

const API = axios.create({
  baseURL: "https://mvp-40c2.onrender.com/api", // Updated to include /api prefix
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Contact Form
export const submitContactForm = (formData) => API.post("/contact", formData);

export const submitStudioInquiry = (inquiryData) =>
  API.post("/studio-inquiry", inquiryData);
// Auth
export const signup = (userData) => API.post("/user/signup", userData);
export const verifyOtp = (otpData) => API.post("/user/verify-otp", otpData);
export const login = (credentials) => API.post("/user/login", credentials);

// Password Reset
export const forgotPassword = (emailData) =>
  API.post("/user/forgot-password", emailData);
export const verifyPasswordOtp = (otpData) =>
  API.post("/user/verify-password-otp", otpData);
export const resetPassword = (passwordData) =>
  API.post("/user/reset-password", passwordData);

// Studios
export const fetchStudios = () => API.get("/studio");
export const createStudio = (formData) =>
  API.post("/studio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateStudio = (id, formData) =>
  API.put(`/studio/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteStudio = (id) => API.delete(`/studio/${id}`);

// Availability
export const getAvailableSlots = (studioId) =>
  API.get(`/availability/${studioId}`);

// Booking
export const createBooking = (bookingData) => API.post("/booking", bookingData);
export const getCustomerBookings = () => API.get("/booking/customer");
export const getOwnerBookings = () => API.get("/booking/owner");

// Review
export const createReview = (reviewData) => API.post("/review", reviewData);
export const getReviewsByStudio = (studioId) =>
  API.get(`/review/studio/${studioId}`);
export const updateReview = (id, data) => API.put(`/review/${id}`, data);
export const deleteReview = (id) => API.delete(`/review/${id}`);

// Admin
export const getPendingStudios = () => API.get("/admin/studios/pending");
export const approveStudio = (id) => API.put(`/admin/studios/${id}/approve`);
export const denyStudio = (id) => API.delete(`/admin/studios/${id}/deny`);
export const getAllBookingsAdmin = () => API.get("/admin/bookings");
export const deleteBookingAdmin = (id) => API.delete(`/admin/bookings/${id}`);

// Export default API for ad-hoc calls if needed
export default API;
