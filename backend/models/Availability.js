// models/Availability.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const TimeSlotSchema = new Schema({
  hour: { type: Number, required: true, min: 0, max: 23 },
  isAvailable: { type: Boolean, default: true },
});

const AvailabilitySchema = new Schema(
  {
    studio: { type: Schema.Types.ObjectId, ref: "Studio", required: true },

    // Each document represents availability for a single date
    date: { type: Date, required: true },

    // Array of hourly slots on that date
    slots: { type: [TimeSlotSchema], required: true },
  },
  { timestamps: true }
);

// Ensure one availability entry per studio per date
AvailabilitySchema.index({ studio: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Availability", AvailabilitySchema);
