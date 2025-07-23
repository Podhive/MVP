const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  loginUser,
} = require("../controllers/authController");

// Auth Routes
router.post("/signup", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

module.exports = router;
