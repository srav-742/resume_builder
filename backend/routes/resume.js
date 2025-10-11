// routes/resume.js
const express = require('express');
const authenticate = require('../middleware/auth');
const Resume = require('../models/Resume');

const router = express.Router();

// GET /api/user/resumes → fetch user's resumes
router.get('/user/resumes', authenticate, async (req, res) => {
  try {
    const { uid: firebaseUid } = req.user;

    // Find all resumes for this user
    const resumes = await Resume.find({ userId: firebaseUid }).sort({ updatedAt: -1 });

    res.status(200).json({ success: true, resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch resume data' });
  }
});

module.exports = router;