const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAllUsers, getUserById, createCategory, allCategories, deleteCategory, deleteUser } = require('../controller/adminController');
const { adminAuth} = require('../middleware/adminMiddleware');

// Admin registration (typically restricted or done manually for security)
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// Get all users (admin protected route)
router.get('/users', adminAuth, getAllUsers);

// Get user by ID (admin protected route)
router.get('/users/:id', adminAuth, getUserById);

router.post('/add-categories', adminAuth, createCategory)

router.get('/get-categories', adminAuth, allCategories)

router.delete('/delete-categories/:id', adminAuth, deleteCategory)

router.delete('/delete-user/:id', adminAuth, deleteUser)

module.exports = router;