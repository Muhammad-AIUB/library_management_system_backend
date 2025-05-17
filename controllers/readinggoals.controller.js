const ReadingGoal = require("../models/readinggoal.model");

// 📝 Create a Reading Goal
const createReadingGoal = async (req, res) => {
  try {
    const { user, targetBooks, duration } = req.body;

    const newGoal = await ReadingGoal.create({ user, targetBooks, duration });
    res
      .status(201)
      .json({ message: "Reading Goal created successfully", data: newGoal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get All Reading Goals
const getAllReadingGoals = async (req, res) => {
  try {
    const goals = await ReadingGoal.find().populate("user", "name email");
    res.status(200).json({ data: goals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Reading Goal by ID
const getReadingGoalById = async (req, res) => {
  try {
    const goal = await ReadingGoal.findById(req.params.id).populate(
      "user",
      "name email"
    );
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
      req.body,
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

module.exports = {
  createReadingGoal,
  getAllReadingGoals,
  getReadingGoalById,
  updateReadingGoal,
  deleteReadingGoal,
};
