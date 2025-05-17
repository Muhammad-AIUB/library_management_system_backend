const Recommendation = require("../models/recommendation.model");
const Book = require("../models/book.model");
const ReadingProgress = require("../models/readingProgress.model");
const User = require("../models/user.model");

// 📚 Generate Personalized Recommendations
const generateRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's reading history
    const readingProgress = await ReadingProgress.find({ user: userId }).populate('book');
    
    if (!readingProgress || readingProgress.length === 0) {
      return res.status(200).json({
        message: "Not enough reading history for personalized recommendations",
        data: []
      });
    }
    
    // Extract completed books
    const completedBooks = readingProgress
      .filter(progress => progress.status === 'completed')
      .map(progress => progress.book);
    
    // Extract user's favorite genres based on reading history
    const genreCounts = {};
    
    completedBooks.forEach(book => {
      if (book.genre) {
        book.genre.split(',').forEach(genre => {
          const g = genre.trim();
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      }
    });
    
    // Sort genres by frequency
    const favoriteGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)  // Top 5 genres
      .map(entry => entry[0]);
    
    // Extract favorite authors
    const authorCounts = {};
    
    completedBooks.forEach(book => {
      if (book.author) {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
      }
    });
    
    const favoriteAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)  // Top 3 authors
      .map(entry => entry[0]);
    
    // Get a list of books the user has already read
    const readBookIds = readingProgress.map(progress => progress.book._id.toString());
    
    // Find books matching user's preferences but not yet read
    let recommendationCriteria = [];
    
    // Add genre-based criteria
    if (favoriteGenres.length > 0) {
      favoriteGenres.forEach(genre => {
        recommendationCriteria.push({ genre: { $regex: genre, $options: 'i' } });
      });
    }
    
    // Add author-based criteria
    if (favoriteAuthors.length > 0) {
      favoriteAuthors.forEach(author => {
        recommendationCriteria.push({ author: { $regex: author, $options: 'i' } });
      });
    }
    
    // Find recommendations
    let recommendedBooks = [];
    
    if (recommendationCriteria.length > 0) {
      recommendedBooks = await Book.find({
        $or: recommendationCriteria,
        _id: { $nin: readBookIds }
      }).limit(10);
    }
    
    // If we don't have enough recommendations, add some popular books
    if (recommendedBooks.length < 10) {
      const popularBooks = await Book.find({
        _id: { $nin: [...readBookIds, ...recommendedBooks.map(b => b._id)] }
      }).sort({ rating: -1 }).limit(10 - recommendedBooks.length);
      
      recommendedBooks = [...recommendedBooks, ...popularBooks];
    }
    
    // Create or update recommendation record
    let recommendation = await Recommendation.findOne({ user: userId });
    
    if (recommendation) {
      recommendation.recommendedBooks = recommendedBooks.map(book => book._id);
      recommendation.genres = favoriteGenres;
      recommendation.authors = favoriteAuthors;
      recommendation.lastUpdated = new Date();
      await recommendation.save();
    } else {
      recommendation = await Recommendation.create({
        user: userId,
        recommendedBooks: recommendedBooks.map(book => book._id),
        genres: favoriteGenres,
        authors: favoriteAuthors,
        lastUpdated: new Date()
      });
    }
    
    res.status(200).json({
      message: "Personalized recommendations generated successfully",
      data: {
        favoriteGenres,
        favoriteAuthors,
        recommendations: recommendedBooks
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get Recommendations for a User
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if recommendations exist and when they were last updated
    let recommendation = await Recommendation.findOne({ user: userId });
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Generate new recommendations if none exist or they're older than a week
    if (!recommendation || recommendation.lastUpdated < oneWeekAgo) {
      // Call the generation function internally
      const readingProgress = await ReadingProgress.find({ user: userId }).populate('book');
      
      if (!readingProgress || readingProgress.length === 0) {
        return res.status(200).json({
          message: "Not enough reading history for personalized recommendations",
          data: {
            genreBased: [],
            authorBased: [],
            popular: []
          }
        });
      }
      
      // Extract completed books and calculate preferences similar to generateRecommendations
      // ... (similar logic to generateRecommendations)
      
      // For brevity, we'll just invoke the generation endpoint
      return generateRecommendations(req, res);
    }
    
    // Get populated recommendation books
    const populatedRecommendation = await Recommendation.findOne({ user: userId })
      .populate('recommendedBooks');
    
    if (!populatedRecommendation) {
      return res.status(404).json({ message: "No recommendations found for this user." });
    }
    
    // Organize recommendations by type
    const genreBased = [];
    const authorBased = [];
    const popular = [];
    
    // Classify recommendations (simplified version)
    populatedRecommendation.recommendedBooks.forEach(book => {
      const matchesGenre = populatedRecommendation.genres.some(genre => 
        book.genre && book.genre.toLowerCase().includes(genre.toLowerCase())
      );
      
      const matchesAuthor = populatedRecommendation.authors.some(author => 
        book.author && book.author.toLowerCase().includes(author.toLowerCase())
      );
      
      if (matchesAuthor) {
        authorBased.push(book);
      } else if (matchesGenre) {
        genreBased.push(book);
      } else {
        popular.push(book);
      }
    });
    
    res.status(200).json({ 
      data: {
        genreBased,
        authorBased,
        popular,
        lastUpdated: populatedRecommendation.lastUpdated
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👍 Rate Recommendation Quality
const rateRecommendation = async (req, res) => {
  try {
    const { userId, bookId, rating } = req.body;
    
    // Find the recommendation record
    const recommendation = await Recommendation.findOne({ user: userId });
    
    if (!recommendation) {
      return res.status(404).json({ message: "No recommendations found for this user." });
    }
    
    // Update recommendation ratings if this book was recommended
    if (recommendation.recommendedBooks.includes(bookId)) {
      // Add or update rating
      const existingRatingIndex = recommendation.ratings.findIndex(r => r.book.toString() === bookId);
      
      if (existingRatingIndex >= 0) {
        recommendation.ratings[existingRatingIndex].rating = rating;
      } else {
        recommendation.ratings.push({ book: bookId, rating });
      }
      
      await recommendation.save();
    }
    
    res.status(200).json({ 
      message: "Recommendation rating saved successfully",
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateRecommendations,
  getRecommendations,
  rateRecommendation
};
