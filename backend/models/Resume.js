// backend/models/Resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  firebaseUid: {  // ✅ MUST be firebaseUid
    type: String,
    required: true,
    index: true
  },
  // ... other fields (template, personalInfo, etc.)
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);