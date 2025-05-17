const BookNote = require("../models/booknote.model");
const Book = require("../models/booknote.model");

// 📝 Create a new Book Note
const createBookNote = async (req, res) => {
  try {
    const { userId, bookId, notes } = req.body;

    // Step 1: Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Step 2: Create a new note for the book
    const newNote = new BookNote({
      user: userId,
      book: bookId,
      notes,
    });

    await newNote.save();
    res.status(201).json({ message: "Note added successfully", data: newNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📜 Get Notes for a Book
const getBookNotes = async (req, res) => {
  try {
    const { bookId } = req.params;
    const notes = await BookNote.find({ book: bookId }).populate("user");

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found for this book." });
    }

    res.status(200).json({ data: notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete a Note
const deleteBookNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await BookNote.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    await note.remove();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBookNote,
  getBookNotes,
  deleteBookNote,
};
