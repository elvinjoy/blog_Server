const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, forgotPasswordValidation, verifyOTPValidation, resetPasswordValidation } = require('../validation/validation');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Validate request body
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    // Save user
    const savedUser = await user.save();
    
    // Return user details (excluding password)
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        userNumber: savedUser.userNumber
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    // Validate request body
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const validPassword = await user.comparePassword(req.body.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and assign a token
    const token = jwt.sign(
      { id: user._id, username: user.username, userNumber: user.userNumber },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userNumber: user.userNumber
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot password - request OTP
const requestPasswordReset = async (req, res) => {
  try {
    // Validate email
    const { error } = forgotPasswordValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Check if 20 seconds have passed since the last OTP request
    if (user.lastOTPRequestTime) {
      const timeDifference = new Date() - user.lastOTPRequestTime;
      const secondsElapsed = Math.floor(timeDifference / 1000);
      
      if (secondsElapsed < 20) {
        const timeRemaining = 20 - secondsElapsed;
        return res.status(429).json({ 
          message: `Please wait ${timeRemaining} seconds before requesting a new OTP`
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Set OTP expiry (30 seconds from now)
    const otpExpiry = new Date();
    otpExpiry.setSeconds(otpExpiry.getSeconds() + 30);
    
    // Update user with OTP and expiry
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    user.lastOTPRequestTime = new Date();
    
    await user.save();
    
    // In a real-world application, you would send the OTP via email or SMS
    // For demonstration purposes, we're sending it in the response
    return res.status(200).json({ 
      message: 'OTP sent successfully',
      otp: otp, // In production, remove this and send via email
      expiresIn: '30 seconds'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    // Validate input
    const { error } = verifyOTPValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists and has not expired
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({ message: 'No OTP requested for this user' });
    }

    const now = new Date();
    if (now > user.resetPasswordOTPExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, create a temporary token for password reset
    const resetToken = jwt.sign(
      { id: user._id, email: user.email, purpose: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' } // Token expires in 10 minutes
    );

    return res.status(200).json({
      message: 'OTP verified successfully',
      resetToken
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    // Validate input
    const { error } = resetPasswordValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Verify the reset token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Reset token is required' });
    }

    const resetToken = authHeader.split(' ')[1];
    
    try {
      // Verify and decode the token
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      
      // Check if token is for password reset and matches the email
      if (decoded.purpose !== 'password-reset' || decoded.email !== email) {
        return res.status(401).json({ message: 'Invalid reset token' });
      }
      
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Update user password and clear OTP fields
      user.password = hashedPassword;
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpiry = null;
      
      await user.save();
      
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  requestPasswordReset,
  verifyOTP,
  resetPassword
};