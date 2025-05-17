require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Initialize Express App
const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Connect to Database
connectDB();

// Routes
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/analytics/data", require("./routes/analyticsData.routes"));
app.use(
  "/api/analytics/dashboard",
  require("./routes/analyticsDashboard.routes")
);
app.use("/api/books", require("./routes/books.routes"));
app.use("/api/notifications", require("./routes/notifications.routes"));
app.use("/api/reading-progress", require("./routes/readingProgress.routes")); // ✅ Updated
app.use("/api/goals", require("./routes/goals.routes"));
app.use("/api/recommendations", require("./routes/recommendations.routes"));
app.use("/api/summaries", require("./routes/summaries.routes"));

// Default Route
app.get("/", (req, res) => {
  res.send("📚 Library Management System API is Running...");
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
