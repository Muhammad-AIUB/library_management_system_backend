const Notification = require("../models/notification.model");

// 📝 Create a Notification
const createNotification = async (req, res) => {
  try {
    const { user, message } = req.body;

    const newNotification = await Notification.create({ user, message });
    res
      .status(201)
      .json({
        message: "Notification created successfully",
        data: newNotification,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get All Notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate(
      "user",
      "name email"
    );
    res.status(200).json({ data: notifications });
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

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
};
