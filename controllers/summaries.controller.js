const Summary = require("../models/summaries.model");

// 📝 Create a New Summary
const createSummary = async (req, res) => {
  try {
    const { user, bookId, content } = req.body;

    const newSummary = await Summary.create({ user, bookId, content });
    res.status(201).json({ message: "Summary created", data: newSummary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get All Summaries of a User
const getUserSummaries = async (req, res) => {
  try {
    const { userId } = req.params;

    const summaries = await Summary.find({ user: userId }).populate(
      "bookId",
      "title author"
    );
    res.status(200).json({ data: summaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Summary by ID
const getSummaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = await Summary.findById(id).populate(
      "bookId",
      "title author"
    );
    if (!summary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    res.status(200).json({ data: summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Summary
const updateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedSummary = await Summary.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedSummary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    res.status(200).json({ message: "Summary updated", data: updatedSummary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete Summary
const deleteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSummary = await Summary.findByIdAndDelete(id);
    if (!deletedSummary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    res.status(200).json({ message: "Summary deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSummary,
  getUserSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary,
};
