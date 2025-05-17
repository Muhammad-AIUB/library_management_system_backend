const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
} = require("../controllers/notifications.controller");

// 📝 Create Notification
router.post("/", createNotification);

// 📜 Get All Notifications
router.get("/", getAllNotifications);

// 📘 Get Single Notification
router.get("/:id", getNotificationById);

// ✏️ Mark as Read
router.put("/:id/read", markAsRead);

// 🗑️ Delete Notification
router.delete("/:id", deleteNotification);

module.exports = router;
