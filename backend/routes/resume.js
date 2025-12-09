const express = require('express');
const authenticate = require('../middleware/auth');
const Resume = require('../models/Resume');
const User = require('../models/User');

const router = express.Router();

// ✅ GET /api/resume → fetch user's resumes (note: route is /api/resume, not /api/user/resumes)
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

// ✅ POST /api/resume → save/update resume
router.post('/', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const resumeData = req.body;

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
    let dobStr = incoming.dateOfBirth;
    if (!dobStr && userProfile.dateOfBirth) {
      dobStr = userProfile.dateOfBirth.toISOString().split('T')[0];
    }

    const enrichedPersonalInfo = {
      fullName: (incoming.fullName || userProfile.fullName || "").trim(),
      email: req.user.email,
      phone: (incoming.phone || userProfile.phone || "").trim(),
      location: (incoming.location || userProfile.address || "").split('\n')[0].trim(),
      summary: (incoming.summary || userProfile.summary || "").trim(),
      gender: incoming.gender || userProfile.gender || "",
      dateOfBirth: dobStr || "",
      address: (incoming.address || userProfile.address || "").trim(),
      profilePicture: incoming.profilePicture || userProfile.profilePicture || "",
    };

    const cleanData = {
      ...resumeData,
      firebaseUid, // ✅ use firebaseUid
      personalInfo: enrichedPersonalInfo,
      updatedAt: new Date(),
    };

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
      error: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to save resume. Please try again.'
    });
  }
});

// ✅ PUT /api/resume/:id → update by ID
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

    resume.set({
      ...updateData,
      firebaseUid,
      updatedAt: new Date(),
    });
    await resume.save();

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resume'
    });
  }
});

// ✅ DELETE /api/resume/:id
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
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume'
    });
  }
});

module.exports = router;