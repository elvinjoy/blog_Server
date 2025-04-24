// controllers/commentController.js
const Comment = require('../models/commentsModel');
const User = require('../models/userModel');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    
    // Get userNumber from authenticated user
    const userNumber = req.user.userNumber;
    const username = req.user.username;
    
    // Validate required fields
    if (!blogId || !content) {
      return res.status(400).json({ message: 'Blog ID and comment content are required' });
    }
    
    // Create new comment
    const newComment = new Comment({
      blogId,
      userNumber,
      username,
      content
    });
    
    // Save comment
    const savedComment = await newComment.save();
    
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
};

// Get all comments for a blog
exports.getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    // Find all comments for this blog
    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
    
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
};

// Delete a comment (optional, for moderation)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Find and delete comment
    const comment = await Comment.findById(commentId);
    
    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is authorized to delete (either admin or comment owner)
    if (req.user.role !== 'admin' && comment.userNumber !== req.user.userNumber) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
};