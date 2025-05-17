const express = require("express");
const router = express.Router();
const {
  createRecommendation,
  getRecommendations,
} = require("../controllers/recommendation.controller");

// 📝 Create or Update Recommendation
router.post("/", createRecommendation);

// 📜 Get Recommendations for a User
router.get("/:userId", getRecommendations);

module.exports = router;
