const express = require("express");
const axios = require("axios");
const router = express.Router();

// Test route for Google Books API
router.get("/google-books-test", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const query = encodeURIComponent("harry potter");
    
    // Use API key
    const requestUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;
    console.log(`Testing Google Books API with key: ${apiKey.substring(0, 10)}...`);
    console.log(`Request URL: ${requestUrl.replace(apiKey, "API_KEY_HIDDEN")}`);
    
    const response = await axios.get(requestUrl);
    
    res.status(200).json({
      message: "Google Books API is working!",
      firstBook: response.data.items[0],
      totalItems: response.data.totalItems
    });
  } catch (error) {
    console.error("Google Books API Test Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error testing Google Books API",
      error: error.response?.data || error.message
    });
  }
});

// Alternative test route with params object
router.get("/google-books-test2", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    
    console.log(`Testing Google Books API (alt method) with key: ${apiKey.substring(0, 10)}...`);
    
    const response = await axios.get(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q: 'harry potter',
          key: apiKey
        }
      }
    );
    
    res.status(200).json({
      message: "Google Books API is working (alternative method)!",
      firstBook: response.data.items[0],
      totalItems: response.data.totalItems
    });
  } catch (error) {
    console.error("Google Books API Test Error (alt method):", error.response?.data || error.message);
    res.status(500).json({
      message: "Error testing Google Books API (alternative method)",
      error: error.response?.data || error.message
    });
  }
});

module.exports = router; 