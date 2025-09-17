const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Configure the core email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
  },
});

/**
 * A generic email sending function to avoid repetition.
 * @param {object} mailOptions - Options for nodemailer's sendMail.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail({
      from: `"Podhive" <${process.env.EMAIL_USER}>`,
      ...mailOptions,
    });
    console.log(`Email sent successfully to ${mailOptions.to}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${mailOptions.to}:`, error);
    return false;
  }
};

/**
 * Sends a verification OTP email to a new user.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The one-time password.
 * @returns {Promise<boolean>} - The result from sendEmail.
 */
const sendOtpEmail = async ({ to, otp }) => {
  const subject = "Your Verification Code for Podhive";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello,</h2>
      <p>Thank you for registering with Podhive. Please use the verification code below to complete your registration.</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">${otp}</p>
      <p>This code will expire in 15 minutes.</p>
      <p>Best regards,<br/>The Podhive Team</p>
    </div>
  `;
  return await sendEmail({ to, subject, html });
};

/**
 * Sends a booking confirmation email to the customer (Content Creator).
 * @param {string} to - The customer's email address.
 * @param {object} details - The booking details.
 * @returns {Promise<boolean>}
 */
const sendBookingConfirmationEmail = async ({ to, details }) => {
  const subject = "🎙️ Your PodHive Studio Booking is Confirmed!";
  const formattedTime = details.slotTimings
    .sort((a, b) => a - b)
    .map((h) => `${h}:00 - ${h + 1}:00`)
    .join(", ");
  const formattedDate = new Date(details.bookingDate).toLocaleDateString();

  // ✅ FIX: Safely handle the equipment list
  const equipmentList =
    Array.isArray(details.packageEquipment) && details.packageEquipment.length
      ? details.packageEquipment.join(", ")
      : "Not specified";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #1a1a1a;">Hi ${details.customerName},</h2>
      <p>Thank you for booking with PodHive! Your studio reservation has been successfully confirmed. Below are your booking details:</p>
      
      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Booking Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold;">Studio Name:</td><td style="padding: 8px 0;">${details.studioName}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Contact Person:</td><td style="padding: 8px 0;">${details.ownerName}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Phone Number:</td><td style="padding: 8px 0;">${details.ownerPhone}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Location:</td><td style="padding: 8px 0;">${details.studioLocation}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Booking Date & Time:</td><td style="padding: 8px 0;">${formattedDate} at ${formattedTime}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td style="padding: 8px 0;">${details.duration} hour(s)</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Buffer Time:</td><td style="padding: 8px 0;">15 minutes before & after session</td></tr>
      </table>

      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Important Information</h3>
      <ul>
          <li><strong>Overtime Charges:</strong> If your session extends beyond the booked hours, overtime charges will apply as per studio rates.</li>
          <li><strong>Equipment Included:</strong> ${equipmentList}.</li>
      </ul>

      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">PodHive Standard Cancellation Policy</h3>
      <ul>
          <li><strong>Cancel more than 24 hours before booking:</strong> Full refund.</li>
          <li><strong>Cancel between 06–24 hours before booking:</strong> 50% refund or free one-time reschedule (subject to availability).</li>
          <li><strong>Cancel less than 06 hours before booking or no-show:</strong> Non-refundable.</li>
          <li><strong>Rescheduling within 24 hours:</strong> At studio owner’s discretion; additional charges may apply.</li>
          <li>Refunds (if applicable) will be processed within 5–7 business days to your original payment method.</li>
      </ul>

      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Need Help?</h3>
      <p>For any assistance, contact us at <strong>support@podhive.in</strong> or call [Support Phone Number].</p>
      <p>We’re excited to be part of your creative journey. 🎧</p>
      <p><em>Your voice. Our hive. Let’s create something unforgettable.</em></p>
      <p>Warm regards,<br/>Team PodHive</p>
    </div>
  `;
  return await sendEmail({ to, subject, html });
};

/**
 * Sends a new booking notification email to the studio owner.
 * @param {string} to - The studio owner's email address.
 * @param {object} details - The booking details.
 * @returns {Promise<boolean>}
 */
