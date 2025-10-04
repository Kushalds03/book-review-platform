#!/bin/bash

# Book Review Platform - Quick Start Script
# This script helps you set up the development environment quickly

echo "🚀 Book Review Platform - Quick Start Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Make sure MongoDB is installed and running."
    echo "   Or use MongoDB Atlas for cloud database."
fi

echo "✅ Node.js found: $(node --version)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "✅ Backend .env file created. Please update with your MongoDB URI and JWT secret."
else
    echo "✅ Backend .env file already exists."
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

echo "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "✅ Frontend .env file created."
else
    echo "✅ Frontend .env file already exists."
fi

cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Start MongoDB (if using local installation)"
echo "3. Start the backend server:"
echo "   cd backend && npm run dev"
echo "4. Start the frontend server (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "🌐 Access the application at: http://localhost:5173"
echo "📡 API available at: http://localhost:5000"
echo ""
echo "📚 For detailed setup instructions, see README.md"
