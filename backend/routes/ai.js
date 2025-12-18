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

SPECIAL MODE - TECHNICAL QUIZ:
When conducting a technical quiz:
1. Ask ONE question at a time
2. DO NOT provide the answer immediately
3. WAIT for the user's response before moving to the next question
4. After the user answers a question, acknowledge it and ask the next one
5. ONLY after the user has answered ALL questions, provide evaluation using this rubric:

**SCORING RUBRIC:**
* **Excellent (5/5)**: Demonstrates deep understanding of concepts, can articulate nuanced differences, and provides practical, well-reasoned solutions.
* **Very Good (4/5)**: Shows strong grasp of core concepts, provides correct solutions with minor areas for elaboration.
* **Good (3/5)**: Understands most concepts but may need to clarify explanations or provide more detailed examples.
* **Needs Improvement (0-2/5)**: Indicates gaps in fundamental knowledge, requiring further study in the areas tested.

SPECIAL MODE - MOCK INTERVIEW:
When conducting a mock interview:
1. Ask ONE interview question at a time
2. Wait for the user's answer
3. Provide brief feedback on their answer
4. Then ask the next question
5. Be encouraging but honest in your feedback

IMPORTANT RULES:
- Be thorough but clear - provide detailed explanations
- Give specific, actionable advice (not vague suggestions)
- Use examples to illustrate your points
- When analyzing a resume, cover: strengths, gaps, improvements, and next steps
- When answering questions, provide comprehensive answers with relevant context
- Be encouraging but honest about areas needing improvement
- If the user hasn't created a resume yet, guide them step-by-step on how to create one
- In quiz mode, ASK QUESTIONS FIRST, SCORE LATER after receiving user answers

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
