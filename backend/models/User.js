// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },

  // ✅ FIXED: Removed invalid default=""
  fullName: { type: String },
  phone: { type: String },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other", "Prefer not to say"]
    // 👆 No default → field is optional and can be undefined
  },
  dateOfBirth: { type: Date }, // stored as ISO Date
  address: { type: String },
  profilePicture: { type: String }, // base64 or URL
  summary: { type: String },
  
  // ✅ ADDED: selectedTemplate field for resume template persistence
  selectedTemplate: {
    type: String,
    enum: ['template1', 'template2', 'template3', 'template4', 'template5', 'template6'],
    default: 'template6'
  }
}, {
  timestamps: true
});

// Hash password only if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);