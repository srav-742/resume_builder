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

  // ✅ Profile fields — now includes summary
  fullName: { type: String, default: "" },
  phone: { type: String, default: "" },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other", "Prefer not to say"], 
    default: "" 
  },
  dateOfBirth: { type: Date }, // stored as ISO Date
  address: { type: String, default: "" },
  profilePicture: { type: String, default: "" }, // base64 or URL
  summary: { type: String, default: "" } // ✅ ADD THIS — for resume sync
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