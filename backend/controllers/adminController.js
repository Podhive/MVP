const Studio = require("../models/Studio");
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");

// GET /admin/studios/pending
const getPendingStudios = async (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const studios = await Studio.find({ approved: false });
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

    res.json({ message: "Studio approved", studio });
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
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const { studio, date, slot } = booking;

    // await booking.remove();
    await Booking.deleteOne({ _id: booking._id });

    await Availability.create({
      studio,
      date,
      slot,
      isAvailable: true,
    });

    res.json({ message: "Booking deleted and slot restored" });
  } catch (error) {
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
