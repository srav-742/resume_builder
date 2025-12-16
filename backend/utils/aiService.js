// backend/utils/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or gemini-1.5-pro for higher quality

/**
 * Generates a personalized AI career counseling response using Gemini.
 * Implements the 3 core modes: Gap Analysis (Strategist), Skill Quiz (Teacher), Mock Interview (Interviewer).
 * 
 * @param {string} mode - 'gap', 'quiz', or 'mock'
 * @param {Object} context - { skills: string[], experience: string, projects: Array<{ title: string, description: string }>, targetRole: string }
 * @returns {Promise<string>} AI-generated, actionable response
 */
async function generateAIPrompt(mode, context) {
  // Safely extract context
  const skills = Array.isArray(context.skills) ? context.skills : [];
  const experience = context.experience || 'Fresher';
  const projects = Array.isArray(context.projects) ? context.projects : [];
  const targetRole = context.targetRole || 'a tech role';

  let prompt = '';

  switch (mode) {
    case 'gap':
      // === Gap Analysis: The "Strategist" ===
      const skillsStr = skills.length ? skills.join(', ') : 'none listed';
      const projectsStr = projects.length
        ? projects.map(p => `${p.title}: ${p.description?.substring(0, 80) || 'No description'}`).join('; ')
        : 'no projects listed';

      prompt = `You are an expert career strategist for tech roles. Analyze this candidate's profile against industry standards for the role: "${targetRole}".

Candidate Background:
- Skills: ${skillsStr}
- Experience Level: ${experience}
- Projects: ${projectsStr}

Do the following:
1. Identify 2-3 critical missing hard skills or tools (e.g., "Missing: TypeScript, AWS, Jest").
2. Provide a clear, 3-step action plan with free/low-cost resources (e.g., "1. Complete free TypeScript course on freeCodeCamp...").
3. Be encouraging and specific. Avoid vague advice like "improve your skills".

End with: "💡 *Tip: You can start bridging these gaps today with free courses on freeCodeCamp, Coursera, or MDN Web Docs.*"`;
      break;

    case 'quiz':
      // === Skill Quiz: The "Teacher" ===
      const primarySkill = skills[0] || 'web development';
      const level = experience.toLowerCase().includes('senior') ? 'senior' :
                   experience.toLowerCase().includes('mid') ? 'mid-level' : 'entry-level';

      prompt = `You are a technical mentor preparing candidates for real coding interviews. Generate exactly 3 rapid-fire technical questions that test deep understanding of "${primarySkill}" for an ${level} developer.

Rules:
- Focus on concepts, trade-offs, debugging, or architecture — NOT syntax.
- Do NOT include answers or explanations.
- Output ONLY the questions, numbered 1 to 3.`;
      break;

    case 'mock':
      // === Mock Interview: The "Interviewer" (STAR Method) ===
      const project = projects[0];
      const projectTitle = project?.title || 'an unspecified project';
      const projectDesc = project?.description || '';

      prompt = `You are a strict but fair HR manager at a top tech company. You are conducting a behavioral interview using the STAR method (Situation, Task, Action, Result).

Ask ONE challenging, open-ended question about the candidate's project: "${projectTitle}".

Guidelines:
- Force the candidate to describe a specific problem, their action, and the measurable outcome.
- Reference details from the project if available: "${projectDesc.substring(0, 100)}".
- Do NOT ask generic questions like "Tell me about your project."

Ask only one question.`;
      break;

    default:
      prompt = `You are a helpful AI career counselor. The user has not selected a mode. Invite them to choose Gap Analysis, Skill Quiz, or Mock Interview.`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text ? response.text() : '';

    // Gemini may wrap responses in **bold** or markdown — clean if needed
    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini');
    }

    return text.trim();

  } catch (error) {
    console.error('Gemini AI Error:', error.message);

    // Fallback responses (as per your Knowledge Base)
    const fallbacks = {
      gap: `I analyzed your profile for "${targetRole}". Key gaps often include TypeScript, testing (Jest), or cloud basics. Start with a free structured course this week to build confidence! 💡 Tip: freeCodeCamp and Coursera offer great free tracks.`,
      quiz: "1. Explain how React's virtual DOM improves performance.\n2. What is closure in JavaScript, and how would you use it?\n3. How do you prevent memory leaks in a long-running Node.js app?",
      mock: `Tell me about a time your project faced a major technical challenge. What was your specific role, what actions did you take, and what was the measurable result? (Use the STAR method in your answer.)`
    };

    return fallbacks[mode] || 'I’m ready to help! Please select a mode: Gap Analysis, Skill Quiz, or Mock Interview.';
  }
}

module.exports = { generateAIPrompt };