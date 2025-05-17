const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
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
  favoriteGenres: {
    type: [String],
    default: [],
  },
  averageReadingSpeed: {
    type: Number,
    default: 0, // pages per minute
  },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);
module.exports = Analytics;
