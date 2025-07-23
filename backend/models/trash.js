//models/Availability.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const AvailabilitySchema = new Schema(
  {
    studio: { type: Schema.Types.ObjectId, ref: "Studio", required: true },
    date: { type: Date, required: true },
    slot: {
      type: String,
      enum: ["morning", "noon", "evening"],
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);
AvailabilitySchema.index({ studio: 1, date: 1, slot: 1 }, { unique: true });
module.exports = mongoose.model("Availability", AvailabilitySchema);

// models/Booking.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    studio: { type: Schema.Types.ObjectId, ref: "Studio", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    slot: {
      type: String,
      enum: ["morning", "noon", "evening"],
      required: true,
    },
    totalPrice: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["paid", "payAtStudio"],
      default: "payAtStudio",
      required: true,
    },
  },
  { timestamps: true }
);

BookingSchema.index({ studio: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model("Booking", BookingSchema);

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

// models/Studio.js
// models/Studio.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const PricingSchema = new Schema(
  { morning: Number, noon: Number, evening: Number },
  { _id: false }
);
const RatingSummarySchema = new Schema(
  {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);
const LocationSchema = new Schema({
  fullAddress: String,
  city: String,
  state: String,
  pinCode: String,
});
const StudioSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    equipments: [{ type: String }],
    pricePerHour: { type: Number },
    pricing: PricingSchema,
    images: [{ type: String }],
    location: LocationSchema,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    ratingSummary: RatingSummarySchema,
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Studio", StudioSchema);

//models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    userType: {
      type: String,
      enum: ["owner", "admin", "customer"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    emailOtp: { type: String },
    phoneOtp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false }, // <-- added here
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
