const axios = require("axios");

const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

// Helper function to build URL with API key
const buildUrl = (baseUrl, queryParams) => {
  // Always include the API key in params
  const paramsWithKey = { ...queryParams, key: apiKey };
  
  // Filter out any undefined or null values
  const filteredParams = Object.entries(paramsWithKey)
    .filter(([_, value]) => value !== undefined && value !== null)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  // Build query string
  const queryString = new URLSearchParams(filteredParams).toString();
  
  return `${baseUrl}?${queryString}`;
};

// 📚 Search Books by Title, Author, Genre
const searchBooks = async (query) => {
  try {
    const params = { q: query };
    
    const response = await axios.get(
      buildUrl(GOOGLE_BOOKS_API_BASE_URL, params)
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
      buildUrl(`${GOOGLE_BOOKS_API_BASE_URL}/${bookId}`, {})
    );
    return response.data || null;
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    throw new Error("Failed to fetch book details from Google Books API");
  }
};

module.exports = { searchBooks, getBookDetails };
