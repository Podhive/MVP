// This script sets minimumDurationHours to 1 for all existing studios that lack the field.
// Run from your project root: node -r dotenv/config scripts/backfillMinimumDuration.js

const mongoose = require("mongoose");
const Studio = require("../models/Studio"); // Adjust path to your model if needed
require("dotenv").config();

const migration = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found in .env file. Aborting.");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected.");

    const result = await Studio.updateMany(
      { minimumDurationHours: { $exists: false } },
      { $set: { minimumDurationHours: 1 } }
    );

    console.log("--- Migration Report ---");
    console.log(
      `✅ Documents scanned for missing field: ${result.matchedCount}`
    );
    console.log(
      `✅ Documents updated with default value: ${result.modifiedCount}`
    );
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

console.log("--- Starting Studio Schema Migration ---");
migration();
