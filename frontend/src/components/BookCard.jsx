import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {book.title}
        </h3>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
          {book.genre}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
        by <span className="font-medium">{book.author}</span>
      </p>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {book.description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          {renderStars(book.averageRating)}
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            ({book.averageRating.toFixed(1)})
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Published: {book.year}
        </span>
        <Link
          to={`/book/${book._id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
