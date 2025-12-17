// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Resume = require('../models/Resume');

// ✅ Safe initialization
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // ✅ Use a model that is publicly available
    model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    console.log("✅ Gemini AI model (gemini-1.0-pro) initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Gemini model:", err.message);
  }
} else {
  console.error("❌ GEMINI_API_KEY is missing in .env. AI features will NOT work.");
}

router.post('/chat', async (req, res) => {
  if (!model) {
    return res.status(500).json({
      error: "AI service is not configured. Please contact administrator."
    });
  }

  try {
    const { message } = req.body;
    const userId = req.user.uid;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Fetch user resume
    const resume = await Resume.findOne({ firebaseUid: userId });
    let resumeContext = "The user has not created a resume yet.";

    if (resume) {
      const cleanResume = {
        fullName: resume.personalInfo?.fullName,
        skills: resume.skills,
        experience: resume.workExperience?.map(exp => ({
          role: exp.jobTitle,
          company: exp.company,
          desc: exp.description
        })),
        projects: resume.projects?.map(proj => ({
          title: proj.title,
          tech: proj.technologies,
          desc: proj.description
        })),
        education: resume.education?.map(edu => ({
          degree: edu.degree,
          field: edu.fieldOfStudy
        }))
      };
      resumeContext = JSON.stringify(cleanResume, null, 2);
    }

    const prompt = `
You are an expert AI Career Counsellor. Help the user with career advice, resume feedback, or interview prep.

USER RESUME:
${resumeContext}

INSTRUCTIONS:
- Be concise, professional, and encouraging.
- If the user hasn't created a resume, guide them to do so.
- Answer based on their experience and skills.

USER MESSAGE: "${message}"

RESPONSE:
`;

    // ✅ Correct way to call and extract response
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({
      response: responseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🤖 AI Chat Error:', error);

    if (error.message?.includes('API_KEY_INVALID') || error.status === 403) {
      return res.status(403).json({
        error: "Invalid or disabled API key. Contact administrator."
      });
    }

    if (error.message?.includes('404') || error.message?.includes('not found') || error.status === 404) {
      return res.status(500).json({
        error: "Gemini model is unavailable. Using gemini-1.0-pro requires API access."
      });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }

    res.status(500).json({ error: "AI generation failed. Please try again in a few seconds." });
  }
});

module.exports = router;