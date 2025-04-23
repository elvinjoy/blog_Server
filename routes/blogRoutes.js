const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const blogController = require('../controller/blogController');
const blogAuth = require('../middleware/blogAuthentication');

// Now here you call .array
router.post('/create', blogAuth, upload.array('images', 2), blogController.createBlog);

router.get('/all-blogs', blogController.getAllBlogs);
router.get('/blogs/:blogId', blogController.getBlogById);

router.put('/blogs/:blogId', blogAuth, upload.array('images', 2), blogController.updateBlog);
router.delete('/blogs/:blogId', blogAuth, blogController.deleteBlog);

module.exports = router;