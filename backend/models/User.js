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
    isVerified: { type: Boolean, default: false },

    // Fields for Password Reset
    passwordResetOtp: { type: String },
    passwordResetExpires: { type: Date },
    passwordResetAttempts: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
