const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Adjust path if needed
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser and useUnifiedTopology are deprecated but won't cause errors
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const seedAdminUser = async () => {
  try {
    const adminEmail = "care.podhive@gmail.com";

    // Check for existing Admin user
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // Hash the default password
      const hashedPassword = await bcrypt.hash("Podhive$tudios@123", 10);

      // Create the admin user
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        userType: "admin",
        isVerified: true, // Assuming the admin should be verified by default
        phone: "7508570007", // Placeholder phone number
      });
      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close().then(() => {
      console.log("MongoDB connection closed.");
    });
  }
};

// Run the seeder function
seedAdminUser();
