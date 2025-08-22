const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
} = require("../controllers/authController");

// Define rate limiter
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message:
    "Too many password reset requests, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Routes
router.post("/signup", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

// Password Reset Routes
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-password-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
