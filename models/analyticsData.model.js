const mongoose = require("mongoose");

const analyticsDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booksRead: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 0, // in minutes
    },
    averageReadingSpeed: {
      type: Number,
      default: 0, // pages per minute
    },
    favoriteGenres: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("AnalyticsData", analyticsDataSchema);
