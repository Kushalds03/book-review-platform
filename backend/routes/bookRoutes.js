const express = require('express');
const { body } = require('express-validator');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRatingDistribution
} = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const bookValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('genre')
    .isIn(['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Technology', 'Other'])
    .withMessage('Please select a valid genre'),
  body('year')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Please provide a valid year')
];

// @route   GET /api/books
// @desc    Get all books with pagination, search, filter, and sort
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   GET /api/books/:id/ratings
// @desc    Get rating distribution for a book
// @access  Public
router.get('/:id/ratings', getRatingDistribution);

// @route   POST /api/books
// @desc    Create new book
// @access  Private
router.post('/', authMiddleware, bookValidation, createBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private
router.put('/:id', authMiddleware, bookValidation, updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private
router.delete('/:id', authMiddleware, deleteBook);

module.exports = router;
