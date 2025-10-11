// backend/routes/resume.js
const express = require('express');
const authenticate = require('../middleware/auth');
const Resume = require('../models/Resume');

const router = express.Router();

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

// POST /api/user/resumes → save or update user's resume
router.post('/user/resumes', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;
    const resumeData = req.body;

    // Enforce userId = firebaseUid (ignore any client-provided userId)
    const cleanData = { ...resumeData, userId: firebaseUid };

    // Upsert: find by userId, or create new
    let resume = await Resume.findOne({ userId: firebaseUid });

    if (resume) {
      // Update existing
      Object.assign(resume, cleanData);
      await resume.save();
    } else {
      // Create new
      resume = new Resume(cleanData);
      await resume.save();
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;