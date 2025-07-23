// utils/emailService.js

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// This transporter uses the credentials from your .env file
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

/**
 * Sends an email for the general contact form.
 */
const sendContactEmail = async ({ subject, html, replyTo }) => {
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: replyTo,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Contact email sent successfully");
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw new Error("Failed to send email.");
  }
};

/**
 * Sends an email for the "Add Your Studio" inquiry form.
 */
const sendStudioInquiryEmail = async ({
  name,
  whatsapp,
  location,
  hasRoom,
  needsHelp,
}) => {
  const subject = "New Studio Listing Inquiry";
  const html = `
    <h1>New Studio Listing Inquiry</h1>
    <p>A new user is interested in listing their space on PodHive.</p>
    <hr>
    <h2>User Details:</h2>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>WhatsApp:</strong> ${whatsapp}</li>
      <li><strong>Location:</strong> ${location}</li>
      <li><strong>Already has a room?:</strong> ${hasRoom}</li>
      <li><strong>Needs help with setup?:</strong> ${needsHelp}</li>
    </ul>
    <hr>
    <p>Please contact them via WhatsApp to proceed with the starter plan.</p>
  `;

  const mailOptions = {
    from: `"PodHive Inquiries" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Sends the notification to your own email
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Studio inquiry email sent successfully");
  } catch (error) {
    console.error("Error sending studio inquiry email:", error);
    throw new Error("Failed to send studio inquiry email.");
  }
};

module.exports = { sendContactEmail, sendStudioInquiryEmail };
