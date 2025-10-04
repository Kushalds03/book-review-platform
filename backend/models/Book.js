const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    minlength: [1, 'Author must be at least 1 character long'],
    maxlength: [100, 'Author cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    enum: {
      values: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Technology', 'Other'],
      message: 'Please select a valid genre'
    }
  },
  year: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Year must be a valid year'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
