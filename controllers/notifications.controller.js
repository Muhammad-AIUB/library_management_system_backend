const Notification = require("../models/notification.model");
const ReadingProgress = require("../models/readingProgress.model");
const ReadingGoal = require("../models/readinggoal.model");
const User = require("../models/user.model");

// 📝 Create a Notification
const createNotification = async (req, res) => {
  try {
    const { user, title, message, type, refId, refType } = req.body;
    
    if (!user || !message) {
      return res.status(400).json({ message: "User and message are required fields" });
    }

    const newNotification = await Notification.create({ 
      user, 
      title, 
      message, 
      type, 
      refId, 
      refType 
    });
    
    res.status(201).json({
      message: "Notification created successfully",
      data: newNotification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get User Notifications
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1, read } = req.query;
    
    // Build query
    const query = { user: userId };
    
    // Filter by read status if provided
    if (read === 'true') {
      query.read = true;
    } else if (read === 'false') {
      query.read = false;
    }
    
    // Count total documents for pagination
    const total = await Notification.countDocuments(query);
    
    // Get paginated results
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    res.status(200).json({ 
      data: notifications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Unread Count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({ 
      user: userId,
      read: false
    });
    
    res.status(200).json({ data: { count } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ data: notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Mark Notification as Read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res
      .status(200)
      .json({ message: "Notification marked as read", data: notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Mark All Notifications as Read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ 
      message: "All notifications marked as read",
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete Notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔔 Generate Reading Reminder Notifications
const generateReadingReminders = async (req, res) => {
  try {
    // This would typically be called by a scheduled job
    // but we're providing an API endpoint for testing/manual triggering
    
    const { userId } = req.params;
    
    // Get user's reading progress
    const readingProgress = await ReadingProgress.find({ 
      user: userId,
      status: 'in_progress'
    }).populate('book');
    
    if (!readingProgress || readingProgress.length === 0) {
      return res.status(200).json({
        message: "No in-progress books found to generate reminders for",
        notificationsCreated: 0
      });
    }
    
    // Get user's reading habits
    const sortedByRecent = [...readingProgress].sort(
      (a, b) => new Date(b.lastReadDate) - new Date(a.lastReadDate)
    );
    
    // Find books that haven't been read in a while (more than 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const neglectedBooks = sortedByRecent.filter(
      progress => new Date(progress.lastReadDate) < threeDaysAgo
    );
    
    // Generate notifications for neglected books
    const notifications = [];
    
    for (const progress of neglectedBooks) {
      const book = progress.book;
      const daysSinceLastRead = Math.floor(
        (new Date() - new Date(progress.lastReadDate)) / (1000 * 60 * 60 * 24)
      );
      
      const notification = await Notification.create({
        user: userId,
        title: "Continue your book",
        message: `You haven't read "${book.title}" in ${daysSinceLastRead} days. You're ${progress.completionPercentage.toFixed(0)}% through it. Keep going!`,
        type: "reading_reminder",
        refId: book._id,
        refType: "book"
      });
      
      notifications.push(notification);
    }
    
    // Check for reading goals about to expire
    const activeGoals = await ReadingGoal.find({
      user: userId,
      status: 'active'
    });
    
    for (const goal of activeGoals) {
      // If goal has end date and it's within 2 days
      if (goal.endDate) {
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
        
        if (goal.endDate <= twoDaysFromNow && goal.progressPercentage < 100) {
          // Goal is about to expire but not completed
          const daysLeft = Math.max(0, Math.floor(
            (goal.endDate - new Date()) / (1000 * 60 * 60 * 24)
          ));
          
          let targetDesc = '';
          if (goal.type === 'books') {
            targetDesc = `${goal.targetBooks - goal.progress} more books`;
          } else if (goal.type === 'pages') {
            targetDesc = `${goal.targetPages - goal.progress} more pages`;
          } else if (goal.type === 'time') {
            targetDesc = `${goal.targetMinutes - goal.progress} more minutes`;
          }
          
          const notification = await Notification.create({
            user: userId,
            title: "Goal ending soon!",
            message: `Your ${goal.duration} reading goal is ending in ${daysLeft} days! You need to read ${targetDesc} to reach your goal.`,
            type: "goal_reminder",
            refId: goal._id,
            refType: "reading_goal"
          });
          
          notifications.push(notification);
        }
      }
    }
    
    res.status(200).json({
      message: "Reading reminders generated successfully",
      notificationsCreated: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateReadingReminders
};
