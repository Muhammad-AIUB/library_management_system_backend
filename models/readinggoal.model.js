const mongoose = require("mongoose");

const readingGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetBooks: {
      type: Number,
      required: [true, "Target books is required"],
      min: [1, "Target books must be at least 1"],
    },
    duration: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: [true, "Duration is required"],
    },
    progress: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("ReadingGoal", readingGoalSchema);
