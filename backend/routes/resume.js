const express = require('express');
const authenticate = require('../middleware/auth');
const Resume = require('../models/Resume');
const User = require('../models/User'); // ✅ Added import

const router = express.Router(); // ✅ Critical: router must be declared

// =============== EXISTING ROUTES (UPDATED FOR SAFETY) ===============

// GET /api/user/resumes → fetch user's resumes
router.get('/user/resumes', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const resumes = await Resume.find({ userId: firebaseUid }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch resume data' });
  }
});

// POST /api/user/resumes → save or update user's resume (ENRICHED WITH PROFILE)
router.post('/user/resumes', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const resumeData = req.body;

    // ✅ Fetch or create user profile
    let userProfile = await User.findOne({ firebaseUid });

    if (!userProfile) {
      userProfile = new User({
        firebaseUid,
        email: req.user.email,
        name: req.user.name || null,
      });
      await userProfile.save();
    }

    // ✅ Extract and safely normalize incoming personalInfo
    const incoming = resumeData.personalInfo || {};

    // ✅ Safely handle dateOfBirth (string from frontend ↔ Date in DB)
    let dobStr = incoming.dateOfBirth;
    if (!dobStr && userProfile.dateOfBirth) {
      const iso = userProfile.dateOfBirth.toISOString();
      dobStr = iso.split('T')[0]; // "YYYY-MM-DD"
    }

    // ✅ Build enriched personalInfo — resume + profile merge
    const enrichedPersonalInfo = {
      fullName: (incoming.fullName || userProfile.fullName || "").trim(),
      email: req.user.email, // always from Firebase auth (trustworthy)
      phone: (incoming.phone || userProfile.phone || "").trim(),
      location: (incoming.location || userProfile.address || "").split('\n')[0].trim(),
      summary: (incoming.summary || userProfile.summary || "").trim(),

      // Profile-specific fields (preserved for future use)
      gender: incoming.gender || userProfile.gender || "",
      dateOfBirth: dobStr || "",
      address: (incoming.address || userProfile.address || "").trim(),
      profilePicture: incoming.profilePicture || userProfile.profilePicture || "",
    };

    // ✅ Build final resume data
    const cleanData = {
      ...resumeData,
      userId: firebaseUid,
      personalInfo: enrichedPersonalInfo,
      updatedAt: new Date(),
    };

    // ✅ Upsert resume
    let resume = await Resume.findOne({ userId: firebaseUid });

    if (resume) {
      // Update existing
      resume.set(cleanData);
      await resume.save();
    } else {
      // Create new
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

// =============== NEW ROUTES (AS PER MENTOR) ===============

// PUT /api/resumes/:id → update a specific resume by ID (with ownership check)
router.put('/resumes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid: firebaseUid } = req.user;
    const updateData = req.body;

    // Enforce ownership & clean update
    const cleanUpdateData = {
      ...updateData,
      userId: firebaseUid,
      updatedAt: new Date(),
    };

    const resume = await Resume.findOne({ _id: id, userId: firebaseUid });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or access denied'
      });
    }

    resume.set(cleanUpdateData);
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

// DELETE /api/resumes/:id → delete a specific resume by ID (with ownership check)
router.delete('/resumes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid: firebaseUid } = req.user;

    const result = await Resume.deleteOne({ _id: id, userId: firebaseUid });

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