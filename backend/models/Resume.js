// backend/models/Resume.js
const mongoose = require('mongoose');

// Personal Info Sub-Schema
const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  summary: { type: String, default: '' },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', ''], // ✅ CHANGED TO LOWERCASE
    default: '' 
  },
  dateOfBirth: { type: String, default: '' }, // YYYY-MM-DD
  address: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
}, { _id: false });

// Education Sub-Schema
const educationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  location: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  startDate: { type: String, default: '' }, // YYYY-MM or YYYY-MM-DD
  endDate: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

// Work Experience Sub-Schema
const workExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  currentlyWorking: { type: Boolean, default: false },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, default: '' },
  achievements: [{
    text: { type: String, default: '' }
  }]
}, { _id: false });

// Project Sub-Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
}, { _id: false });

// Additional Section Item
const additionalSectionItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
}, { _id: false });

// Additional Section (e.g., Certifications, Languages)
const additionalSectionSchema = new mongoose.Schema({
  type: { type: String, default: '' }, // e.g., "Certifications"
  title: { type: String, default: '' }, // e.g., "My Certifications"
  items: [additionalSectionItemSchema]
}, { _id: false });

// Main Resume Schema
const resumeSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    index: true
  },
  template: {
    type: String,
    default: 'modern'
  },
  personalInfo: {
    type: personalInfoSchema,
    default: {}
  },
  education: {
    type: [educationSchema],
    default: []
  },
  workExperience: {
    type: [workExperienceSchema],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  projects: {
    type: [projectSchema],
    default: []
  },
  additionalSections: {
    type: [additionalSectionSchema],
    default: []
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Resume', resumeSchema);