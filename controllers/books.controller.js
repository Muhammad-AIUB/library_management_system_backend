const Book = require("../models/book.model");
const ReadingProgress = require("../models/readingProgress.model");
const googleBooksService = require("../services/googlebooks.service");

// 📦 Create a New Book
const createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res
      .status(201)
      .json({ message: "Book created successfully", data: newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📝 Get All Books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ data: books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Single Book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ data: book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Book
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res
      .status(200)
      .json({ message: "Book updated successfully", data: updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete Book
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Advanced Search with Filters
const searchBooks = async (req, res) => {
  try {
    const {
      query,
      genre,
      author,
      readingStatus,
      tags,
      minRating,
      maxPages,
      userId,
      sortBy,
      sortOrder
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Text search (title and description)
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Genre filter
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }
    
    // Author filter
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    
    // Tags filter (comma-separated list)
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagList };
    }
    
    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    // Page count filter
    if (maxPages) {
      filter.pageCount = { $lte: parseInt(maxPages) };
    }
    
    // Set up sorting
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.title = 1; // Default sort by title
    }
    
    // Find books in database based on filters
    let books = await Book.find(filter).sort(sort);

    // If userId provided, get reading status for each book
    if (userId) {
      const readingProgresses = await ReadingProgress.find({ user: userId });
      
      // Create map of book ID to reading status
      const progressMap = {};
      readingProgresses.forEach(progress => {
        progressMap[progress.book.toString()] = progress.status;
      });
      
      // Filter by reading status if requested
      if (readingStatus) {
        books = books.filter(book => 
          progressMap[book._id.toString()] === readingStatus
        );
      }
      
      // Add reading status to each book
      books = books.map(book => {
        const bookObj = book.toObject();
        bookObj.readingStatus = progressMap[book._id.toString()] || 'not_started';
        return bookObj;
      });
    }
    
    res.status(200).json({ 
      message: "Books retrieved successfully", 
      count: books.length,
      data: books 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔄 Import Book from Google Books
const importFromGoogleBooks = async (req, res) => {
  try {
    const { googleBookId } = req.body;
    
    // First check if book already exists
    const existingBook = await Book.findOne({ googleBookId });
    if (existingBook) {
      return res.status(200).json({ 
        message: "Book already exists in library", 
        data: existingBook 
      });
    }
    
    // Fetch book details from Google Books API
    const bookDetails = await googleBooksService.getBookDetails(googleBookId);
    if (!bookDetails) {
      return res.status(404).json({ message: "Book not found in Google Books" });
    }
    
    // Extract relevant information
    const volumeInfo = bookDetails.volumeInfo || {};
    
    const newBook = await Book.create({
      title: volumeInfo.title,
      author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown',
      description: volumeInfo.description || '',
      genre: volumeInfo.categories ? volumeInfo.categories.join(', ') : 'Uncategorized',
      pageCount: volumeInfo.pageCount || 0,
      publishedDate: volumeInfo.publishedDate || '',
      publisher: volumeInfo.publisher || '',
      coverImage: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : '',
      googleBookId: googleBookId,
      isbn: volumeInfo.industryIdentifiers ? 
        volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier || 
        volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10')?.identifier || 
        '' : '',
      rating: volumeInfo.averageRating || 0,
      tags: volumeInfo.categories || []
    });
    
    res.status(201).json({ 
      message: "Book imported successfully from Google Books", 
      data: newBook 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  importFromGoogleBooks
};
