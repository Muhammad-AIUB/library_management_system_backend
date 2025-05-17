const Recommendation = require("../models/recommendation.model");
const Book = require("../models/book.model");

// 📝 Create or Update Recommendation Data
const createRecommendation = async (req, res) => {
  try {
    const { userId, favoriteGenres } = req.body;

    // Step 1: Find books that match the user's favorite genres
    const recommendedBooks = await Book.find({
      genre: { $in: favoriteGenres },
    });

    if (recommendedBooks.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found for the selected genres." });
    }

    // Step 2: Create or update recommendation data
    let recommendation = await Recommendation.findOne({ user: userId });

    if (recommendation) {
      // Update existing recommendation data
      recommendation.recommendedBooks = recommendedBooks.map(
        (book) => book._id
      );
      recommendation.genres = favoriteGenres;
      await recommendation.save();
    } else {
      // Create new recommendation data
      recommendation = await Recommendation.create({
        user: userId,
        recommendedBooks: recommendedBooks.map((book) => book._id),
        genres: favoriteGenres,
      });
    }

    res.status(200).json({
      message: "Recommendation data created/updated successfully",
      data: recommendation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get Recommendations for a User
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendation = await Recommendation.findOne({
      user: userId,
    }).populate("recommendedBooks");

    if (!recommendation) {
      return res
        .status(404)
        .json({ message: "No recommendations found for this user." });
    }

    res.status(200).json({ data: recommendation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRecommendation,
  getRecommendations,
};
