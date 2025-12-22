const express = require('express');
const router = express.Router();

/* =========================
   AI MODES (UPDATED)
========================= */
const AI_MODES = {
  GAP_ANALYSIS: 'gap_analysis',
  MOCK_INTERVIEW: 'mock_interview',
  TECH_QUIZ: 'tech_quiz',
  RESUME_BUILDING: 'resume_building',
  GENERAL_CHAT: 'general_chat'
};

/* =========================
   MODE INSTRUCTIONS
========================= */
function getModeInstructions(mode) {
  const instructions = {

    [AI_MODES.GAP_ANALYSIS]: `
You are a CAREER GAP ANALYSIS SPECIALIST.

TASK:
- Compare resume skills with target job role
- Identify missing skills
- Identify weak skills
- Suggest tools & technologies
- Provide a 3-month learning roadmap

RESPONSE FORMAT:
1. Missing Skills
2. Skills to Improve
3. Tools & Technologies
4. Experience Gaps
5. Learning Roadmap
`,

    [AI_MODES.MOCK_INTERVIEW]: `
You are a PROFESSIONAL TECH INTERVIEWER.

RULES:
- Ask ONE interview question at a time
- Wait for user response
- Give short feedback
- Ask next question
- After 5 questions, give final evaluation

Focus on resume skills.
`,

    [AI_MODES.TECH_QUIZ]: `
You are a TECHNICAL QUIZ EXPERT.

RULES:
- Create 5 MCQs
- One question at a time
- 4 options per question
- Do NOT reveal answers until the end
- Provide score and feedback after completion
`,

    [AI_MODES.RESUME_BUILDING]: `
You are a PROFESSIONAL RESUME WRITER.

TASK:
- Guide resume creation step-by-step
- Explain each section clearly
- Use ATS-friendly language
- Provide examples
- Ask one section at a time
`,

    [AI_MODES.GENERAL_CHAT]: `
You are an AI CAREER COUNSELLOR.

TASK:
- Career guidance
- Job search advice
- Skill improvement suggestions
- Interview tips

Suggest other modes when useful.
`
  };

  return instructions[mode] || instructions[AI_MODES.GENERAL_CHAT];
}

/* =========================
   WELCOME MESSAGE API
========================= */
router.post('/get-welcome-message', (req, res) => {
  const { mode } = req.body;

  const messages = {
    [AI_MODES.GAP_ANALYSIS]:
      `🎯 Gap Analysis Mode Activated  
Tell me your **target job role** to begin.`,

    [AI_MODES.MOCK_INTERVIEW]:
      `🎤 Mock Interview Mode Activated  
I’ll ask one interview question at a time.  
Say **“Start interview”** when ready.`,

    [AI_MODES.TECH_QUIZ]:
      `🧠 Tech Quiz Mode Activated  
Which **technology** should I quiz you on?`,

    [AI_MODES.RESUME_BUILDING]:
      `📝 Resume Building Mode Activated  
Let’s start with your **professional summary**.`,

    [AI_MODES.GENERAL_CHAT]:
      `💼 Career Counselling Mode Activated  
How can I help you today?`
  };

  res.json({
    message: messages[mode] || messages[AI_MODES.GENERAL_CHAT]
  });
});

/* =========================
   MAIN AI CHAT API
========================= */
router.post('/chat', async (req, res) => {
  try {
    const { mode, userMessage, resumeContext } = req.body;

    const systemPrompt = getModeInstructions(mode);

    const finalPrompt = `
${systemPrompt}

Resume Context:
${JSON.stringify(resumeContext, null, 2)}

User Message:
${userMessage}
`;

    // ⬇️ USE YOUR EXISTING GEMINI FUNCTION
    const aiResponse = await global.geminiModel.generateContent(finalPrompt);
    const reply = aiResponse.response.text();

    res.json({ reply });

  } catch (error) {
    console.error('AI Counsellor Error:', error);
    res.status(500).json({ error: 'AI response failed' });
  }
});

module.exports = router;
