const express = require("express");
const router = express.Router();
const {
  getDashboardOverview,
  getReadingProgressAnalysis,
  getGenreAnalysis,
  getReadingTimeAnalysis
} = require("../controllers/analyticsDashboard.controller");

// 📊 Dashboard Overview
router.get("/overview/:userId", getDashboardOverview);

// 📈 Reading Progress Analysis with Visualization Data
router.get("/progress/:userId", getReadingProgressAnalysis);

// 📚 Genre Analysis with Chart Data
router.get("/genre/:userId", getGenreAnalysis);

// 📅 Reading Time Analysis with Heatmap
router.get("/time/:userId", getReadingTimeAnalysis);

module.exports = router;
