const Review = require("../models/Review");
const Booking = require("../models/Booking"); // Import the Booking model

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { studio, rating, description } = req.body;
  const reviewerId = req.user._id;

  if (!studio || !rating || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Check if the user has already reviewed this studio
    const existingReview = await Review.findOne({
      studio,
      reviewer: reviewerId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this studio" });
    }

    // 2. Check if the user has a completed past booking for this studio
    const pastBooking = await Booking.findOne({
      studio,
      customer: reviewerId,
      date: { $lt: new Date() }, // Check if the booking date is in the past
    });

    if (!pastBooking) {
      return res.status(403).json({
        message: "You can only review studios you have a past booking with.",
      });
    }

    // 3. If both checks pass, create the new review
    const review = await Review.create({
      studio,
      reviewer: reviewerId,
      rating,
      description,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a specific studio
// @route   GET /api/reviews/studio/:studioId
// @access  Public
const getReviewsByStudio = async (req, res) => {
  try {
    const reviews = await Review.find({ studio: req.params.studioId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
  const { rating, description } = req.body;

  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.description = description || review.description;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }
    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByStudio,
  updateReview,
  deleteReview,
};
