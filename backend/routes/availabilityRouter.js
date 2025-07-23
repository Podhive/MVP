const express = require("express");

const router = express.Router();
const { protect } = require("../middlewares/protect");
const { getAvailableSlots } = require("../controllers/availabilityController");

router.get("/:studioId", protect, getAvailableSlots);

module.exports = router;
