const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    ratedAt: {
      type: Date,
      default: Date.now,
    }
  }, 
  { _id: true }
);

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    genres: {
      type: [String],
      default: [],
    },
    authors: {
      type: [String],
      default: [],
    },
    ratings: [ratingSchema],
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
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

// Index to ensure efficient lookup by user
recommendationSchema.index({ user: 1 });

module.exports = mongoose.model("Recommendation", recommendationSchema);
