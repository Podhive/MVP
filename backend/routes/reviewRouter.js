const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByStudio,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/protect");

// Create a review
router.post("/", protect, createReview);

// Get all reviews for a studio
router.get("/studio/:studioId", getReviewsByStudio);

// Update a review (by the same user)
router.put("/:reviewId", protect, updateReview);

// Delete a review (by the same user)
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
