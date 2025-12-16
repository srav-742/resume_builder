// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth'); // Reuse your existing auth middleware
const Resume = require('../models/Resume');
const { generateAIPrompt } = require('../utils/aiService');

/**
 * POST /api/ai/session
 * Start an AI counseling session based on user's resume and selected mode
 */
router.post('/session', authenticate, async (req, res) => {
  const { mode, targetRole } = req.body;
  const { uid } = req.user; // From auth middleware

  try {
    // 1. Fetch user's resume from MongoDB
    const resume = await Resume.findOne({ firebaseUid: uid }).lean();
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // 2. Prepare context for AI
    const context = {
      skills: resume.skills || [],
      experience: resume.experience || 'Fresher',
      projects: resume.projects || [],
      targetRole: targetRole || null,
    };

    // 3. Generate AI response
    const aiResponse = await generateAIPrompt(mode, context);

    // 4. Return response
    res.json({ aiResponse });

  } catch (error) {
    console.error('AI Session Error:', error);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

module.exports = router;