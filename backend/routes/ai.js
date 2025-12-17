// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Resume = require('../models/Resume');

// ✅ VALIDATE ENV FIRST — BEFORE ANY USE OF GEMINI
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env. AI features will NOT work.");
  // We do NOT throw here — let server start, but disable the route
}

// ✅ Initialize model ONLY if key exists — safe fallback
let genAI, model;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Gemini AI model initialized successfully");
  }
} catch (err) {
  console.error("❌ Failed to initialize Gemini model:", err.message);
}

router.post('/chat', async (req, res) => {
  // ✅ Runtime check: if model not ready, fail early
  if (!model) {
    return res.status(500).json({
      error: "AI service is not configured. Please contact administrator."
    });
  }

  try {
    const { message } = req.body;
    const userId = req.user.uid; // From authenticate middleware

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Fetch user's resume data
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
      resumeContext = JSON.stringify(cleanResume);
    }

    // 2. Construct the prompt
    const prompt = `
You are an expert AI Career Counsellor. 
Your goal is to help the user with their career, specifically focusing on their resume, skill gaps, and interview prep.

CONTEXT - USER RESUME DATA:
${resumeContext}

INSTRUCTIONS:
1. Analyze the user's data provided above.
2. If the user asks for a specific analysis (like "check my resume"), look for gaps in their skills or experience compared to typical industry standards for their role.
3. If the user asks for a "skill quiz", ask them a technical question based on their listed skills.
4. If the user asks for a "mock interview", ask a behavioral or technical interview question relevant to their experience.
5. Be encouraging, professional, and concise.

USER MESSAGE: "${message}"

RESPONSE:
`;

    // 3. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🤖 AI Chat Error:', error);

    // Enhanced error detection
    if (error.message?.includes('API_KEY_INVALID')) {
      return res.status(403).json({
        error: "Invalid API Key. Please check backend configuration."
      });
    }

    if (error.message?.includes('404') || error.message?.includes('Model not found')) {
      return res.status(500).json({
        error: "Gemini model not available. Check API key permissions in Google Cloud Console."
      });
    }

    res.status(500).json({ error: "AI response generation failed. Please try again." });
  }
});

module.exports = router;