const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ Import CORS
const connectDB = require("./config/db");

const bookingRouter = require("./routes/bookingRouter");
const userRouter = require("./routes/userRouter");
const studioRouter = require("./routes/studioRouter");
const adminRouter = require("./routes/adminRouter");
const reviewRouter = require("./routes/reviewRouter");
const availabilityRouter = require("./routes/availabilityRouter");
const contactRoutes = require("./routes/contactRoutes.js");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://guileless-baklava-1da36e.netlify.app",
//     ],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Origin",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
// Middleware
app.use(express.json());

// Connect to database
connectDB();

// API Routes
app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/studio", studioRouter);
app.use("/api/admin", adminRouter);
app.use("/api/review", reviewRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api", contactRoutes);
// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
