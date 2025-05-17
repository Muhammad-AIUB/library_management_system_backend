const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

// 📝 Create User
router.post("/", createUser);

// 📜 Get All Users
router.get("/", getAllUsers);

// 📘 Get Single User
router.get("/:id", getUserById);

// ✏️ Update User
router.put("/:id", updateUser);

// 🗑️ Delete User
router.delete("/:id", deleteUser);

module.exports = router;
