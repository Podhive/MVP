// models/Review.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const ReviewSchema = new Schema(
  {
    studio: { type: Schema.Types.ObjectId, ref: "Studio", required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);
ReviewSchema.index({ studio: 1, reviewer: 1 }, { unique: true });
module.exports = mongoose.model("Review", ReviewSchema);
