const Studio = require("../models/Studio");
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const User = require("../models/User"); // Import User model
const { sendStudioApprovalEmail } = require("../utils/email"); // Import the new email function

// GET /admin/studios/pending
const getPendingStudios = async (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const studios = await Studio.find({ approved: false }).populate(
      "author",
      "name email"
    );
    res.json(studios);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending studios" });
  }
};

// PUT /admin/studios/:id/approve
const approveStudio = async (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: "Studio not found" });

    studio.approved = true;
    await studio.save();

    // --- ADDED: Send approval email to studio owner ---
    const owner = await User.findById(studio.author);
    if (owner) {
      await sendStudioApprovalEmail({
        to: owner.email,
        studioName: studio.name,
      });
    }

    res.json({ message: "Studio approved and owner notified", studio });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve studio" });
  }
};

// DELETE /admin/bookings/:id
const deleteBooking = async (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Availability.updateOne(
      { studio: booking.studio, date: booking.date },
      { $set: { "slots.$[elem].isAvailable": true } },
      { arrayFilters: [{ "elem.hour": { $in: booking.hours } }] }
    );

    await Booking.deleteOne({ _id: req.params.id });

    res.json({ message: "Booking deleted and slots restored" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};

// GET /admin/bookings
const getAllBookings = async (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const bookings = await Booking.find()
      .populate("studio", "name location")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
// DELETE /admin/studios/:id/deny
const denyStudio = async (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: "Studio not found" });

    await studio.deleteOne();

    res.json({ message: "Studio request denied and removed from database" });
  } catch (error) {
    res.status(500).json({ message: "Failed to deny studio" });
  }
};

module.exports = {
  getPendingStudios,
  approveStudio,
  deleteBooking,
  getAllBookings,
  denyStudio,
};
