const mongoose = require("mongoose");

const readingGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["books", "pages", "time"],
      default: "books",
      required: true,
    },
    targetBooks: {
      type: Number,
      min: [1, "Target books must be at least 1"],
    },
    targetPages: {
      type: Number,
      min: [1, "Target pages must be at least 1"]
    },
    targetMinutes: {
      type: Number,
      min: [1, "Target reading time must be at least 1 minute"]
    },
    duration: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "custom"],
      required: [true, "Duration is required"],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedBooks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }],
    status: {
      type: String,
      enum: ["active", "completed", "failed", "abandoned"],
      default: "active"
    },
    streakDays: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
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

// Calculate end date based on duration and start date
readingGoalSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('duration') || this.isModified('startDate')) {
    const startDate = this.startDate;
    let endDate = new Date(startDate);
    
    if (this.duration === 'daily') {
      endDate.setDate(startDate.getDate() + 1);
    } else if (this.duration === 'weekly') {
      endDate.setDate(startDate.getDate() + 7);
    } else if (this.duration === 'monthly') {
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (this.duration === 'yearly') {
      endDate.setFullYear(startDate.getFullYear() + 1);
    }
    
    // Only set end date if not already set for custom durations
    if (this.duration !== 'custom' || !this.endDate) {
      this.endDate = endDate;
    }
  }
  
  next();
});

module.exports = mongoose.model("ReadingGoal", readingGoalSchema);
