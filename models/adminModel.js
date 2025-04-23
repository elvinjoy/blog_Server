const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
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
  adminNumber: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password
adminSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // Generate admin number if new admin
    if (this.isNew) {
      // Find the last admin to get the latest admin number
      const lastAdmin = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
      
      if (lastAdmin && lastAdmin.adminNumber) {
        // Extract the number part
        const lastNumber = parseInt(lastAdmin.adminNumber.replace('ADMIN', ''));
        // Generate the new padded number
        this.adminNumber = `ADMIN${String(lastNumber + 1).padStart(3, '0')}`;
      } else {
        // First admin
        this.adminNumber = 'ADMIN001';
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);