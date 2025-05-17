const express = require("express");
const router = express.Router();
const {
  createBookNote,
  getBookNotes,
  deleteBookNote,
} = require("../controllers/bookNote.controller");

// 📝 Create a new Book Note
router.post("/", createBookNote);

// 📜 Get Notes for a Book
router.get("/:bookId", getBookNotes);

// 🗑️ Delete a Book Note
router.delete("/:noteId", deleteBookNote);

module.exports = router;
