const Blog = require('../models/blogModel');
const Like = require('../models/likesModel');

exports.likeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userNumber = req.user.userNumber;
    
    // Find the blog by blogId
    const blog = await Blog.findOne({ blogId });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user has already liked this blog
    const userLiked = await Like.findOne({ blogId, userNumber });
    
    if (userLiked) {
      return res.status(400).json({ message: 'You have already liked this blog' });
    }
    
    // Create a new like
    const newLike = new Like({
      blogId,
      userNumber,
      username: req.user.username
    });
    
    await newLike.save();
    
    // Update the blog's likes count
    blog.likesCount = (blog.likesCount || 0) + 1;
    await blog.save();
    
    res.status(200).json({ message: 'Blog liked successfully', likesCount: blog.likesCount });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ message: 'Failed to like blog', error: error.message });
  }
};

exports.unlikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userNumber = req.user.userNumber;
    
    // Find the blog by blogId
    const blog = await Blog.findOne({ blogId });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user has liked this blog
    const userLiked = await Like.findOne({ blogId, userNumber });
    
    if (!userLiked) {
      return res.status(400).json({ message: 'You have not liked this blog' });
    }
    
    // Remove the like
    await Like.findOneAndDelete({ blogId, userNumber });
    
    // Update the blog's likes count
    blog.likesCount = Math.max((blog.likesCount || 1) - 1, 0);
    await blog.save();
    
    res.status(200).json({ message: 'Blog unliked successfully', likesCount: blog.likesCount });
  } catch (error) {
    console.error('Error unliking blog:', error);
    res.status(500).json({ message: 'Failed to unlike blog', error: error.message });
  }
};

exports.getUserLikes = async (req, res) => {
  try {
    const userNumber = req.user.userNumber;
    
    // Find all blogs liked by this user
    const userLikes = await Like.find({ userNumber });
    
    // Extract the blog IDs
    const likedBlogs = userLikes.map(like => like.blogId);
    
    res.status(200).json({ likedBlogs });
  } catch (error) {
    console.error('Error fetching user likes:', error);
    res.status(500).json({ message: 'Failed to fetch user likes', error: error.message });
  }
};