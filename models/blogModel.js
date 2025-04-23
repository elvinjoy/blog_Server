const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs
    required: true,
    validate: [arrayLimit, 'Two images are required.'],
  },
  createdBy: {
    type: String, 
    required: true, 
  }, // 👈 NEW: Save user's custom number like "USER004"
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Custom validation for the images array (ensure it has exactly 2 images)
function arrayLimit(val) {
  return val.length === 2;
}

// Middleware to auto-generate Blog ID before saving
blogSchema.pre('save', async function(next) {
  if (!this.isNew) return next();

  try {
    const lastBlog = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastBlog && lastBlog.blogId) {
      const lastNumber = parseInt(lastBlog.blogId.replace('BLOG', ''));
      this.blogId = `BLOG${String(lastNumber + 1).padStart(3, '0')}`;
    } else {
      this.blogId = 'BLOG001';
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Blog', blogSchema);
