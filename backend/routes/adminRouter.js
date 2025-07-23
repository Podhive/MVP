const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/protect");
const {
  getPendingStudios,
  approveStudio,
  deleteBooking,
  getAllBookings,
  denyStudio,
} = require("../controllers/adminController");

router.use(protect); // all admin routes are protected

router.get("/studios/pending", getPendingStudios);
router.put("/studios/:id/approve", approveStudio);
router.delete("/bookings/:id", deleteBooking);
router.get("/bookings", getAllBookings);
router.delete("/studios/:id/deny", denyStudio);
module.exports = router;
