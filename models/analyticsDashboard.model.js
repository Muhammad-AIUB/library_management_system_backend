const mongoose = require("mongoose");

const dashboardAnalyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    readingTime: {
      type: Number, // minutes spent reading
      default: 0,
    },
    genre: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("DashboardAnalytics", dashboardAnalyticsSchema);
