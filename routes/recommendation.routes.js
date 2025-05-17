const express = require("express");
const router = express.Router();
const {
  generateRecommendations,
  getRecommendations,
  rateRecommendation
} = require("../controllers/recommendation.controller");

// 📚 Generate Personalized Recommendations
router.get("/generate/:userId", generateRecommendations);

// 📜 Get Recommendations for a User
router.get("/:userId", getRecommendations);

// 👍 Rate Recommendation Quality
router.post("/rate", rateRecommendation);

module.exports = router;
