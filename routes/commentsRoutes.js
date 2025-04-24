// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentsController');
const authenticate = require('../middleware/commentAuthentication');

// Create comment (protected route)
router.post('/addcomment/:id', authenticate, commentController.createComment);

// Get comments for a blog
router.get('/:blogId', commentController.getCommentsByBlogId);

// Delete comment (protected route)
router.delete('/delete/:commentId', authenticate, commentController.deleteComment);

module.exports = router;