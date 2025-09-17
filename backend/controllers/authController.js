const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");
const { sendOtpEmail, sendPasswordResetEmail } = require("../utils/email");
require("dotenv").config();

// Generates a 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Generates a 6-digit OTP for password reset
const generate6DigitOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT Token
const generateToken = (id, userType, expiresIn = "30d") => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, { expiresIn });
};

// Password validation regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ✅ Send WhatsApp OTP via Fast2SMS
const sendWhatsAppOtp = async (phone, otp) => {
  try {
    const response = await axios.get("https://www.fast2sms.com/dev/whatsapp", {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        message_id: 3610, // ✅ Use approved OTP template_id from your sheet
        variables_values: otp,
        numbers: phone, // format: 91XXXXXXXXXX
      },
    });

    if (response.data && response.data.return) {
      return true;
    } else {
      console.error("Fast2SMS WhatsApp Error:", response.data);
      return false;
    }
  } catch (error) {
    console.error(
      "Fast2SMS WhatsApp Exception:",
      error.response?.data || error.message
    );
    return false;
  }
};

// @desc    Register new user
// @route   POST /user/signup
const registerUser = async (req, res) => {
  const { name, password, userType, phone } = req.body;

  if (!name || !req.body.email || !password || !userType) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const email = req.body.email.toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "User already exists and verified" });
      }
      // Update existing unverified user
      user.name = name;
      user.password = hashedPassword;
      user.userType = userType;
      user.phone = phone;
      user.emailOtp = emailOtp;
      user.phoneOtp = phoneOtp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        userType,
        phone,
        emailOtp,
        phoneOtp,
        otpExpiresAt,
        isVerified: false,
      });
    }

    // ✅ Send both OTPs
    const emailSent = await sendOtpEmail({ to: email, otp: emailOtp });
    const whatsappSent = await sendWhatsAppOtp(phone, phoneOtp);

    if (!emailSent && !whatsappSent) {
      return res
        .status(500)
        .json({ message: "Failed to send both Email & WhatsApp OTP" });
    }
    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send Email OTP. Please try again." });
    }
    if (!whatsappSent) {
      return res
        .status(500)
        .json({ message: "Failed to send WhatsApp OTP. Please try again." });
    }

    // ✅ Only if both succeed
    return res.status(201).json({
      message: "OTP sent successfully to Email & WhatsApp. Please verify.",
    });
  } catch (error) {
    console.error("Register User Error:", error);
    res
      .status(500)
      .json({ message: "Error during registration", error: error.message });
  }
};

// @desc    Verify OTPs
// @route   POST /user/verify-otp
const verifyOtp = async (req, res) => {
  const { emailOtp, phoneOtp } = req.body;

  if (!req.body.email || !emailOtp || !phoneOtp) {
    return res
      .status(400)
      .json({ message: "Please provide email and both OTPs" });
  }

  const email = req.body.email.toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (user.emailOtp !== emailOtp || user.phoneOtp !== phoneOtp) {
      return res.status(400).json({ message: "Invalid OTPs" });
    }

    user.emailOtp = undefined;
    user.phoneOtp = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id, user.userType);

    res.json({ token, role: user.userType });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};

// @desc    Login user
// @route   POST /user/login
const loginUser = async (req, res) => {
  const { password, userType } = req.body;

  if (!req.body.email || !password || !userType) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const email = req.body.email.toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (!user || user.userType !== userType) {
      return res.status(401).json({ message: "Invalid email or role" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id, user.userType);

    res.json({ token, role: userType });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @desc    Request password reset
// @route   POST /user/forgot-password
const forgotPassword = async (req, res) => {
  const email = (req.body.email || "").toLowerCase();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset code has been sent.",
      });
    }

    const otp = generate6DigitOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.passwordResetOtp = hashedOtp;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.passwordResetAttempts = 0;
    await user.save();

    await sendPasswordResetEmail({ to: user.email, otp: otp });

    res.status(200).json({
      message: "A password reset code has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Verify password reset OTP
// @route   POST /user/verify-password-otp
const verifyPasswordResetOtp = async (req, res) => {
  const email = (req.body.email || "").toLowerCase();
  const { otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      !user.passwordResetOtp ||
      new Date() > user.passwordResetExpires
    ) {
      return res
        .status(400)
        .json({ message: "OTP is invalid or has expired." });
    }

    if (user.passwordResetAttempts >= 5) {
      return res
        .status(400)
        .json({ message: "Too many attempts. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(otp, user.passwordResetOtp);

    if (!isMatch) {
      user.passwordResetAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.passwordResetOtp = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetAttempts = 0;
    await user.save();

    const resetToken = generateToken(user._id, user.userType, "15m"); // 15-minute expiry

    res.status(200).json({ resetToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reset password with a valid token
// @route   POST /user/reset-password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or user not found." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date(); // Invalidate old sessions
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message:
          "Your reset token is invalid or has expired. Please try again.",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
};
