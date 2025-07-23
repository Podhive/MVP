// models/Booking.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddOnSelectionSchema = new Schema(
  {
    key: { type: String, required: true }, // matches Studio.addons.key
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const BookingSchema = new Schema(
  {
    studio: { type: Schema.Types.ObjectId, ref: "Studio", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    hours: [{ type: Number, min: 0, max: 23, required: true }],
    packageKey: { type: String, required: true },
    addons: [AddOnSelectionSchema],
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

// We no longer index on 'slot'; availability prevents double-booking
module.exports = mongoose.model("Booking", BookingSchema);
