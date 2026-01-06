// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/auth');

// GET /api/user/profile → sync user from Firebase token
router.get('/profile', authenticate, async (req, res) => {
  try {
    const { role } = req.query;
    const { uid, email, name } = req.user;

    // Find or create user
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      console.log(`Creating new user for UID: ${uid} with role: ${role}`);
      user = new User({
        firebaseUid: uid,
        email,
        name,
        role: role || 'seeker'
      });
      await user.save();
      console.log(`User created successfully: ${user._id}`);
    } else {
      console.log(`User found: ${user._id}`);
    }

    res.json({
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      // Only send minimal data here — full profile comes from /api/profile
    });
  } catch (error) {
    console.error('User sync error detailed:', error);
    res.status(500).json({ error: 'Failed to sync user', details: error.message });
  }
});

// GET /api/users/resumes → get all resumes for the authenticated user
router.get('/resumes', authenticate, async (req, res) => {
  try {
    const { uid } = req.user;

    // Import Resume model
    const Resume = require('../models/Resume');

    // Find all resumes for this user
    const resumes = await Resume.find({ firebaseUid: uid }).sort({ createdAt: -1 });

    // Format the resumes data
    const formattedResumes = resumes.map(resume => ({
      id: resume._id,
      fullName: resume.personalInfo?.fullName || 'Untitled Resume',
      role: resume.workExperience?.[0]?.jobTitle || 'Not specified',
      skills: resume.skills || [],
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      status: resume.updatedAt > resume.createdAt ? 'Active' : 'Draft',
      template: resume.template || 'modern'
    }));

    console.log(`Found ${formattedResumes.length} resumes for user ${uid}`);
    res.json(formattedResumes);

  } catch (error) {
    console.error('Error fetching user resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes', details: error.message });
  }
});

module.exports = router;