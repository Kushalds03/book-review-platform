const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get all reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ bookId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ bookId });
    
    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get reviews by book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { bookId, rating, reviewText } = req.body;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ 
      bookId, 
      userId: req.user._id 
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }
    
    const review = await Review.create({
      bookId,
      userId: req.user._id,
      rating,
      reviewText
    });
    
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('bookId', 'title');
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is the author of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }
    
    const { rating, reviewText } = req.body;
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, reviewText },
      { new: true, runValidators: true }
    ).populate('userId', 'name').populate('bookId', 'title');
    
    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is the author of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ userId })
      .populate('bookId', 'title author')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ userId });
    
    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user reviews'
    });
  }
};

module.exports = {
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
};
