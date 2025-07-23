const Review = require("../models/Review");

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { studio, rating, description } = req.body;

  if (!studio || !rating || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingReview = await Review.findOne({
      studio,
      reviewer: req.user._id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this studio" });
    }

    const review = await Review.create({
      studio,
      reviewer: req.user._id,
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
