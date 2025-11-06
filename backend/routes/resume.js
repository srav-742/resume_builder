// backend/routes/resume.js

const express = require('express');
const authenticate = require('../middleware/auth');
const Resume = require('../models/Resume');

const router = express.Router();

// =============== EXISTING ROUTES (UNCHANGED) ===============

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

// =============== NEW ROUTES (AS PER MENTOR) ===============

// PUT /api/resumes/:id → update a specific resume by ID (with ownership check)
router.put('/resumes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid: firebaseUid } = req.user;
    const updateData = req.body;

    // Enforce: userId must match authenticated user (ignore client-provided userId)
    const cleanUpdateData = { ...updateData, userId: firebaseUid };

    // Find resume by ID AND ensure it belongs to the user
    const resume = await Resume.findOne({ _id: id, userId: firebaseUid });

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found or access denied' });
    }

    // Apply updates
    Object.assign(resume, cleanUpdateData);
    await resume.save();

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/resumes/:id → delete a specific resume by ID (with ownership check)
router.delete('/resumes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid: firebaseUid } = req.user;

    const result = await Resume.deleteOne({ _id: id, userId: firebaseUid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Resume not found or access denied' });
    }

    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ success: false, error: 'Failed to delete resume' });
  }
});

module.exports = router;