const { validationResult } = require('express-validator');
const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Get all books with pagination, search, filter, and sort
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    
    const { search, genre, sortBy, sortOrder } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre && genre !== 'All') {
      query.genre = genre;
    }
    
    // Build sort
    let sort = {};
    if (sortBy === 'year') {
      sort.year = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sort.averageRating = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }
    
    // Get books with pagination
    const books = await Book.find(query)
      .populate('addedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Book.countDocuments(query);
    
    // Calculate average ratings for each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ bookId: book._id });
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        return {
          ...book.toObject(),
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length
        };
      })
    );
    
    res.json({
      success: true,
      books: booksWithRatings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books'
    });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Get reviews for this book
    const reviews = await Review.find({ bookId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    res.json({
      success: true,
      book: {
        ...book.toObject(),
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
        reviews
      }
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book'
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { title, author, description, genre, year } = req.body;
    
    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user._id
    });
    
    const populatedBook = await Book.findById(book._id).populate('addedBy', 'name');
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book: populatedBook
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating book'
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Check if user is the creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }
    
    const { title, author, description, genre, year } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, genre, year },
      { new: true, runValidators: true }
    ).populate('addedBy', 'name');
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating book'
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Check if user is the creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }
    
    // Delete all reviews for this book
    await Review.deleteMany({ bookId: req.params.id });
    
    // Delete the book
    await Book.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book'
    });
  }
};

// @desc    Get rating distribution for a book
// @route   GET /api/books/:id/ratings
// @access  Public
const getRatingDistribution = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    const reviews = await Review.find({ bookId: req.params.id });
    
    // Calculate rating distribution
    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    res.json({
      success: true,
      distribution
    });
  } catch (error) {
    console.error('Get rating distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rating distribution'
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRatingDistribution
};
