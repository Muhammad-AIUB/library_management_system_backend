const express = require("express");
const router = express.Router();
const {
  updateTheme,
  getUserTheme,
  resetTheme,
} = require("../controllers/theme.controller");

// 🎨 Update Theme
router.put("/", updateTheme);

// 🌙 Get User Theme
router.get("/:userId", getUserTheme);

// 🔄 Reset Theme
router.put("/reset/:userId", resetTheme);

module.exports = router;
