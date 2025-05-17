const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
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
      default: 0, // মিনিটে হিসাব করা হবে
    },
    averageReadingSpeed: {
      type: Number,
      default: 0, // মিনিট প্রতি বই
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

module.exports = mongoose.model("Analytics", analyticsSchema);
