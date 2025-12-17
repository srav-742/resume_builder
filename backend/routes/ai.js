// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
const Resume = require('../models/Resume');

// ✅ Initialize Groq client
let groq = null;

if (process.env.GROQ_API_KEY) {
  try {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log("✅ Groq AI client initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Groq client:", err.message);
  }
} else {
  console.error("❌ GROQ_API_KEY is missing in .env. AI features will NOT work.");
}

router.post('/chat', async (req, res) => {
  if (!groq) {
    return res.status(500).json({
      error: "AI service is not available. Please contact administrator."
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

    const systemPrompt = `You are an expert AI Career Counsellor. Help the user with career advice, resume feedback, or interview prep based on their resume data. Be concise, professional, and encouraging.`;

    const userMessage = `USER RESUME:\n${resumeContext}\n\nUSER MESSAGE: "${message}"`;

    // ✅ Call Groq (using Llama 3 8B — free & fast)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "llama3-8b-8192", // ✅ Free, fast, no billing
      temperature: 0.7,
      max_tokens: 512,
    });

    const responseText = chatCompletion.choices[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";

    res.json({
      response: responseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🤖 Groq AI Error:', error);

    if (error.status === 401 || error.message?.includes('invalid_api_key')) {
      return res.status(403).json({ error: "Invalid Groq API key." });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }

    res.status(500).json({ error: "AI generation failed. Please try again." });
  }
});

module.exports = router;