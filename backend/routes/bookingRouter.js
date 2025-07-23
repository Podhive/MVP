// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/protect");
const {
  createBooking,
  getCustomerBookings,
  getOwnerBookings,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/customer", protect, getCustomerBookings);
router.get("/owner", protect, getOwnerBookings);

module.exports = router;
