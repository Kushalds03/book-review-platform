# 🚀 Deployment Guide for Book Review Platform

## Overview
This guide will help you deploy your MERN Book Review Platform to production using:
- **Frontend**: Netlify (free static hosting)
- **Backend**: Render (free Node.js hosting)
- **Database**: MongoDB Atlas (already configured)

## Prerequisites
- GitHub account
- Netlify account (free)
- Render account (free)
- MongoDB Atlas cluster (already set up)

## Step 1: Prepare Your Code for GitHub

### 1.1 Initialize Git Repository
```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit: Book Review Platform"
```

### 1.2 Create GitHub Repository
1. Go to GitHub.com and create a new repository
2. Name it: `book-review-platform`
3. Make it public (required for free Netlify deployment)
4. Don't initialize with README (you already have one)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/book-review-platform.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `book-review-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Set Environment Variables
In Render dashboard, go to Environment tab and add:
```
MONGODB_URI=mongodb+srv://kushalkush132003_db_user:qRDpBiRwi2lKFE2a@book-review.beensbx.mongodb.net/?retryWrites=true&w=majority&appName=book-review
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
NODE_ENV=production
FRONTEND_URL=https://your-app-name.netlify.app
```

### 2.4 Deploy
Click "Create Web Service" and wait for deployment (5-10 minutes)

## Step 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 3.2 Deploy Frontend
1. Click "New site from Git"
2. Choose GitHub
3. Select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 3.3 Set Environment Variables
In Netlify dashboard, go to Site settings → Environment variables and add:
```
VITE_API_URL=https://your-backend-service.onrender.com/api
```

### 3.4 Deploy
Click "Deploy site" and wait for deployment (3-5 minutes)

## Step 4: Update Backend CORS

After getting your Netlify URL, update the backend CORS settings:

1. Go to Render dashboard
2. Find your backend service
3. Go to Environment tab
4. Update `FRONTEND_URL` to your actual Netlify URL
5. Redeploy the service

## Step 5: Test Your Deployment

### 5.1 Test Backend
Visit: `https://your-backend-service.onrender.com/api/health`
Should return: `{"message":"Book Review Platform API is running!"}`

### 5.2 Test Frontend
Visit your Netlify URL and test:
- User registration/login
- Adding books
- Writing reviews
- Search functionality

## Step 6: Custom Domain (Optional)

### 6.1 Netlify Custom Domain
1. Go to Site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed

### 6.2 Update Environment Variables
Update `FRONTEND_URL` in Render with your custom domain

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your Netlify URL exactly
   - Check that CORS is configured for both HTTP and HTTPS

2. **Build Failures**
   - Check that all dependencies are in package.json
   - Ensure build commands are correct

3. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Ensure no trailing spaces in values

4. **Database Connection**
   - Verify MongoDB Atlas allows connections from Render's IP ranges
   - Check connection string is correct

### Useful Commands:

```bash
# Check build locally
cd frontend
npm run build

# Test production build locally
cd frontend
npm run preview

# Check backend locally
cd backend
npm start
```

## Cost Breakdown

- **Netlify**: Free (100GB bandwidth/month)
- **Render**: Free (750 hours/month)
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: $0/month

## Security Notes

1. **JWT Secret**: Use a strong, random secret for production
2. **MongoDB**: Ensure your cluster has proper security settings
3. **CORS**: Only allow your specific domains
4. **Rate Limiting**: Already configured in the backend

## Monitoring

- **Netlify**: Built-in analytics and logs
- **Render**: Built-in metrics and logs
- **MongoDB Atlas**: Built-in monitoring

Your Book Review Platform will be live and accessible worldwide! 🌍
