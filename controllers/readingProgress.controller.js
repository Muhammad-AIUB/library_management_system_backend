const ReadingProgress = require("../models/readingProgress.model");
const Book = require("../models/book.model");

// 📊 Track Reading Progress
const trackProgress = async (req, res) => {
  try {
    const { userId, bookId, pagesRead, totalPages, timeSpent } = req.body;

    let progress = await ReadingProgress.findOne({ user: userId, book: bookId });

    if (!progress) {
      progress = new ReadingProgress({
        user: userId,
        book: bookId,
        pagesRead: 0,
        totalPages,
        sessionsLog: [],
        startDate: new Date(),
      });
    }

    // Calculate reading speed (pages per minute)
    const readingSpeed = timeSpent > 0 ? pagesRead / (timeSpent / 60) : 0;

    // Log this reading session
    progress.sessionsLog.push({
      date: new Date(),
      pagesRead,
      timeSpent,
      readingSpeed,
    });

    // Update progress metrics
    progress.pagesRead = Math.min(pagesRead, totalPages);
    progress.lastReadDate = new Date();
    progress.completionPercentage = (progress.pagesRead / progress.totalPages) * 100;
    
    // Calculate average reading speed from all sessions
    const totalReadingTime = progress.sessionsLog.reduce((total, session) => total + session.timeSpent, 0);
    const totalPagesRead = progress.sessionsLog.reduce((total, session) => total + session.pagesRead, 0);
    progress.avgReadingSpeed = totalReadingTime > 0 ? totalPagesRead / (totalReadingTime / 60) : 0;
    
    // Estimate remaining time to finish the book
    const pagesRemaining = totalPages - progress.pagesRead;
    progress.estimatedTimeToComplete = progress.avgReadingSpeed > 0 
      ? pagesRemaining / progress.avgReadingSpeed 
      : 0;

    await progress.save();

    res.status(200).json({
      message: "Reading progress updated successfully",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📈 Get Reading Progress
const getProgress = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    const progress = await ReadingProgress.findOne({ 
      user: userId, 
      book: bookId 
    }).populate("book");

    if (!progress) {
      return res.status(404).json({ message: "Reading progress not found." });
    }

    res.status(200).json({ data: progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 Get All Reading Progress
const getAllProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const allProgress = await ReadingProgress.find({ 
      user: userId 
    }).populate("book").sort({ lastReadDate: -1 });

    res.status(200).json({ data: allProgress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Get Reading Statistics
const getReadingStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const allProgress = await ReadingProgress.find({ user: userId });
    
    // Calculate total reading time (in minutes)
    const totalReadingTime = allProgress.reduce((total, book) => {
      return total + book.sessionsLog.reduce((sum, session) => sum + session.timeSpent, 0);
    }, 0);
    
    // Calculate pages read in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentSessions = allProgress.flatMap(book => 
      book.sessionsLog.filter(session => new Date(session.date) >= oneWeekAgo)
    );
    
    const pagesLastWeek = recentSessions.reduce((sum, session) => sum + session.pagesRead, 0);
    
    // Calculate average reading speed overall
    const totalPages = allProgress.reduce((total, book) => {
      return total + book.sessionsLog.reduce((sum, session) => sum + session.pagesRead, 0);
    }, 0);
    
    const avgReadingSpeed = totalReadingTime > 0 ? totalPages / (totalReadingTime / 60) : 0;
    
    // Get books completed
    const completedBooks = allProgress.filter(book => book.completionPercentage >= 100).length;
    
    // Get books in progress
    const inProgressBooks = allProgress.filter(book => 
      book.completionPercentage > 0 && book.completionPercentage < 100
    ).length;
    
    res.status(200).json({ 
      data: {
        totalReadingTime,
        pagesLastWeek,
        avgReadingSpeed,
        completedBooks,
        inProgressBooks,
        totalBooks: allProgress.length
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  trackProgress,
  getProgress,
  getAllProgress,
  getReadingStats
}; 