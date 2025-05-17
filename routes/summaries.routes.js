const express = require("express");
const router = express.Router();
const {
  createSummary,
  getUserSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary,
} = require("../controllers/summaries.controller");

// 📝 Create a New Summary
router.post("/", createSummary);

// 📜 Get All Summaries of a User
router.get("/:userId", getUserSummaries);

// 📘 Get Summary by ID
router.get("/summary/:id", getSummaryById);

// ✏️ Update Summary
router.put("/:id", updateSummary);

// 🗑️ Delete Summary
router.delete("/:id", deleteSummary);

module.exports = router;
