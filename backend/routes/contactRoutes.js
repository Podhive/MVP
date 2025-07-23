// routes/contactRoutes.js

const express = require("express");
const {
  handleContactForm,
  handleStudioInquiry,
} = require("../controllers/contactController.js");

const router = express.Router();

// IMPORTANT: This router should be mounted on the '/api' path in your main server file.
// Example: app.use('/api', contactRoutes);

// @route   POST /api/contact
// @desc    Handle contact form submission and send email
// @access  Public
router.post("/contact", handleContactForm);

// @route   POST /api/studio-inquiry
// @desc    Handle "Add Your Studio" form submission and send email
// @access  Public
router.post("/studio-inquiry", handleStudioInquiry);

module.exports = router;
