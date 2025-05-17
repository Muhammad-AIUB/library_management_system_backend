const {
  searchBooks,
  getBookDetails,
} = require("../services/googlebooks.service");

// 🔍 Search Books from Google Books API
const searchExternalBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    const books = await searchBooks(query);
    res.status(200).json({ data: books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📖 Get Book Details by Google Books ID
const getExternalBookDetails = async (req, res) => {
  try {
    const { bookId } = req.params;
    const bookDetails = await getBookDetails(bookId);

    if (!bookDetails) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({ data: bookDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchExternalBooks,
  getExternalBookDetails,
};
