const express = require('express');
const { body } = require('express-validator');
const {
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review text must be between 10 and 1000 characters')
];

// @route   GET /api/reviews/book/:bookId
// @desc    Get all reviews for a book
// @access  Public
router.get('/book/:bookId', getReviewsByBook);

// @route   GET /api/reviews/user/:userId
// @desc    Get user's reviews
// @access  Public
router.get('/user/:userId', getUserReviews);

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', authMiddleware, reviewValidation, createReview);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', authMiddleware, reviewValidation, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
