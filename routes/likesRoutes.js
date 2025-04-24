const express = require('express');
const router = express.Router();
const likeController = require('../controller/likesController');
const { authenticate } = require('../middleware/likesMiddleware'); // Import the specific function, not the whole module

// Like a blog
router.post('/like/:blogId', authenticate, likeController.likeBlog);

// Unlike a blog
router.post('/unlike/:blogId', authenticate, likeController.unlikeBlog);

// Get all blogs liked by the current user
router.get('/user-likes', authenticate, likeController.getUserLikes);

module.exports = router;