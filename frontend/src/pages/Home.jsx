import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../api';
import BookCard from '../components/BookCard';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Ref for search input to focus automatically
  const searchInputRef = useRef(null);

  const genres = [
    'All', 'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 
    'Science Fiction', 'Fantasy', 'Biography', 'History', 
    'Self-Help', 'Business', 'Technology', 'Other'
  ];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 5,
        search: searchTerm || undefined,
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        sortBy: sortBy === 'newest' ? undefined : sortBy,
        sortOrder
      };

      const response = await booksAPI.getBooks(params);
      if (response.data.success) {
        setBooks(response.data.books);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm, selectedGenre, sortBy, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
    // Focus the search input after search
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearchButtonClick = () => {
    setCurrentPage(1);
    fetchBooks();
    // Focus the search input after search
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 mx-1 rounded ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="px-3 py-2 mx-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="px-3 py-2 mx-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

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
        <button onClick={fetchBooks} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Book Review Platform
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and review amazing books
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-4">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary" onClick={handleSearchButtonClick}>
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-4">
          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre:
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="input-field"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="year">Published Year</option>
              <option value="rating">Average Rating</option>
            </select>
          </div>

          {sortBy !== 'newest' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order:
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="input-field"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No books found matching your criteria.
          </p>
          {isAuthenticated && (
            <Link to="/add-book" className="btn-primary mt-4 inline-block">
              Add the First Book
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default Home;
