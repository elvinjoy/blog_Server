const Blog = require('../models/blogModel');
const blogValidation = require('../validation/blogValidation');

exports.createBlog = async (req, res) => {
  try {
    // Validate text fields
    const { error } = blogValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if exactly 2 images are uploaded
    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({ message: 'Exactly 2 images are required' });
    }

    const { title, description, category } = req.body;

    // Map uploaded images
    const images = req.files.map(file => `/uploads/${file.filename}`);

    // Auto-generate blogId
    const lastBlog = await Blog.findOne().sort({ createdAt: -1 });
    let blogId = 'BLOG001';
    if (lastBlog) {
      const lastId = parseInt(lastBlog.blogId.replace('BLOG', ''));
      blogId = `BLOG${(lastId + 1).toString().padStart(3, '0')}`;
    }

    // 👇 Get userNumber from req.user (set by auth middleware)
    const createdBy = req.user?.userNumber;
    if (!createdBy) {
      return res.status(400).json({ message: 'User Number missing in request' });
    }

    const newBlog = new Blog({
      blogId,
      title,
      description,
      category,
      images,
      createdBy, // 👈 Save the user's custom number like "USER004"
    });

    await newBlog.save();

    return res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ blogs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findOne({ blogId });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findOne({ blogId });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const { title, description, category } = req.body;

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (category) blog.category = category;

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      blog.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    await blog.save();

    return res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findOne({ blogId });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();

    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
