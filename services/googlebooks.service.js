const axios = require("axios");

const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

// 📚 Search Books by Title, Author, Genre
const searchBooks = async (query) => {
  try {
    const response = await axios.get(
      `${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&key=${apiKey}`
    );
    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching books:", error.message);
    throw new Error("Failed to fetch books from Google Books API");
  }
};

// 📖 Get Book Details by ID
const getBookDetails = async (bookId) => {
  try {
    const response = await axios.get(
      `${GOOGLE_BOOKS_API_BASE_URL}/${bookId}?key=${apiKey}`
    );
    return response.data || null;
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    throw new Error("Failed to fetch book details from Google Books API");
  }
};

module.exports = { searchBooks, getBookDetails };
