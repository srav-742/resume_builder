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
You are an expert AI Career Counsellor with deep expertise in resume optimization, career development, and interview preparation.

USER'S RESUME DATA:
${resumeContext}

YOUR MISSION:
Provide comprehensive, actionable, and well-structured career guidance. Your responses should be thorough, professional, and formatted for maximum clarity.

FORMATTING GUIDELINES (STRICTLY FOLLOW):
1. **Use # for main section headings** (e.g., # Analysis of Your Resume)
2. **Use ## for sub-sections** (e.g., ## Strengths)
3. **Use **bold** for important terms, skills, or key points**
4. **Use bullet points (*) for listing items**
5. **Use numbered lists (1., 2., 3.) for step-by-step instructions**
6. **Separate sections with blank lines for readability**
7. **Provide specific examples when giving advice**

RESPONSE STRUCTURE:
When analyzing resumes or providing career advice, structure your response like this:

# [Main Topic/Analysis Title]

[Brief intro paragraph explaining what you'll cover]

## [First Section - e.g., "Strengths" or "Current Status"]
* Key point 1 with **important terms bolded**
* Key point 2 with specific details
* Key point 3 with examples

## [Second Section - e.g., "Areas for Improvement" or "Recommendations"]
* Improvement area 1 with **specifics**
* Improvement area 2 with actionable steps
* Improvement area 3 with examples

## [Third Section - e.g., "Action Steps" or "Next Steps"]
1. First concrete step to take
2. Second specific action with details
3. Third actionable recommendation

[Closing encouragement or summary]

IMPORTANT RULES:
- Be thorough but clear - provide detailed explanations
- Give specific, actionable advice (not vague suggestions)
- Use examples to illustrate your points
- When analyzing a resume, cover: strengths, gaps, improvements, and next steps
- When answering questions, provide comprehensive answers with relevant context
- Be encouraging but honest about areas needing improvement
- If the user hasn't created a resume yet, guide them step-by-step on how to create one

USER'S QUESTION:
${message}

YOUR DETAILED RESPONSE:
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
