import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, reviewsAPI } from '../api';
import ReviewCard from '../components/ReviewCard';
import RatingChart from '../components/RatingChart';

const BookDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const [bookResponse, ratingResponse] = await Promise.all([
        booksAPI.getBookById(id),
        booksAPI.getRatingDistribution(id)
      ]);

      if (bookResponse.data.success) {
        setBook(bookResponse.data.book);
        setReviews(bookResponse.data.book.reviews || []);
      }

      if (ratingResponse.data.success) {
        setRatingDistribution(ratingResponse.data.distribution);
      }
    } catch (error) {
      setError('Failed to fetch book details');
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');

    try {
      const response = await reviewsAPI.createReview({
        bookId: id,
        rating: reviewForm.rating,
        reviewText: reviewForm.reviewText
      });

      if (response.data.success) {
        setReviewForm({ rating: 5, reviewText: '' });
        setShowReviewForm(false);
        fetchBookDetails(); // Refresh book details
      }
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to create review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setReviewForm({
      rating: review.rating,
      reviewText: review.reviewText
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsAPI.deleteReview(reviewId);
        fetchBookDetails(); // Refresh book details
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error || 'Book not found'}</p>
        <Link to="/" className="btn-primary mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Book Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              by {book.author}
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                {book.genre}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Published: {book.year}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(Math.round(book.averageRating))}
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {book.averageRating.toFixed(1)}/5
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ({book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {book.description}
            </p>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Added by {book.addedBy.name}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reviews Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reviews
            </h2>
            {isAuthenticated && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary"
              >
                Write Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Write a Review
              </h3>
              
              {reviewError && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {reviewForm.rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Review
                  </label>
                  <textarea
                    id="reviewText"
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    required
                    rows={4}
                    className="input-field"
                    placeholder="Share your thoughts about this book..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="btn-primary"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this book!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rating Chart Sidebar */}
        <div>
          <RatingChart distribution={ratingDistribution} />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
