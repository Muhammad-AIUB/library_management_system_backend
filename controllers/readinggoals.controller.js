const ReadingGoal = require("../models/readinggoal.model");
const ReadingProgress = require("../models/readingProgress.model");
const Book = require("../models/book.model");

// 📊 Create a Reading Goal
const createReadingGoal = async (req, res) => {
  try {
    const { 
      user, 
      type, 
      targetBooks, 
      targetPages, 
      targetMinutes, 
      duration, 
      startDate,
      endDate
    } = req.body;
    
    // Validate required fields based on goal type
    if (type === 'books' && !targetBooks) {
      return res.status(400).json({ message: "Target books is required for book-based goals" });
    } else if (type === 'pages' && !targetPages) {
      return res.status(400).json({ message: "Target pages is required for page-based goals" });
    } else if (type === 'time' && !targetMinutes) {
      return res.status(400).json({ message: "Target minutes is required for time-based goals" });
    }
    
    // Create goal with provided data
    const goalData = { 
      user, 
      type, 
      duration, 
      startDate: startDate || new Date()
    };
    
    // Set only the relevant target based on goal type
    if (type === 'books') goalData.targetBooks = targetBooks;
    if (type === 'pages') goalData.targetPages = targetPages;
    if (type === 'time') goalData.targetMinutes = targetMinutes;
    
    // Set custom end date if provided
    if (duration === 'custom' && endDate) {
      goalData.endDate = new Date(endDate);
    }

    const newGoal = await ReadingGoal.create(goalData);
    res.status(201).json({ 
      message: "Reading Goal created successfully", 
      data: newGoal 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 Get User's Reading Goals
const getUserReadingGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await ReadingGoal.find({ user: userId })
      .populate("completedBooks", "title author coverImage")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ data: goals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Active Reading Goals
const getActiveReadingGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await ReadingGoal.find({ 
      user: userId,
      status: 'active'
    }).populate("completedBooks", "title author coverImage");
    
    res.status(200).json({ data: goals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Get Reading Goal by ID
const getReadingGoalById = async (req, res) => {
  try {
    const goal = await ReadingGoal.findById(req.params.id)
      .populate("user", "name email")
      .populate("completedBooks", "title author coverImage");
      
    if (!goal) {
      return res.status(404).json({ message: "Reading Goal not found" });
    }
    res.status(200).json({ data: goal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Reading Goal
const updateReadingGoal = async (req, res) => {
  try {
    const updatedGoal = await ReadingGoal.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        lastUpdated: new Date()
      },
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ message: "Reading Goal not found" });
    }
    res.status(200).json({
      message: "Reading Goal updated successfully",
      data: updatedGoal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📈 Update Goal Progress
const updateGoalProgress = async (req, res) => {
  try {
    const { goalId, bookId, pagesRead, minutesRead, completed } = req.body;
    
    // Get the goal
    const goal = await ReadingGoal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: "Reading Goal not found" });
    }
    
    // Get the book if provided
    let book = null;
    if (bookId) {
      book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
    }
    
    // Update progress based on goal type
    if (goal.type === 'books' && completed && bookId) {
      // Check if book is already in completed books
      if (!goal.completedBooks.includes(bookId)) {
        goal.completedBooks.push(bookId);
        goal.progress += 1;
      }
    } else if (goal.type === 'pages' && pagesRead) {
      goal.progress += pagesRead;
    } else if (goal.type === 'time' && minutesRead) {
      goal.progress += minutesRead;
    }
    
    // Calculate progress percentage
    if (goal.type === 'books' && goal.targetBooks) {
      goal.progressPercentage = Math.min((goal.progress / goal.targetBooks) * 100, 100);
    } else if (goal.type === 'pages' && goal.targetPages) {
      goal.progressPercentage = Math.min((goal.progress / goal.targetPages) * 100, 100);
    } else if (goal.type === 'time' && goal.targetMinutes) {
      goal.progressPercentage = Math.min((goal.progress / goal.targetMinutes) * 100, 100);
    }
    
    // Update streak if applicable (for daily goals)
    if (goal.duration === 'daily') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const lastUpdateDay = new Date(goal.lastUpdated);
      lastUpdateDay.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // If last update was yesterday, increment streak
      if (lastUpdateDay.getTime() === yesterday.getTime()) {
        goal.streakDays += 1;
      } 
      // If last update was not today or yesterday, reset streak
      else if (lastUpdateDay.getTime() !== today.getTime()) {
        goal.streakDays = 1;
      }
    }
    
    // Check if goal is completed
    if (goal.progressPercentage >= 100) {
      goal.status = 'completed';
    }
    
    // Check if goal end date has passed
    const now = new Date();
    if (goal.endDate && now > goal.endDate && goal.status === 'active') {
      goal.status = goal.progressPercentage >= 100 ? 'completed' : 'failed';
    }
    
    goal.lastUpdated = new Date();
    await goal.save();
    
    res.status(200).json({
      message: "Reading Goal progress updated successfully",
      data: goal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚫 Abandon Reading Goal
const abandonGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    
    const goal = await ReadingGoal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: "Reading Goal not found" });
    }
    
    goal.status = 'abandoned';
    goal.lastUpdated = new Date();
    await goal.save();
    
    res.status(200).json({
      message: "Reading Goal marked as abandoned",
      data: goal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete Reading Goal
const deleteReadingGoal = async (req, res) => {
  try {
    const deletedGoal = await ReadingGoal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return res.status(404).json({ message: "Reading Goal not found" });
    }
    res.status(200).json({ message: "Reading Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Get User Goal Statistics
const getGoalStatistics = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const goals = await ReadingGoal.find({ user: userId });
    
    if (!goals || goals.length === 0) {
      return res.status(200).json({
        data: {
          totalGoals: 0,
          completedGoals: 0,
          activeGoals: 0,
          failedGoals: 0,
          abandonedGoals: 0,
          completionRate: 0,
          currentStreak: 0,
        }
      });
    }
    
    // Calculate goal statistics
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const activeGoals = goals.filter(goal => goal.status === 'active').length;
    const failedGoals = goals.filter(goal => goal.status === 'failed').length;
    const abandonedGoals = goals.filter(goal => goal.status === 'abandoned').length;
    const completionRate = Math.round((completedGoals / totalGoals) * 100);
    
    // Get current daily streak
    const dailyGoals = goals.filter(goal => goal.duration === 'daily');
    let currentStreak = 0;
    
    if (dailyGoals.length > 0) {
      // Find the active daily goal with highest streak
      const activeStreaks = dailyGoals
        .filter(goal => goal.status === 'active')
        .map(goal => goal.streakDays);
      
      currentStreak = activeStreaks.length > 0 ? Math.max(...activeStreaks) : 0;
    }
    
    res.status(200).json({
      data: {
        totalGoals,
        completedGoals,
        activeGoals,
        failedGoals,
        abandonedGoals,
        completionRate,
        currentStreak,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReadingGoal,
  getUserReadingGoals,
  getActiveReadingGoals,
  getReadingGoalById,
  updateReadingGoal,
  updateGoalProgress,
  abandonGoal,
  deleteReadingGoal,
  getGoalStatistics
};
