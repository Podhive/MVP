// init.js
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const Studio = require("../models/Studio");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  await Studio.deleteMany({});

  mongoose.disconnect();
}

seed().catch(console.error);
