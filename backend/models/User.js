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
  role: {
    type: String,
    enum: ["seeker", "recruiter", "admin"],
    default: "seeker"
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"]
  },
  dateOfBirth: { type: Date },
  address: { type: String },
  profilePicture: { type: String },
  summary: { type: String },

  // Job Seeker Profile Details
  skills: [{
    name: String,
    level: { type: String, enum: ["Beginner", "Intermediate", "Expert"] },
    isVerified: { type: Boolean, default: false }
  }],
  experience: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number
  }],
  preferences: {
    jobTypes: [String], // Full-time, Internship, Freelance
    workModes: [String], // Remote, Hybrid, Onsite
    expectedSalary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" }
    },
    locations: [String]
  },

  // Recruiter Specific
  company: {
    name: String,
    website: String,
    logo: String,
    description: String,
    verified: { type: Boolean, default: false }
  },

  // Gamification & Progress
  profileCompletion: { type: Number, default: 0 },
  reputationScore: { type: Number, default: 0 },

  selectedTemplate: {
    type: String,
    enum: ['template1', 'template2', 'template3', 'template4', 'template5', 'template6'],
    default: 'template6'
  }
}, {
  timestamps: true
});

// Hash password only if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);