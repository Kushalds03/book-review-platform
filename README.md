# 📚 Book Review Platform

A full-stack MERN application that allows users to discover, review, and manage books. Built with MongoDB, Express.js, React.js, and Node.js.

## 🌟 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and middleware
- User profile management

### Book Management
- Add, edit, and delete books
- Search books by title and author
- Filter books by genre
- Sort books by published year or average rating
- Pagination (5 books per page)
- Only book creators can edit/delete their books

### Review System
- Rate books from 1-5 stars
- Write detailed reviews
- Edit and delete your own reviews
- View all reviews for each book
- Calculate and display average ratings
- Rating distribution charts

### User Interface
- Responsive design with Tailwind CSS
- Dark/Light mode toggle
- Modern and clean UI/UX
- Interactive charts with Recharts
- Real-time search and filtering

## 🏗️ Project Structure

```
Library/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   └── env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── BookCard.jsx
    │   │   ├── ReviewCard.jsx
    │   │   └── RatingChart.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── BookDetails.jsx
    │   │   ├── AddEditBook.jsx
    │   │   └── Profile.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Library
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**

   **Backend (.env)**
   ```env
   MONGODB_URI=mongodb://localhost:27017/bookreview
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the Application**

   **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

   **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user (requires authentication)

### Book Endpoints

#### GET /api/books
Get all books with pagination, search, filter, and sort
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Books per page (default: 5)
- `search`: Search term for title/author
- `genre`: Filter by genre
- `sortBy`: Sort by 'year' or 'rating'
- `sortOrder`: 'asc' or 'desc'

#### GET /api/books/:id
Get single book by ID

#### POST /api/books
Create new book (requires authentication)
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "genre": "Fiction",
  "year": 2023
}
```

#### PUT /api/books/:id
Update book (requires authentication, only by creator)

#### DELETE /api/books/:id
Delete book (requires authentication, only by creator)

#### GET /api/books/:id/ratings
Get rating distribution for a book

### Review Endpoints

#### GET /api/reviews/book/:bookId
Get all reviews for a book

#### GET /api/reviews/user/:userId
Get all reviews by a user

#### POST /api/reviews
Create new review (requires authentication)
```json
{
  "bookId": "book_id",
  "rating": 5,
  "reviewText": "Great book!"
}
```

#### PUT /api/reviews/:id
Update review (requires authentication, only by author)

#### DELETE /api/reviews/:id
Delete review (requires authentication, only by author)

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model
```javascript
{
  title: String (required, 1-200 chars),
  author: String (required, 1-100 chars),
  description: String (required, 10-2000 chars),
  genre: String (required, enum),
  year: Number (required, 1000-current year),
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  bookId: ObjectId (ref: Book),
  userId: ObjectId (ref: User),
  rating: Number (required, 1-5),
  reviewText: String (required, 10-1000 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Features

### Pages
- **Home**: Browse all books with search, filter, and pagination
- **Login/Signup**: User authentication forms
- **Book Details**: View book info, reviews, and rating charts
- **Add/Edit Book**: Create or modify book entries
- **Profile**: View user's books and reviews

### Components
- **Navbar**: Navigation with dark mode toggle
- **BookCard**: Display book information in cards
- **ReviewCard**: Show individual reviews
- **RatingChart**: Visualize rating distribution

### Features
- Responsive design for all screen sizes
- Dark/Light mode with system preference detection
- Real-time search and filtering
- Interactive star ratings
- Form validation and error handling
- Loading states and error boundaries

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet.js for security headers
- Protected routes and ownership checks

## 🚀 Deployment

### Quick Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Recommended Setup:**
- **Frontend**: Netlify (free)
- **Backend**: Render (free)
- **Database**: MongoDB Atlas (already configured)

### Backend Deployment (Render)

1. **Create Render account** and connect GitHub
2. **Create new Web Service**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-super-secure-jwt-secret
   NODE_ENV=production
   FRONTEND_URL=https://your-netlify-app.netlify.app
   ```

### Frontend Deployment (Netlify)

1. **Create Netlify account** and connect GitHub
2. **Deploy from Git**:
   - Base Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `frontend/dist`
3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```

### Cost: $0/month (completely free!)

## 🛠️ Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **helmet**: Security middleware
- **cors**: Cross-origin resource sharing

### Frontend
- **React.js**: Frontend framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling framework
- **Recharts**: Chart library
- **Vite**: Build tool

## 📝 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] Book recommendations based on user preferences
- [ ] Social features (follow users, like reviews)
- [ ] Book wishlist functionality
- [ ] Advanced search with filters
- [ ] Book cover image uploads
- [ ] Email notifications
- [ ] Mobile app with React Native
- [ ] Admin dashboard
- [ ] Book import from external APIs
- [ ] Review helpfulness voting

## 📞 Support

If you have any questions or need help, please open an issue in the repository.

---

**Happy Reading! 📚✨**
