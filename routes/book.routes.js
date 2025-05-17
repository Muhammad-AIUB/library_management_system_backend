const express = require("express");
const router = express.Router();
const {
  searchExternalBooks,
  getExternalBookDetails,
} = require("../controllers/book.controller");

// 🔍 Search Books by Query
router.get("/search", searchExternalBooks);

// 📖 Get Book Details by ID
router.get("/details/:bookId", getExternalBookDetails);

module.exports = router;
