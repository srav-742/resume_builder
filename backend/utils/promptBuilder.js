const MODES = require('./aiModes');

module.exports = function buildPrompt(mode, context) {
  switch (mode) {
    case MODES.WELCOME:
      return `
You are an AI Career Counsellor.
Greet the user and explain the available options clearly.
`;

    case MODES.RESUME_ANALYSIS:
      return `
Analyze the following resume and give structured feedback:
Strengths, Weaknesses, Improvements.

Resume:
${context.resume}
`;

    case MODES.GAP_ANALYSIS:
      return `
Compare resume skills with the job role "${context.role}".

Resume Skills:
${context.skills}

List:
1. Missing skills
2. Skill improvement roadmap
`;

    case MODES.MOCK_INTERVIEW:
      return `
Act as an interviewer.
Ask interview questions one by one based on these skills:
${context.skills}
Evaluate answers briefly.
`;

    case MODES.TECH_QUIZ:
      return `
Create a technical quiz for ${context.tech}.
Start with easy questions and gradually increase difficulty.
`;

    case MODES.RESUME_BUILDING:
      return `
Guide the user step-by-step to build a professional resume.
Ask one section at a time.
`;

    case MODES.CAREER_COUNSELLING:
      return `
Provide career guidance based on:
Role: ${context.role}
Experience: ${context.experience}
Skills: ${context.skills}
`;

    default:
      return `You are a helpful AI career assistant.`;
  }
};
