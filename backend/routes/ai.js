// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Resume = require('../models/Resume');

// -----------------------------
// Gemini Initialization
// -----------------------------
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    console.log("✅ Gemini AI initialized successfully");
  } catch (err) {
    console.error("❌ Gemini initialization failed:", err.message);
  }
} else {
  console.error("❌ GEMINI_API_KEY missing in .env");
}

// -----------------------------
// POST /api/ai/chat
// -----------------------------
router.post('/chat', async (req, res) => {
  if (!model) {
    return res.status(500).json({
      error: "AI service unavailable. Gemini not initialized."
    });
  }

  try {
    const { message } = req.body;
    const userId = req.user.uid;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // -----------------------------
    // Fetch Resume
    // -----------------------------
    const resume = await Resume.findOne({ firebaseUid: userId });

    let resumeContext = "The user has not created a resume yet.";

    if (resume) {
      const cleanResume = {
        fullName: resume.personalInfo?.fullName,
        skills: resume.skills,
        experience: resume.workExperience?.map(exp => ({
          role: exp.jobTitle,
          company: exp.company,
          description: exp.description
        })),
        projects: resume.projects?.map(proj => ({
          title: proj.title,
          technologies: proj.technologies,
          description: proj.description
        })),
        education: resume.education?.map(edu => ({
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          institution: edu.institution
        }))
      };

      resumeContext = JSON.stringify(cleanResume, null, 2);
    }

    // -----------------------------
    // Gemini Prompt
    // -----------------------------
    const prompt = `
You are an expert AI Career Counsellor.

USER RESUME:
${resumeContext}

INSTRUCTIONS:
- Be concise, professional, and encouraging
- Give practical resume, career, or interview advice
- If resume is missing, guide the user to create one

USER MESSAGE:
${message}

RESPONSE:
`;

    // -----------------------------
    // Gemini Call
    // -----------------------------
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.json({
      response: responseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("🤖 Gemini AI Error:", error);

    if (error.status === 403) {
      return res.status(403).json({
        error: "Gemini access denied. Billing or Generative Language API not enabled."
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Try again later."
      });
    }

    return res.status(500).json({
      error: "AI generation failed."
    });
  }
});

module.exports = router;
