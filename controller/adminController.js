const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const { adminRegisterValidation, adminLoginValidation } = require('../validation/adminValidation');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const { categoryValidation } = require('../validation/categoryValidation');

// Register a new admin
const registerAdmin = async (req, res) => {
  try {
    // Validate request body
    const { error } = adminRegisterValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if email already exists
    const emailExists = await Admin.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if username already exists
    const usernameExists = await Admin.findOne({ username: req.body.username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new admin
    const admin = new Admin({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: 'admin'
    });

    // Save admin
    const savedAdmin = await admin.save();
    
    // Return admin details (excluding password)
    return res.status(201).json({
      message: 'Admin registered successfully',
      admin: {
        id: savedAdmin._id,
        username: savedAdmin.username,
        email: savedAdmin.email,
        adminNumber: savedAdmin.adminNumber,
        role: savedAdmin.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    // Validate request body
    const { error } = adminLoginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const validPassword = await admin.comparePassword(req.body.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and assign a token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        adminNumber: admin.adminNumber
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin functionality)
const getAllUsers = async (req, res) => {
  const { search = '', page = 1, limit = 5 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const query = {
      username: { $regex: search, $options: 'i' },
    };

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      users,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get user by ID (admin functionality)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    // Validate request body
    const { error } = categoryValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if category name already exists (case insensitive)
    const categoryExists = await Category.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
    });
    
    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Create new category
    const category = new Category({
      name: req.body.name,
      createdBy: req.admin.id
    });

    // Save category
    const savedCategory = await category.save();
    
    return res.status(201).json({
      message: 'Category created successfully',
      category: savedCategory
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const allCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ userNumber: req.params.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete another admin' });
    }

    await User.deleteOne({ userNumber: req.params.id });
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  getUserById,
  createCategory,
  deleteCategory,
  allCategories,
  deleteUser
};