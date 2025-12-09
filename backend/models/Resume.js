// backend/models/Resume.js
const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  summary: { type: String, default: '' },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other', ''], 
    default: '' 
  },
  dateOfBirth: { type: String, default: '' }, // Keep as string (YYYY-MM-DD)
  address: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    index: true
  },
  personalInfo: {
    type: personalInfoSchema,
    default: {}
  },
  // Add other sections as needed (e.g., education, experience, template, etc.)
  // Example:
  // education: [{ type: mongoose.Schema.Types.Mixed }],
  // experience: [{ type: mongoose.Schema.Types.Mixed }],
  // template: { type: String, default: 'modern' }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Resume', resumeSchema);