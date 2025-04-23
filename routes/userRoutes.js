const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  requestPasswordReset, 
  verifyOTP, 
  resetPassword,
  getAllCategories,
  getBlogsByUser
} = require('../controller/userController');
const { authenticate } = require('../middleware/authentication');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', authenticate, getUserProfile);

// Forgot password flow
router.post('/forgot-password', requestPasswordReset);
router.post('/verify-otp', verifyOTP);
router.patch('/reset-password', resetPassword);

// Get all categories (admin functionality)
router.get('/categories', getAllCategories);

router.get('/blogs/:userNumber', authenticate, getBlogsByUser);

module.exports = router;