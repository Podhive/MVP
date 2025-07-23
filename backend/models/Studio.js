// models/Studio.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Package schema (exactly one required at booking)
const PackageSchema = new Schema(
  {
    key: { type: String, required: true }, // e.g. "1 Camera Setup"
    price: { type: Number, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

// Add-On Service schema
const AddOnSchema = new Schema(
  {
    key: { type: String, required: true }, // e.g. "Podcast Edit Full"
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    maxQuantity: { type: Number, default: 1 }, // for services you can pick multiples
  },
  { _id: false }
);

// Rating summary schema
const RatingSummarySchema = new Schema(
  {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

// Location schema
const LocationSchema = new Schema(
  {
    fullAddress: String,
    city: String,
    state: String,
    pinCode: String,
  },
  { _id: false }
);

// Studio schema\ n
const StudioSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    equipments: [{ type: String }],
    images: [{ type: String }],
    location: LocationSchema,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    ratingSummary: RatingSummarySchema,
    approved: { type: Boolean, default: false },

    // New fields
    pricePerHour: { type: Number, required: true },
    operationalHours: {
      start: { type: Number, required: true, min: 0, max: 23 },
      end: { type: Number, required: true, min: 1, max: 24 },
    },
    packages: [PackageSchema], // exactly three expected
    addons: [AddOnSchema], // zero or more
  },
  { timestamps: true }
);

module.exports = mongoose.model("Studio", StudioSchema);
