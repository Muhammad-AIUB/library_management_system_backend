const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    type: {
      type: String,
      enum: ["reading_reminder", "goal_reminder", "achievement", "system", "custom"],
      default: "system",
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      // This can reference different collections based on the refType
    },
    refType: {
      type: String,
      enum: ["book", "reading_goal", "reading_progress", "user"],
    },
    action: {
      type: String,
      // e.g., "open_book", "view_goal", etc.
    },
    actionData: {
      type: mongoose.Schema.Types.Mixed,
      // Additional data needed for the action
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    expireAt: {
      type: Date,
      // Optional expiration date
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

// Create indexes for better performance
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

// Add TTL index if notification should expire
notificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Update readAt when notification is marked as read
notificationSchema.pre('save', function(next) {
  if (this.isModified('read') && this.read) {
    this.readAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Notification", notificationSchema);
