const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to convert name to lowercase
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name = this.name.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);