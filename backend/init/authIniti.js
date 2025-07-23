const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Adjust path if needed

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const seedUsers = async () => {
  try {
    const adminEmail = "care.podhive@gmail.com";
    const userEmail = "tanishqvats620@gmail.com";
    const ownerEmail = "tanishqvats2804@gmail.com";

    // Check for existing Admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        userType: "admin",
        isVerified: true,
        phone: "9999999999",
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    // Check for existing Normal User
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await User.create({
        name: "Normal User",
        email: userEmail,
        password: hashedPassword,
        userType: "customer",
        isVerified: true,
        phone: "8888888888",
      });
      console.log(" Normal user created");
    } else {
      console.log("Normal user already exists");
    }

    // Check for existing Owner User
    const existingOwner = await User.findOne({ email: ownerEmail });
    if (!existingOwner) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await User.create({
        name: "Owner User",
        email: ownerEmail,
        password: hashedPassword,
        userType: "owner",
        isVerified: true,
        phone: "7777777777",
      });
      console.log("Owner user created");
    } else {
      console.log("Owner user already exists");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding users:", error);
    mongoose.connection.close();
  }
};

seedUsers();