const sendBookingNotificationEmail = async ({ to, details }) => {
  const subject = "✅ New Booking Confirmed for Your Studio on PodHive";
  const formattedTime = details.slotTimings
    .sort((a, b) => a - b)
    .map((h) => `${h}:00 - ${h + 1}:00`)
    .join(", ");
  const formattedDate = new Date(details.bookingDate).toLocaleDateString();

  // ✅ FIX: Safely handle the equipment list
  const equipmentList =
    Array.isArray(details.packageEquipment) && details.packageEquipment.length
      ? details.packageEquipment.join(", ")
      : "N/A";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #1a1a1a;">Hi ${details.ownerName},</h2>
      <p>You’ve received a new booking through PodHive. Please find the details below:</p>
      
      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Booking Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold;">Content Creator’s Name:</td><td style="padding: 8px 0;">${details.customerName}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Phone Number / Contact:</td><td style="padding: 8px 0;">${details.customerPhone}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Email ID:</td><td style="padding: 8px 0;">${details.customerEmail}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Studio Booked:</td><td style="padding: 8px 0;">${details.studioName}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Booking Date & Time:</td><td style="padding: 8px 0;">${formattedDate} at ${formattedTime}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td style="padding: 8px 0;">${details.duration} hour(s)</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Buffer Time:</td><td style="padding: 8px 0;">15 minutes before & after session</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Equipment Requested:</td><td style="padding: 8px 0;">${equipmentList}</td></tr>
      </table>

      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Important Notes</h3>
      <ul>
          <li>Please ensure your studio is ready and accessible at least 15 minutes before the booking start time.</li>
          <li>Maintain buffer time before and after each booking to avoid overlaps.</li>
          <li>Any overtime usage beyond the booked hours should be recorded and charged as per your listed rates.</li>
      </ul>

      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">PodHive Standard Cancellation Policy</h3>
      <ul>
          <li><strong>If the guest cancels more than 24 hours before the booking:</strong> Full refund to the guest.</li>
          <li><strong>If the guest cancels between 06–24 hours before the booking:</strong> 50% refund or one-time reschedule (subject to your studio availability).</li>
          <li><strong>If the guest cancels less than 06 hours before the booking or is a no-show:</strong> No refund.</li>
          <li><strong>If you (the studio) cancel a confirmed booking:</strong> The guest will receive a 100% refund, and repeated cancellations may lead to penalties, reduced visibility, or suspension from PodHive.</li>
      </ul>

      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Need Help?</h3>
      <p>For questions or support, contact us at <strong>support@podhive.in</strong> or call [Support Phone Number].</p>
      <p>Thank you for being part of the PodHive community. Together, we’re making content creation seamless and professional.</p>
      <p>Warm regards,<br/>Team PodHive</p>
    </div>
  `;
  return await sendEmail({ to, subject, html });
};

/**
 * Sends a studio approval email to the owner.
 * @param {string} to - The studio owner's email address.
 * @param {string} studioName - The name of the approved studio.
 * @returns {Promise<boolean>}
 */
const sendStudioApprovalEmail = async ({ to, studioName }) => {
  const subject = `Congratulations! Your Studio "${studioName}" is Approved!`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello,</h2>
      <p>Congratulations! Your studio, <strong>${studioName}</strong>, has been approved.</p>
      <p>Your studio is now live on the Podhive platform. You can now log in to your dashboard to manage your bookings.</p>
      <p>Best regards,<br/>The Podhive Team</p>
    </div>
  `;
  return await sendEmail({ to, subject, html });
};

/**
 * Sends an email for the general contact form.
 * @param {object} details - The contact form details.
 * @returns {Promise<boolean>}
 */
const sendContactEmail = async ({ subject, html, replyTo }) => {
  return await sendEmail({
    to: process.env.EMAIL_USER,
    subject,
    html,
    replyTo,
  });
};

/**
 * Sends an email for the "Add Your Studio" inquiry form.
 * @param {object} details - The inquiry form details.
 * @returns {Promise<boolean>}
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
  `;
  return await sendEmail({
    to: process.env.EMAIL_USER,
    subject,
    html,
  });
};

/**
 * Sends a password reset OTP email.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The one-time password for reset.
 * @returns {Promise<boolean>}
 */
const sendPasswordResetEmail = async ({ to, otp }) => {
  const subject = "Your Password Reset Code";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello,</h2>
      <p>We received a request to reset your password for your Podhive account.</p>
      <p>Use the code below to complete the process:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">${otp}</p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Best regards,<br/>The Podhive Team</p>
    </div>
  `;
  return await sendEmail({ to, subject, html });
};

module.exports = {
  sendOtpEmail,
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
  sendStudioApprovalEmail,
  sendContactEmail,
  sendStudioInquiryEmail,
  sendPasswordResetEmail,
};
