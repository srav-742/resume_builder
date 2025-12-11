// routes/resume.js
const express = require('express');
const authenticate = require('../middleware/auth');
const Resume = require('../models/Resume');
const User = require('../models/User');

const router = express.Router();

// GET /api/resume
router.get('/', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    // Get the most recent resume
    const resumes = await Resume.find({ firebaseUid }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch resume data' });
  }
});

// POST /api/resume
router.post('/', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const resumeData = req.body;

    // 1. Ensure User Profile exists
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
    if (!dobStr && userProfile.dateOfBirth) {
      dobStr = userProfile.dateOfBirth instanceof Date
        ? userProfile.dateOfBirth.toISOString().split('T')[0]
        : userProfile.dateOfBirth || '';
    }

    const enrichedPersonalInfo = {
      fullName: (incoming.fullName || userProfile.fullName || "").trim(),
      email: req.user.email,
      phone: (incoming.phone || userProfile.phone || "").trim(),
      location: (incoming.location || (userProfile.address || "").split('\n')[0] || "").trim(),
      summary: (incoming.summary || userProfile.summary || "").trim(),
      gender: incoming.gender || userProfile.gender || "",
      dateOfBirth: dobStr || "",
      address: (incoming.address || userProfile.address || "").trim(),
      profilePicture: incoming.profilePicture || userProfile.profilePicture || "",
    };

    // 3. Construct Clean Data (FIXED: Added missing fields and fixed mappings)
    const cleanData = {
      firebaseUid,
      personalInfo: enrichedPersonalInfo,
      // Map 'experience' from frontend to 'workExperience' in DB Schema
      workExperience: resumeData.experience || resumeData.workExperience || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      additionalSections: resumeData.additionalSections || [],
      template: resumeData.template || 'template1', // Default to template1
      updatedAt: new Date(),
    };

    // 4. Update or Create
    let resume = await Resume.findOne({ firebaseUid });
    if (resume) {
      resume.set(cleanData);
      await resume.save();
    } else {
      resume = new Resume(cleanData);
      await resume.save();
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save resume. Please try again.',
    });
  }
});

// PUT /api/resume/:id
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

    // Update fields if present in request
    if (updateData.personalInfo) {
      resume.personalInfo = { ...resume.personalInfo, ...updateData.personalInfo };
    }
    if (updateData.education) resume.education = updateData.education;
    // Handle both 'experience' and 'workExperience' keys
    if (updateData.experience) resume.workExperience = updateData.experience;
    if (updateData.workExperience) resume.workExperience = updateData.workExperience;
    
    if (updateData.skills) resume.skills = updateData.skills;
    if (updateData.projects) resume.projects = updateData.projects;
    if (updateData.additionalSections) resume.additionalSections = updateData.additionalSections;
    
    if (updateData.template) resume.template = updateData.template;

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