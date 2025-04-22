const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  userNumber: {
    type: String,
    unique: true
  },
  resetPasswordOTP: {
    type: String,
    default: null
  },
  resetPasswordOTPExpiry: {
    type: Date,
    default: null
  },
  lastOTPRequestTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // Generate user number if new user
    if (this.isNew) {
      // Find the last user to get the latest user number
      const lastUser = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
      
      if (lastUser && lastUser.userNumber) {
        // Extract the number part
        const lastNumber = parseInt(lastUser.userNumber.replace('USER', ''));
        // Generate the new padded number
        this.userNumber = `USER${String(lastNumber + 1).padStart(3, '0')}`;
      } else {
        // First user
        this.userNumber = 'USER001';
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);