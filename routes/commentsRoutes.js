const express = require('express');
const router = express.Router();
const commentsController = require('../controller/commentsController');
const commentAuth = require('../middleware/commentAuth');

// Route to create a new comment
router.post('/addcomment', commentsController.createComment);

// Route to get comments for a specific blog post
router.get('getcomments/:blogId', commentsController.getCommentsByBlogId);

router.delete('/deletecomment/:commentId', commentsController.deleteComment);
module.exports = router;
