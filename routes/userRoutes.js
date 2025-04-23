const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  requestPasswordReset, 
  verifyOTP, 
  resetPassword 
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

module.exports = router;