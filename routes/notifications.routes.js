const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateReadingReminders
} = require("../controllers/notifications.controller");

// 📝 Create Notification
router.post("/", createNotification);

// 📜 Get User Notifications
router.get("/user/:userId", getUserNotifications);

// 📊 Get Unread Notification Count
router.get("/unread/:userId", getUnreadCount);

// 📘 Get Single Notification
router.get("/:id", getNotificationById);

// ✏️ Mark as Read
router.put("/:id/read", markAsRead);

// ✏️ Mark All as Read
router.put("/user/:userId/read-all", markAllAsRead);

// 🔔 Generate Reading Reminders
router.post("/generate-reminders/:userId", generateReadingReminders);

// 🗑️ Delete Notification
router.delete("/:id", deleteNotification);

module.exports = router;
