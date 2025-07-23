const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const User = require("../models/User");
require("dotenv").config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio client setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generates a 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Generate JWT Token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /user/signup
const registerUser = async (req, res) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  const { name, password, userType, phone } = req.body;

  // Check for all fields, including email before lowercasing
  if (!name || !req.body.email || !password || !userType) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  // --- CHANGE: Convert email to lowercase ---
  const email = req.body.email.toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // --- CHANGE: Use the lowercased email to find the user ---
    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "User already exists and verified" });
      }

      // User exists but not verified - update data
      user.name = name;
      user.password = hashedPassword;
      user.userType = userType;
      user.phone = phone;
      user.emailOtp = emailOtp;
      user.phoneOtp = phoneOtp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      // New user
      user = await User.create({
        name,
        // --- CHANGE: Store the lowercased email ---
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

    // Send email OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      // --- CHANGE: Send to the lowercased email ---
      to: email,
      subject: "Your Email OTP",
      text: `Your email OTP is: ${emailOtp}`,
    });

    // Send SMS OTP
    await twilioClient.messages.create({
      body: `Your phone OTP is: ${phoneOtp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    res.status(201).json({
      message: "OTP sent. Please verify OTP sent to your email and phone.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during registration", error: error.message });
  }
};

// @desc    Verify OTPs
// @route   POST /user/verify-otp
const verifyOtp = async (req, res) => {
  const { emailOtp, phoneOtp } = req.body;

  // Check for all fields, including email before lowercasing
  if (!req.body.email || !emailOtp || !phoneOtp) {
    return res
      .status(400)
      .json({ message: "Please provide email and both OTPs" });
  }

  // --- CHANGE: Convert email to lowercase ---
  const email = req.body.email.toLowerCase();

  try {
    // --- CHANGE: Use the lowercased email to find the user ---
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

    // Mark user as verified and clear OTPs
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

  // Check for all fields, including email before lowercasing
  if (!req.body.email || !password || !userType) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  // --- CHANGE: Convert email to lowercase ---
  const email = req.body.email.toLowerCase();

  try {
    // --- CHANGE: Use the lowercased email to find the user ---
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

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
};
