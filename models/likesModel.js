const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true
  },
  userNumber: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can only like a blog once
likeSchema.index({ blogId: 1, userNumber: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;