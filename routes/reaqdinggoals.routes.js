const express = require("express");
const router = express.Router();
const {
  createReadingGoal,
  getAllReadingGoals,
  getReadingGoalById,
  updateReadingGoal,
  deleteReadingGoal,
} = require("../controllers/readinggoals.controller");

// 📝 Create Reading Goal
router.post("/", createReadingGoal);

// 📜 Get All Reading Goals
router.get("/", getAllReadingGoals);

// 📘 Get Single Reading Goal
router.get("/:id", getReadingGoalById);

// ✏️ Update Reading Goal
router.put("/:id", updateReadingGoal);

// 🗑️ Delete Reading Goal
router.delete("/:id", deleteReadingGoal);

module.exports = router;
