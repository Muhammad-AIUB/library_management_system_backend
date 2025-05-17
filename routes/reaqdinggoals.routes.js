const express = require("express");
const router = express.Router();
const {
  createReadingGoal,
  getUserReadingGoals,
  getActiveReadingGoals,
  getReadingGoalById,
  updateReadingGoal,
  updateGoalProgress,
  abandonGoal,
  deleteReadingGoal,
  getGoalStatistics
} = require("../controllers/readinggoals.controller");

// 📊 Create Reading Goal
router.post("/", createReadingGoal);

// 📚 Get User's Reading Goals
router.get("/user/:userId", getUserReadingGoals);

// 📘 Get Active Reading Goals
router.get("/active/:userId", getActiveReadingGoals);

// 📊 Get Reading Goal by ID
router.get("/:id", getReadingGoalById);

// 📊 Get User Goal Statistics
router.get("/stats/:userId", getGoalStatistics);

// ✏️ Update Reading Goal
router.put("/:id", updateReadingGoal);

// 📈 Update Goal Progress
router.post("/progress", updateGoalProgress);

// 🚫 Abandon Reading Goal
router.put("/abandon/:goalId", abandonGoal);

// 🗑️ Delete Reading Goal
router.delete("/:id", deleteReadingGoal);

module.exports = router;
