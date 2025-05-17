const express = require("express");
const router = express.Router();
const {
  getReadingProgress,
  getGenreAnalysis,
  getReadingTimeAnalysis,
} = require("../controllers/analyticsDashboard.controller");

// 📊 Reading Progress Analysis
router.get("/progress/:userId", getReadingProgress);

// 📚 Genre Analysis
router.get("/genre/:userId", getGenreAnalysis);

// 📅 Reading Time Analysis
router.get("/time/:userId/:period", getReadingTimeAnalysis);

module.exports = router;
