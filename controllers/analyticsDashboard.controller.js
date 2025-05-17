const UserAnalytics = require("../models/Analytics.model");
const ReadingProgress = require("../models/readingProgress.model");
const Book = require("../models/book.model");

// 📊 Get Dashboard Overview
const getDashboardOverview = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all reading progress for user
    const readingProgress = await ReadingProgress.find({ user: userId }).populate('book');
    
    if (!readingProgress || readingProgress.length === 0) {
      return res.status(200).json({ 
        message: "No reading data available yet",
        data: {
          totalBooks: 0,
          booksCompleted: 0,
          pagesRead: 0,
          totalReadingTime: 0,
          currentlyReading: []
        }
      });
    }

    // Calculate overview metrics
    const totalBooks = readingProgress.length;
    
    const booksCompleted = readingProgress.filter(
      progress => progress.status === 'completed'
    ).length;
    
    const pagesRead = readingProgress.reduce(
      (total, progress) => total + progress.pagesRead, 0
    );
    
    const totalReadingTimeMinutes = readingProgress.reduce((total, progress) => {
      return total + progress.sessionsLog.reduce((sum, session) => sum + session.timeSpent, 0);
    }, 0);
    
    // Get currently reading books
    const currentlyReading = readingProgress
      .filter(progress => progress.status === 'in_progress')
      .map(progress => ({
        bookId: progress.book._id,
        title: progress.book.title,
        author: progress.book.author,
        coverImage: progress.book.coverImage,
        progress: progress.completionPercentage,
        lastReadDate: progress.lastReadDate
      }))
      .sort((a, b) => new Date(b.lastReadDate) - new Date(a.lastReadDate))
      .slice(0, 5); // Get top 5 most recently read
    
    res.status(200).json({
      data: {
        totalBooks,
        booksCompleted,
        pagesRead,
        totalReadingTime: totalReadingTimeMinutes,
        completionRate: totalBooks > 0 ? (booksCompleted / totalBooks) * 100 : 0,
        currentlyReading
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 Get Reading Progress Analysis with Visualization Data
const getReadingProgressAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all reading progress entries
    const readingProgress = await ReadingProgress.find({ user: userId });
    
    if (!readingProgress || readingProgress.length === 0) {
      return res.status(200).json({
        message: "No reading data available yet",
        data: {
          dailyReadingData: [],
          weeklyReadingData: [],
          monthlyReadingData: [],
          readingSpeedData: []
        }
      });
    }

    // Get all reading sessions and sort by date
    const allSessions = readingProgress.flatMap(progress => 
      progress.sessionsLog.map(session => ({
        date: new Date(session.date),
        pagesRead: session.pagesRead,
        timeSpent: session.timeSpent,
        readingSpeed: session.readingSpeed,
        bookId: progress.book
      }))
    ).sort((a, b) => a.date - b.date);
    
    // Generate daily reading data for chart (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const dailyReadingData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayReadingSessions = allSessions.filter(
        session => session.date >= dayStart && session.date <= dayEnd
      );
      
      const pagesRead = dayReadingSessions.reduce((sum, session) => sum + session.pagesRead, 0);
      const timeSpent = dayReadingSessions.reduce((sum, session) => sum + session.timeSpent, 0);
      
      dailyReadingData.push({
        date: dayStart.toISOString().split('T')[0],
        pagesRead,
        timeSpent,
        sessionsCount: dayReadingSessions.length
      });
    }
    
    // Generate weekly reading data (last 12 weeks)
    const weeklyReadingData = [];
    for (let i = 0; i < 12; i++) {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      
      const weekReadingSessions = allSessions.filter(
        session => session.date >= weekStart && session.date <= weekEnd
      );
      
      const pagesRead = weekReadingSessions.reduce((sum, session) => sum + session.pagesRead, 0);
      const timeSpent = weekReadingSessions.reduce((sum, session) => sum + session.timeSpent, 0);
      
      weeklyReadingData.push({
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        pagesRead,
        timeSpent,
        sessionsCount: weekReadingSessions.length
      });
    }
    
    // Reading speed over time
    const readingSpeedData = allSessions
      .filter(session => session.readingSpeed > 0)
      .map(session => ({
        date: session.date.toISOString().split('T')[0],
        readingSpeed: session.readingSpeed
      }));
    
    res.status(200).json({
      data: {
        dailyReadingData,
        weeklyReadingData,
        readingSpeedData
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 Genre Analysis with Chart Data
const getGenreAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all reading progress for completed books
    const readingProgress = await ReadingProgress.find({ 
      user: userId,
      status: 'completed'
    }).populate('book');
    
    if (!readingProgress || readingProgress.length === 0) {
      return res.status(200).json({
        message: "No completed books yet",
        data: {
          genreDistribution: [],
          topGenres: []
        }
      });
    }

    // Extract genres from books and count occurrences
    const genres = readingProgress
      .map(progress => progress.book.genre)
      .flatMap(genre => genre.split(',').map(g => g.trim()))
      .filter(genre => genre);
    
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array for chart data
    const genreDistribution = Object.entries(genreCounts).map(([genre, count]) => ({
      genre,
      count,
      percentage: (count / genres.length) * 100
    })).sort((a, b) => b.count - a.count);
    
    // Get top 5 genres
    const topGenres = genreDistribution.slice(0, 5);
    
    res.status(200).json({
      data: {
        genreDistribution,
        topGenres
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📅 Reading Time Analysis with Heatmap Data
const getReadingTimeAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;
    const timeRange = req.query.timeRange || 'month'; // 'week', 'month', 'year'
    
    // Get all reading progress
    const readingProgress = await ReadingProgress.find({ user: userId });
    
    if (!readingProgress || readingProgress.length === 0) {
      return res.status(200).json({
        message: "No reading data available yet",
        data: {
          readingHeatmap: [],
          timeOfDayDistribution: [],
          dayOfWeekDistribution: []
        }
      });
    }

    // Get all reading sessions with dates
    const allSessions = readingProgress.flatMap(progress => 
      progress.sessionsLog.map(session => ({
        date: new Date(session.date),
        timeSpent: session.timeSpent,
        hour: new Date(session.date).getHours()
      }))
    );
    
    // Calculate start date based on time range
    const endDate = new Date();
    let startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(endDate.getMonth() - 1);
    } else if (timeRange === 'year') {
      startDate.setFullYear(endDate.getFullYear() - 1);
    }
    
    // Filter sessions by date range
    const filteredSessions = allSessions.filter(
      session => session.date >= startDate && session.date <= endDate
    );
    
    // Generate reading heatmap data (reading time by day)
    const heatmapData = {};
    filteredSessions.forEach(session => {
      const dateStr = session.date.toISOString().split('T')[0];
      heatmapData[dateStr] = (heatmapData[dateStr] || 0) + session.timeSpent;
    });
    
    const readingHeatmap = Object.entries(heatmapData).map(([date, minutes]) => ({
      date,
      minutes,
      intensity: Math.min(Math.ceil(minutes / 60), 4) // 1-4 intensity scale
    }));
    
    // Time of day distribution (reading time by hour of day)
    const hourCounts = Array(24).fill(0);
    filteredSessions.forEach(session => {
      hourCounts[session.hour] += session.timeSpent;
    });
    
    const timeOfDayDistribution = hourCounts.map((minutes, hour) => ({
      hour,
      minutes,
      percentage: filteredSessions.length > 0 
        ? (minutes / filteredSessions.reduce((sum, s) => sum + s.timeSpent, 0)) * 100 
        : 0
    }));
    
    // Day of week distribution
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekCounts = Array(7).fill(0);
    
    filteredSessions.forEach(session => {
      const dayOfWeek = session.date.getDay();
      dayOfWeekCounts[dayOfWeek] += session.timeSpent;
    });
    
    const dayOfWeekDistribution = dayOfWeekCounts.map((minutes, dayIndex) => ({
      day: dayNames[dayIndex],
      minutes,
      percentage: filteredSessions.length > 0 
        ? (minutes / filteredSessions.reduce((sum, s) => sum + s.timeSpent, 0)) * 100 
        : 0
    }));
    
    res.status(200).json({
      data: {
        readingHeatmap,
        timeOfDayDistribution,
        dayOfWeekDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardOverview,
  getReadingProgressAnalysis,
  getGenreAnalysis,
  getReadingTimeAnalysis
};
