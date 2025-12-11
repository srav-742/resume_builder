// backend/routes/resume.js
const express = require('express');
const authenticate = require('../middleware/auth');
const Resume = require('../models/Resume');
const User = require('../models/User');

const router = express.Router();

// GET /api/resume
// Fetches ALL resumes for the logged-in user (for the Profile list)
router.get('/', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    // Find all resumes belonging to this user, sorted by newest first
    const resumes = await Resume.find({ firebaseUid }).sort({ updatedAt: -1 });
    res.status(200).json(resumes); // Return the array directly or { success: true, resumes } depending on frontend expectation. Standard is often array for lists.
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch resume data' });
  }
});

// GET /api/resume/:id
// Fetches a SINGLE resume by ID (for loading into the Builder)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid: firebaseUid } = req.user;
    
    const resume = await Resume.findOne({ _id: id, firebaseUid });
    
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }
    
    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error('Error fetching single resume:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch resume' });
  }
});

// POST /api/resume
// Creates a NEW resume
router.post('/', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const resumeData = req.body;

    // 1. Ensure User Profile exists (Sync basic info)
    let userProfile = await User.findOne({ firebaseUid });
    if (!userProfile) {
      userProfile = new User({
        firebaseUid,
        email: req.user.email,
        name: req.user.name || null,
      });
      await userProfile.save();
    }

    // 2. Prepare Personal Info
    const incoming = resumeData.personalInfo || {};
    let dobStr = incoming.dateOfBirth;
    // Fallback to user profile DOB if not in resume
    if (!dobStr && userProfile.dateOfBirth) {
       dobStr = userProfile.dateOfBirth instanceof Date 
         ? userProfile.dateOfBirth.toISOString().split('T')[0] 
         : userProfile.dateOfBirth || '';
    }

    const enrichedPersonalInfo = {
      fullName: (incoming.fullName || userProfile.fullName || "").trim(),
      email: req.user.email, // Always use authenticated email
      phone: (incoming.phone || userProfile.phone || "").trim(),
      location: (incoming.location || (userProfile.address || "").split('\n')[0] || "").trim(),
      summary: (incoming.summary || userProfile.summary || "").trim(),
      gender: incoming.gender || userProfile.gender || "",
      dateOfBirth: dobStr || "",
      address: (incoming.address || userProfile.address || "").trim(),
      profilePicture: incoming.profilePicture || userProfile.profilePicture || "",
    };

    // 3. Construct Resume Object
    // UPDATED: Mapping fields correctly to the Schema
    const cleanData = {
      firebaseUid,
      template: resumeData.template || 'template1', // Default to template1
      personalInfo: enrichedPersonalInfo,
      education: resumeData.education || [],
      workExperience: resumeData.workExperience || [], // FIXED: Was 'experience'
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      additionalSections: resumeData.additionalSections || [],
      updatedAt: new Date(),
    };

    // 4. Create NEW Resume (Supports Multiple Resumes)
    const resume = new Resume(cleanData);
    await resume.save();

    res.status(201).json({ success: true, resume });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save resume. Please try again.',
    });
  }
});

// PUT /api/resume/:id
// Updates an EXISTING resume
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid: firebaseUid } = req.user;
    const updateData = req.body;

    const resume = await Resume.findOne({ _id: id, firebaseUid });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or access denied'
      });
    }

    // Update fields if they are provided in the request
    if (updateData.personalInfo) {
      resume.personalInfo = { ...resume.personalInfo, ...updateData.personalInfo };
    }
    if (updateData.education !== undefined) resume.education = updateData.education;
    if (updateData.workExperience !== undefined) resume.workExperience = updateData.workExperience; // FIXED: Was 'experience'
    if (updateData.skills !== undefined) resume.skills = updateData.skills;
    if (updateData.projects !== undefined) resume.projects = updateData.projects;
    if (updateData.additionalSections !== undefined) resume.additionalSections = updateData.additionalSections;
    if (updateData.template !== undefined) resume.template = updateData.template;

    resume.updatedAt = new Date();
    await resume.save();

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ success: false, error: 'Failed to update resume' });
  }
});

// DELETE /api/resume/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid: firebaseUid } = req.user;

    const result = await Resume.deleteOne({ _id: id, firebaseUid });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or access denied'
      });
    }

    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ success: false, error: 'Failed to delete resume' });
  }
});

module.exports = router;