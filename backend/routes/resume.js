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

    // Ensure User exists (minimal creation)
    let userProfile = await User.findOne({ firebaseUid });
    if (!userProfile) {
      userProfile = new User({
        firebaseUid,
        email: req.user.email,
        name: req.user.name || null,
      });
      await userProfile.save();
    }

    const incoming = resumeData.personalInfo || {};
    
    // Keep dateOfBirth as string (YYYY-MM-DD)
    let dobStr = incoming.dateOfBirth;
    if (!dobStr && userProfile.dateOfBirth) {
      // If stored as Date in User, convert; else use as-is
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

    const cleanData = {
      firebaseUid,
      personalInfo: enrichedPersonalInfo,
      // Include other top-level fields if sent (e.g., education, template, etc.)
      ...(resumeData.education !== undefined && { education: resumeData.education }),
      ...(resumeData.experience !== undefined && { experience: resumeData.experience }),
      ...(resumeData.template !== undefined && { template: resumeData.template }),
      updatedAt: new Date(),
    };

    // Upsert: find or create
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
    // Always show error in development; you can disable later
    res.status(500).json({
      success: false,
      error: 'Failed to save resume. Please try again.',
      // Uncomment below for debugging only:
      // details: error.message
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

    // Allow partial updates
    if (updateData.personalInfo) {
      resume.personalInfo = { ...resume.personalInfo, ...updateDdata.personalInfo };
    }
    if (updateData.education !== undefined) resume.education = updateData.education;
    if (updateData.experience !== undefined) resume.experience = updateData.experience;
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