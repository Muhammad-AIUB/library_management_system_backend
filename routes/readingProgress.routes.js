const express = require("express");
const router = express.Router();
const {
  trackProgress,
  getProgress,
  getAllProgress,
  getReadingStats
} = require("../controllers/readingProgress.controller");

// Track reading progress
router.post("/track", trackProgress);

// Get reading progress for a specific book
router.get("/:userId/:bookId", getProgress);

// Get all reading progress for a user
router.get("/user/:userId", getAllProgress);

// Get reading statistics for a user
router.get("/stats/:userId", getReadingStats);

module.exports = router;
