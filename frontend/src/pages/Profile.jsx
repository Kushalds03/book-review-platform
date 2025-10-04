import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, reviewsAPI } from '../api';
import BookCard from '../components/BookCard';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [userBooks, setUserBooks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('books');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchUserData();
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's books
      const booksResponse = await booksAPI.getBooks({ 
        addedBy: user.id,
        limit: 100 // Get all user's books
      });
      
      // Fetch user's reviews
      const reviewsResponse = await reviewsAPI.getUserReviews(user.id, {
        limit: 100 // Get all user's reviews
      });

      if (booksResponse.data.success) {
        setUserBooks(booksResponse.data.books);
      }

      if (reviewsResponse.data.success) {
        setUserReviews(reviewsResponse.data.reviews);
      }
    } catch (error) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book? This will also delete all reviews for this book.')) {
      try {
        await booksAPI.deleteBook(bookId);
        setUserBooks(userBooks.filter(book => book._id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${
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

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile.</p>
        <Link to="/login" className="btn-primary mt-4 inline-block">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button onClick={fetchUserData} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {user.email}
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>{userBooks.length} Books Added</span>
            <span>{userReviews.length} Reviews Written</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'books'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          My Books ({userBooks.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'reviews'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          My Reviews ({userReviews.length})
        </button>
      </div>

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Books Added by You
            </h2>
            <Link to="/add-book" className="btn-primary">
              Add New Book
            </Link>
          </div>

          {userBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't added any books yet.
              </p>
              <Link to="/add-book" className="btn-primary">
                Add Your First Book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBooks.map(book => (
                <div key={book._id} className="relative">
                  <BookCard book={book} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Link
                      to={`/edit-book/${book._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      title="Edit Book"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      title="Delete Book"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Reviews Written by You
          </h2>

          {userReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                You haven't written any reviews yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.map(review => (
                <div key={review._id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        <Link 
                          to={`/book/${review.bookId._id}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {review.bookId.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        by {review.bookId.author}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {review.reviewText}
                  </p>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
