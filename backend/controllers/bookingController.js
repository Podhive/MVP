const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const Studio = require("../models/Studio");
const User = require("../models/User"); // Import User model
const {
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
} = require("../utils/email");

// Create booking
const createBooking = async (req, res) => {
  try {
    const {
      studio: studioId,
      date: dateStr,
      hours,
      packageKey,
      addons,
      paymentStatus,
    } = req.body;

    const date = new Date(dateStr);
    const customer = req.user; // Get customer from auth middleware

    // 1) Validate studio and package/add-ons
    const studio = await Studio.findById(studioId).populate("author");
    if (!studio || !studio.approved) {
      return res
        .status(404)
        .json({ message: "Studio not found or not approved" });
    }
    const pkg = studio.packages.find((p) => p.key === packageKey);
    if (!pkg) {
      return res.status(400).json({ message: "Invalid package selection" });
    }
    let addonsTotal = 0;
    const validAddons = [];
    if (Array.isArray(addons)) {
      for (const a of addons) {
        const master = studio.addons.find((x) => x.key === a.key);
        if (!master) {
          return res.status(400).json({ message: `Invalid add-on: ${a.key}` });
        }
        if (a.quantity < 1 || a.quantity > master.maxQuantity) {
          return res.status(400).json({
            message: `Quantity for ${a.key} must be 1–${master.maxQuantity}`,
          });
        }
        addonsTotal += master.price * a.quantity;
        validAddons.push({ key: master.key, quantity: a.quantity });
      }
    }

    // 2) Check availability for the specific date
    const availabilityForDate = await Availability.findOne({
      studio: studioId,
      date,
    });
    if (!availabilityForDate) {
      return res
        .status(400)
        .json({ message: "No availability for this date." });
    }

    const availableSlots = availabilityForDate.slots.filter(
      (slot) => hours.includes(slot.hour) && slot.isAvailable
    );
    if (availableSlots.length !== hours.length) {
      return res.status(400).json({
        message: "One or more of the selected hours are not available.",
      });
    }

    // 3) Calculate total price
    const hoursCount = hours.length;
    const packageTotal = pkg.price * hoursCount;
    const totalPrice = packageTotal + addonsTotal;

    // 4) Create booking
    const booking = await Booking.create({
      studio: studioId,
      customer: customer._id,
      date,
      hours,
      packageKey,
      addons: validAddons,
      totalPrice,
      paymentStatus,
    });

    // 5) Mark availability as booked
    await Availability.updateOne(
      { _id: availabilityForDate._id },
      { $set: { "slots.$[elem].isAvailable": false } },
      { arrayFilters: [{ "elem.hour": { $in: hours } }] }
    );

    // --- 6) UPDATED EMAIL LOGIC ---
    // Send confirmation to customer (content creator)
    await sendBookingConfirmationEmail({
      to: customer.email,
      details: {
        customerName: customer.name,
        studioName: studio.name,
        ownerName: studio.author.name,
        ownerPhone: studio.author.phone,
        studioLocation: `${studio.location.fullAddress}, ${studio.location.city}`,
        bookingDate: date,
        slotTimings: hours,
        duration: hours.length,
        packageEquipment: pkg.equipment, // Pass equipment list
      },
    });

    // Send notification to owner
    await sendBookingNotificationEmail({
      to: studio.author.email,
      details: {
        ownerName: studio.author.name,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        studioName: studio.name,
        bookingDate: date,
        slotTimings: hours,
        duration: hours.length,
        packageEquipment: pkg.equipment, // Pass equipment list
      },
    });

    return res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET bookings by customer
const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("studio", "name location")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to fetch customer bookings" });
  }
};

// GET bookings for owner
const getOwnerBookings = async (req, res) => {
  try {
    const studios = await Studio.find({ author: req.user._id }).select("_id");
    const studioIds = studios.map((s) => s._id);
    const bookings = await Booking.find({ studio: { $in: studioIds } })
      .populate("studio", "name location")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch owner bookings" });
  }
};

module.exports = { createBooking, getCustomerBookings, getOwnerBookings };
