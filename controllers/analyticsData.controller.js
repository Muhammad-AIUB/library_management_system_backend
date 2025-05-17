const Analytics = require("../models/analytics.model");

// 📝 Create or Update Analytics Data
const updateAnalytics = async (req, res) => {
  try {
    const { user, booksRead, readingTime, favoriteGenres } = req.body;

    let analytics = await Analytics.findOne({ user });

    if (analytics) {
      // Update Existing Data
      analytics.booksRead += booksRead;
      analytics.readingTime += readingTime;
      analytics.favoriteGenres = [
        ...new Set([...analytics.favoriteGenres, ...favoriteGenres]),
      ];
      analytics.averageReadingSpeed = (
        analytics.readingTime / analytics.booksRead
      ).toFixed(2);

      await analytics.save();
    } else {
      // Create New Data
      analytics = await Analytics.create({
        user,
        booksRead,
        readingTime,
        favoriteGenres,
        averageReadingSpeed: (readingTime / booksRead).toFixed(2),
      });
    }

    res
      .status(200)
      .json({ message: "Analytics data updated", data: analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get Analytics Data
const getAnalyticsData = async (req, res) => {
  try {
    const { userId } = req.params;

    const analytics = await Analytics.findOne({ user: userId }).populate(
      "user",
      "name email"
    );

    if (!analytics) {
      return res
        .status(404)
        .json({ message: "No analytics data found for this user" });
    }

    res.status(200).json({ data: analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateAnalytics,
  getAnalyticsData,
};
