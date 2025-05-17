const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    customColors: {
      background: { type: String, default: "#ffffff" },
      text: { type: String, default: "#000000" },
      accent: { type: String, default: "#6200ea" },
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("UserSettings", userSettingsSchema);
