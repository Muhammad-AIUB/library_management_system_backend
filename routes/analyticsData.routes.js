const express = require("express");
const router = express.Router();
const {
  updateAnalytics,
  getAnalyticsData,
} = require("../controllers/analyticsData.controller");

// 📝 Update Analytics Data
router.post("/", updateAnalytics);

// 📜 Get User Analytics Data
router.get("/:userId", getAnalyticsData);

module.exports = router;
