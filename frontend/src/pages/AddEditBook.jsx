import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../api';

const AddEditBook = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: 'Fiction',
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 
    'Science Fiction', 'Fantasy', 'Biography', 'History', 
    'Self-Help', 'Business', 'Technology', 'Other'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEdit) {
      fetchBook();
    }
  }, [id, isAuthenticated, navigate]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getBookById(id);
      if (response.data.success) {
        const book = response.data.book;
        setFormData({
          title: book.title,
          author: book.author,
          description: book.description,
          genre: book.genre,
          year: book.year
        });
      }
    } catch (error) {
      setError('Failed to fetch book details');
      console.error('Error fetching book:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isEdit) {
        response = await booksAPI.updateBook(id, formData);
      } else {
        response = await booksAPI.createBook(formData);
      }

      if (response.data.success) {
        navigate(`/book/${response.data.book._id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} book`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {isEdit ? 'Edit Book' : 'Add New Book'}
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter book title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter author name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="input-field"
              placeholder="Enter book description"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre *
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="input-field"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Published Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1000"
              max={new Date().getFullYear()}
              className="input-field"
              placeholder="Enter published year"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Book' : 'Add Book')}
            </button>
            <Link
              to={isEdit ? `/book/${id}` : '/'}
              className="btn-secondary flex-1 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditBook;
