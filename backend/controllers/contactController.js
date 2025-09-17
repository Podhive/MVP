// controllers/contactController.js

const {
  sendContactEmail,
  sendStudioInquiryEmail,
} = require("../utils/email.js"); // Updated import path

/**
 * Handles the original contact form submissions.
 */
const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;

    if (!name || !email || !subject || !message || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailSubject = `New Contact Form Submission: ${subject}`;
    const emailHtml = `
            <h1>New Inquiry from Contact Form</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${category}</p>
            <hr>
            <h2>Message:</h2>
            <p>${message}</p>
        `;

    await sendContactEmail({
      subject: emailSubject,
      html: emailHtml,
      replyTo: email,
    });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error handling contact form:", error);
    res.status(500).json({ message: "Server error. Failed to send message." });
  }
};

/**
 * Handles the "Add Your Studio" form submission.
 */
const handleStudioInquiry = async (req, res) => {
  try {
    const { name, whatsapp, location, hasRoom, needsHelp } = req.body;

    // Basic validation
    if (!name || !whatsapp || !location || !hasRoom || !needsHelp) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Call the specific email function for studio inquiries
    await sendStudioInquiryEmail({
      name,
      whatsapp,
      location,
      hasRoom,
      needsHelp,
    });

    res.status(200).json({
      success: true,
      message: "Inquiry submitted successfully! We will contact you shortly.",
    });
  } catch (error) {
    console.error("Error handling studio inquiry form:", error);
    res
      .status(500)
      .json({ message: "Server error. Failed to submit inquiry." });
  }
};

module.exports = { handleContactForm, handleStudioInquiry };
