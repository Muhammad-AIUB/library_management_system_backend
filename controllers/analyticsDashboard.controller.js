const Analytics = require("../models/analytics.model");

// 📊 Reading Progress Analysis
const getReadingProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const analytics = await Analytics.findOne({ user: userId });

    if (!analytics) {
      return res
        .status(404)
        .json({ message: "No analytics data found for this user" });
    }

    const progressData = {
      booksRead: analytics.booksRead,
      readingTime: analytics.readingTime,
      averageReadingSpeed: analytics.averageReadingSpeed,
    };

    res.status(200).json({ data: progressData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 Genre Analysis
const getGenreAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;

    const analytics = await Analytics.findOne({ user: userId });

    if (!analytics) {
      return res
        .status(404)
        .json({ message: "No analytics data found for this user" });
    }

    const genreCount = analytics.favoriteGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ data: genreCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📅 Reading Time Analysis
const getReadingTimeAnalysis = async (req, res) => {
  try {
    const { userId, period } = req.params;

    const analytics = await Analytics.findOne({ user: userId });

    if (!analytics) {
      return res
        .status(404)
        .json({ message: "No analytics data found for this user" });
    }

    let timeData = {
      readingTime: analytics.readingTime,
      period,
    };

    res.status(200).json({ data: timeData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getReadingProgress,
  getGenreAnalysis,
  getReadingTimeAnalysis,
};
