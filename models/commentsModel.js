// models/commentModel.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true
  },
  userNumber: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);