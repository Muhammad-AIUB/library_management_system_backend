const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    pagesRead: {
      type: Number,
      required: true,
      min: 0,
    },
    timeSpent: {
      type: Number, // In minutes
      required: true,
      min: 0,
    },
    readingSpeed: {
      type: Number, // Pages per minute
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  { _id: true }
);

const readingProgressSchema = new mongoose.Schema(
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
    startDate: {
      type: Date,
      default: Date.now,
    },
    lastReadDate: {
      type: Date,
      default: Date.now,
    },
    pagesRead: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPages: {
      type: Number,
      required: true,
      min: 1,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    avgReadingSpeed: {
      type: Number, // Pages per minute
      default: 0,
    },
    estimatedTimeToComplete: {
      type: Number, // In minutes
      default: 0,
    },
    sessionsLog: [sessionSchema],
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "abandoned"],
      default: "not_started",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index to ensure a user can have only one progress entry per book
readingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

// Update status based on completion percentage
readingProgressSchema.pre("save", function (next) {
  if (this.completionPercentage === 0) {
    this.status = "not_started";
  } else if (this.completionPercentage >= 100) {
    this.status = "completed";
  } else {
    this.status = "in_progress";
  }
  next();
});

module.exports = mongoose.model("ReadingProgress", readingProgressSchema); 