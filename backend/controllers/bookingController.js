// controllers/bookingController.js
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const Studio = require("../models/Studio");
const sendBookingEmail = require("../utils/sendBookingEmail");

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

    // 1) Validate studio and package/add-ons
    const studio = await Studio.findById(studioId);
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

    // --- REFACTORED AVAILABILITY CHECK ---
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

    // Check if each requested hour is available
    const availableSlots = availabilityForDate.slots.filter(
      (slot) => hours.includes(slot.hour) && slot.isAvailable
    );

    if (availableSlots.length !== hours.length) {
      return res
        .status(400)
        .json({
          message: "One or more of the selected hours are not available.",
        });
    }
    // --- END OF REFACTOR ---

    // 3) Calculate total price
    const hoursCount = hours.length;
    const packageTotal = pkg.price * hoursCount;
    const totalPrice = packageTotal + addonsTotal;

    // 4) Create booking
    const booking = await Booking.create({
      studio: studioId,
      customer: req.user._id,
      date,
      hours,
      packageKey,
      addons: validAddons,
      totalPrice,
      paymentStatus,
    });

    // --- REFACTORED UPDATE OPERATION ---
    // 5) Mark availability as booked using arrayFilters
    await Availability.updateOne(
      { _id: availabilityForDate._id },
      { $set: { "slots.$[elem].isAvailable": false } },
      { arrayFilters: [{ "elem.hour": { $in: hours } }] }
    );
    // --- END OF REFACTOR ---

    // 6) Send confirmation emails
    const owner = await Studio.findById(studioId).populate(
      "author",
      "email name"
    );
    const ownerEmail = owner.author.email;
    const customerEmail = req.user.email;

    const emailBody = (recipientName, role) => `
      <h3>Hello ${recipientName},</h3>
      <p>Your booking has been ${
        role === "owner" ? "received" : "confirmed"
      }:</p>
      <ul>
        <li><strong>Studio:</strong> ${owner.name}</li>
        <li><strong>Date:</strong> ${date.toLocaleDateString()}</li>
        <li><strong>Hours:</strong> ${hours
          .map((h) => `${h}:00`)
          .join(", ")}</li>
        <li><strong>Package:</strong> ${pkg.key}</li>
        ${
          validAddons.length
            ? `<li><strong>Add-ons:</strong> ${validAddons
                .map((a) => `${a.key} x${a.quantity}`)
                .join(", ")}</li>`
            : ""
        }
        <li><strong>Total Price:</strong> ₹${totalPrice}</li>
      </ul>
      <p>Thank you,<br/>Podcast Studio Booking</p>
    `;

    await sendBookingEmail({
      to: customerEmail,
      subject: "Your Booking Confirmation",
      html: emailBody(req.user.name || "Customer", "customer"),
    });
    await sendBookingEmail({
      to: ownerEmail,
      subject: "New Booking Received",
      html: emailBody(owner.author.name || "Owner", "owner"),
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
