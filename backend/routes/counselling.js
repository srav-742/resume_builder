// backend/routes/counselling.js
const express = require('express');
const router = express.Router();
const CounsellingSession = require('../models/CounsellingSession');
const Resume = require('../models/Resume');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
let model = null;
let genAI = null;
let currentModelName = "gemini-2.5-flash-lite"; // Track which model we're using - CORRECTED MODEL

if (process.env.GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use 'gemini-2.5-flash-lite' - the ONLY working model as per API_KEY_ANALYSIS.md
        model = genAI.getGenerativeModel({ model: currentModelName });
        console.log(`✅ Gemini AI initialized for counselling (${currentModelName})`);
    } catch (err) {
        console.error("❌ Gemini initialization failed:", err.message);
        console.error("Full error:", err);
    }
} else {
    console.error("❌ GEMINI_API_KEY not found in environment variables");
}

// Lazy initialization function as fallback
function ensureModel(preferredModel = "gemini-2.5-flash-lite") {
    if (!model && process.env.GEMINI_API_KEY) {
        try {
            if (!genAI) {
                genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            }
            currentModelName = preferredModel;
            model = genAI.getGenerativeModel({ model: currentModelName });
            console.log(`✅ Gemini AI lazy-initialized (${currentModelName})`);
        } catch (err) {
            console.error("❌ Gemini lazy-initialization failed:", err.message);
            throw new Error("AI service unavailable");
        }
    }
    return model;
}

// Function to generate content with automatic fallback on quota errors
async function generateWithFallback(prompt) {
    // try all available working models
    const modelsToTry = [
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-pro"
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🔄 Attempting to use model: ${modelName}`);

            if (!process.env.GEMINI_API_KEY) {
                throw new Error("GEMINI_API_KEY is missing");
            }

            const tempGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const attemptModel = tempGenAI.getGenerativeModel({ model: modelName });

            const result = await attemptModel.generateContent(prompt);
            console.log(`✅ Successfully generated content with ${modelName}`);

            // Update the global model reference if successful
            model = attemptModel;
            currentModelName = modelName;

            return result;
        } catch (error) {
            console.error(`❌ Failed with ${modelName}:`, error.message);
            lastError = error;

            if (error.status === 404) {
                console.log(`⚠️ Model ${modelName} not found, trying next...`);
            } else if (error.status === 403 && error.message.includes('leaked')) {
                console.log(`⚠️ API Key for ${modelName} reported as leaked. This is a critical error.`);
                // If it's leaked, it's probably leaked for all models, but we'll try one more just in case
            } else if (error.status !== 429) {
                console.log(`⚠️ Non-quota error with ${modelName}, trying next...`);
            } else {
                console.log(`⚠️ Quota exceeded for ${modelName}, trying next model...`);
            }
            continue;
        }
    }

    throw lastError || new Error("All models failed to generate content");
}


/* =========================
   PHASE 0: RESUME CHECK
========================= */
router.post('/start-session', async (req, res) => {
    try {
        const userId = req.user.uid;

        // Check for existing in-progress session
        let session = await CounsellingSession.findOne({
            firebaseUid: userId,
            sessionStatus: 'IN_PROGRESS'
        });

        // If session exists, return it
        if (session) {
            return res.json({
                sessionId: session._id,
                currentPhase: session.currentPhase,
                currentQuestion: session.currentQuestion,
                message: 'Resuming existing session'
            });
        }

        // Check for resumes
        const resumes = await Resume.find({ firebaseUid: userId });

        // Create new session
        session = new CounsellingSession({
            firebaseUid: userId,
            hasResume: resumes.length > 0,
            currentPhase: 'RESUME_CHECK'
        });

        await session.save();

        res.json({
            sessionId: session._id,
            resumeCount: resumes.length,
            resumes: resumes.map(r => ({
                id: r._id,
                name: r.personalInfo?.fullName || 'Unnamed Resume',
                createdAt: r.createdAt
            })),
            hasResume: resumes.length > 0,
            currentPhase: 'RESUME_CHECK'
        });

    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: 'Failed to start counselling session' });
    }
});

/* =========================
   PHASE 1: SKILL EXTRACTION
========================= */
router.post('/select-resume', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId, resumeId, manualSkills } = req.body;

        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        let extractedSkills = [];

        if (resumeId) {
            // Extract skills from resume
            const resume = await Resume.findById(resumeId);

            if (!resume) {
                return res.status(404).json({ error: 'Resume not found' });
            }

            // Extract skills
            extractedSkills = (resume.skills || []).map(skill => ({
                skillName: skill,
                confidence: 'Intermediate',
                usedIn: 'Not used practically yet',
                isValidated: false
            }));

            session.selectedResumeId = resumeId;
            session.hasResume = true;
        } else if (manualSkills && manualSkills.length > 0) {
            // Manual skills entry
            extractedSkills = manualSkills.map(skill => ({
                skillName: skill,
                confidence: 'Beginner',
                usedIn: 'Not used practically yet',
                isValidated: false
            }));

            session.hasResume = false;
        }

        session.extractedSkills = extractedSkills;
        session.currentPhase = 'SKILL_EXTRACTION';
        session.currentQuestion = 0;
        await session.save();

        res.json({
            success: true,
            extractedSkills: extractedSkills.map(s => s.skillName),
            currentPhase: 'SKILL_EXTRACTION',
            message: 'Skills extracted successfully'
        });

    } catch (error) {
        console.error('Resume selection error:', error);
        res.status(500).json({ error: 'Failed to select resume' });
    }
});

/* =========================
   VALIDATE SKILLS
========================= */
router.post('/validate-skills', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId, validatedSkills, additionalSkills } = req.body;

        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Update skills with validation data
        session.extractedSkills = validatedSkills.map(skill => ({
            skillName: skill.skillName,
            confidence: skill.confidence || 'Intermediate',
            usedIn: skill.usedIn || 'Not used practically yet',
            isValidated: true
        }));

        session.additionalSkills = additionalSkills || [];
        session.currentPhase = 'PERSONAL_BACKGROUND';
        session.currentQuestion = 0;
        await session.save();

        res.json({
            success: true,
            currentPhase: 'PERSONAL_BACKGROUND',
            message: 'Skills validated successfully'
        });

    } catch (error) {
        console.error('Skill validation error:', error);
        res.status(500).json({ error: 'Failed to validate skills' });
    }
});

/* =========================
   SAVE SECTION RESPONSES
========================= */
router.post('/save-response', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId, section, data, advance } = req.body;

        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Save data to appropriate section
        switch (section) {
            case 'PERSONAL_BACKGROUND':
                session.personalBackground = { ...session.personalBackground, ...data };
                if (advance) session.currentPhase = 'CAREER_GOALS';
                break;

            case 'CAREER_GOALS':
                session.careerGoals = { ...session.careerGoals, ...data };
                if (advance) session.currentPhase = 'SKILLS_ASSESSMENT';
                break;

            case 'SKILLS_ASSESSMENT':
                session.skillsAssessment = { ...session.skillsAssessment, ...data };
                if (advance) session.currentPhase = 'WORK_EXPERIENCE';
                break;

            case 'WORK_EXPERIENCE':
                session.workExperience = { ...session.workExperience, ...data };
                if (advance) session.currentPhase = 'JOB_READINESS';
                break;

            case 'JOB_READINESS':
                session.jobReadiness = { ...session.jobReadiness, ...data };
                if (advance) session.currentPhase = 'PERSONAL_CONSTRAINTS';
                break;

            case 'PERSONAL_CONSTRAINTS':
                session.personalConstraints = { ...session.personalConstraints, ...data };
                if (advance) {
                    session.currentPhase = 'AI_ANALYSIS';
                    session.sessionStatus = 'AWAITING_AI';
                }
                break;
        }

        if (advance && data.questionNumber !== undefined) {
            session.currentQuestion = data.questionNumber + 1;
        }

        await session.save();

        res.json({
            success: true,
            currentPhase: session.currentPhase,
            currentQuestion: session.currentQuestion,
            message: 'Response saved successfully'
        });

    } catch (error) {
        console.error('Save response error:', error);
        res.status(500).json({ error: 'Failed to save response' });
    }
});

/* =========================
   GET SESSION DATA
========================= */
router.get('/session/:sessionId', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId } = req.params;

        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(session);

    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to get session data' });
    }
});

/* =========================
   PHASE 2: AI ANALYSIS
========================= */
router.post('/generate-analysis', async (req, res) => {
    try {
        console.log('========== GENERATE ANALYSIS CALLED ==========');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('User ID:', req.user?.uid);
        console.log('User data:', JSON.stringify(req.user, null, 2));

        const userId = req.user.uid;
        const { sessionId } = req.body;

        console.log('Session ID:', sessionId);
        console.log('Model available (before ensure):', !!model);
        console.log('Process env GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

        // Ensure model is initialized (lazy init if needed)
        try {
            const activeModel = ensureModel();
            if (!activeModel) {
                console.error('❌ AI model is not initialized!');
                console.error('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'exists but model failed to init' : 'missing');
                return res.status(500).json({
                    error: 'AI service unavailable',
                    details: 'Failed to initialize Gemini AI model'
                });
            }
            console.log('✅ Model ensured and ready');
        } catch (err) {
            console.error('❌ Model initialization error:', err.message);
            return res.status(500).json({
                error: 'AI service unavailable',
                details: err.message
            });
        }


        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        console.log('Session found:', !!session);
        console.log('Session phase:', session?.currentPhase);

        if (!session) {
            console.error('❌ Session not found for ID:', sessionId);
            return res.status(404).json({ error: 'Session not found' });
        }

        // Get resume data if exists
        let resumeData = null;
        if (session.selectedResumeId) {
            const resume = await Resume.findById(session.selectedResumeId);
            if (resume) {
                resumeData = {
                    fullName: resume.personalInfo?.fullName,
                    skills: resume.skills,
                    experience: resume.workExperience,
                    projects: resume.projects,
                    education: resume.education
                };
            }
        }

        // Build comprehensive context
        const counsellingContext = {
            hasResume: session.hasResume,
            resumeData,
            skills: session.extractedSkills,
            additionalSkills: session.additionalSkills,
            personalBackground: session.personalBackground,
            careerGoals: session.careerGoals,
            skillsAssessment: session.skillsAssessment,
            workExperience: session.workExperience,
            jobReadiness: session.jobReadiness,
            personalConstraints: session.personalConstraints
        };

        // Generate AI analysis
        const prompt = `
You are an EXPERT AI CAREER COUNSELLOR analyzing a comprehensive career counselling questionnaire.

USER'S COMPLETE PROFILE:
${JSON.stringify(counsellingContext, null, 2)}

YOUR TASK:
Provide a detailed, personalized career counselling report with the following sections:

# 1. CURRENT CAREER POSITION SUMMARY
Analyze where the user stands in their career journey right now.

# 2. RESUME VS CAREER GOAL ALIGNMENT
How well does their current profile align with their target goals?

# 3. SKILL STRENGTHS
List their strongest skills and why they're valuable.

# 4. SKILL GAPS (PRIORITY-WISE)
Identify missing or weak skills ordered by importance for their goals.

# 5. LEARNING ROADMAP
## 0-3 Months (Immediate Actions)
- Specific skills to learn
- Resources to use
- Projects to build

## 3-6 Months (Short-term Goals)
- Next level skills
- Certifications to consider
- Experience to gain

## 6-12 Months (Medium-term Goals)
- Advanced skills
- Career transitions
- Professional development

# 6. RESUME IMPROVEMENT TIPS
Specific actionable tips to improve their resume.

# 7. JOB APPLICATION STRATEGY
How should they approach job searching based on their profile?

# 8. CONFIDENCE & MOTIVATION GUIDANCE
Personalized encouragement and realistic expectations.

FORMATTING:
- Use markdown headers (# ##)
- Use **bold** for important terms
- Use bullet points for lists
- Be specific and actionable
- Provide examples and resources
- Be encouraging but realistic

YOUR ANALYSIS:
`;

        console.log('📝 Calling Gemini API with prompt length:', prompt.length);
        console.log('📝 Context data:', JSON.stringify(counsellingContext, null, 2));

        // Use fallback function that tries multiple models if quota is exceeded
        const result = await generateWithFallback(prompt);
        console.log('✅ Gemini API call successful');

        const analysisText = result.response.text();
        console.log('✅ Analysis text received, length:', analysisText?.length || 0);

        // Parse the analysis into structured format
        const lines = analysisText.split('\n');
        let currentSection = '';

        const analysis = {
            careerPositionSummary: '',
            resumeGoalAlignment: '',
            skillStrengths: [],
            skillGaps: [],
            learningRoadmap: {
                immediate: [],
                shortTerm: [],
                mediumTerm: []
            },
            resumeImprovementTips: [],
            jobApplicationStrategy: '',
            confidenceGuidance: '',
            generatedAt: new Date()
        };

        // Simple parsing logic
        console.log('🔍 Beginning analysis parsing...');
        let buffer = '';
        for (const line of lines) {
            const upperLine = line.toUpperCase();

            if (upperLine.includes('CURRENT CAREER POSITION')) {
                currentSection = 'summary';
                buffer = '';
            }
            else if (upperLine.includes('RESUME VS CAREER GOAL')) {
                currentSection = 'alignment';
                buffer = '';
            }
            else if (upperLine.includes('SKILL STRENGTHS')) {
                currentSection = 'strengths';
                buffer = '';
            }
            else if (upperLine.includes('SKILL GAPS')) {
                currentSection = 'gaps';
                buffer = '';
            }
            else if (upperLine.includes('0-3 MONTHS') || upperLine.includes('IMMEDIATE ACTIONS')) {
                currentSection = 'immediate';
                buffer = '';
            }
            else if (upperLine.includes('3-6 MONTHS') || upperLine.includes('SHORT-TERM')) {
                currentSection = 'shortTerm';
                buffer = '';
            }
            else if (upperLine.includes('6-12 MONTHS') || upperLine.includes('MEDIUM-TERM')) {
                currentSection = 'mediumTerm';
                buffer = '';
            }
            else if (upperLine.includes('RESUME IMPROVEMENT')) {
                currentSection = 'resume';
                buffer = '';
            }
            else if (upperLine.includes('JOB APPLICATION STRATEGY')) {
                currentSection = 'strategy';
                buffer = '';
            }
            else if (upperLine.includes('CONFIDENCE & MOTIVATION') || upperLine.includes('CONFIDENCE GUIDANCE')) {
                currentSection = 'confidence';
                buffer = '';
            }

            if (currentSection) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || /^\d+\./.test(trimmedLine)) {
                    const item = trimmedLine.replace(/^([-*]|\d+\.)\s*/, '').trim();
                    if (item && !item.toUpperCase().includes(currentSection.toUpperCase())) { // Avoid adding headers as items
                        if (currentSection === 'strengths') analysis.skillStrengths.push(item);
                        else if (currentSection === 'gaps') analysis.skillGaps.push(item);
                        else if (currentSection === 'immediate') analysis.learningRoadmap.immediate.push(item);
                        else if (currentSection === 'shortTerm') analysis.learningRoadmap.shortTerm.push(item);
                        else if (currentSection === 'mediumTerm') analysis.learningRoadmap.mediumTerm.push(item);
                        else if (currentSection === 'resume') analysis.resumeImprovementTips.push(item);
                    }
                } else if (trimmedLine && !trimmedLine.startsWith('#')) {
                    buffer += line + '\n';
                    if (currentSection === 'summary') analysis.careerPositionSummary = buffer.trim();
                    else if (currentSection === 'alignment') analysis.resumeGoalAlignment = buffer.trim();
                    else if (currentSection === 'strategy') analysis.jobApplicationStrategy = buffer.trim();
                    else if (currentSection === 'confidence') analysis.confidenceGuidance = buffer.trim();
                }
            }
        }

        // Save analysis
        session.aiAnalysis = analysis;
        session.currentPhase = 'POST_COUNSELLING';
        session.sessionStatus = 'COMPLETED';
        session.completedAt = new Date();
        await session.save();

        console.log('========== ANALYSIS GENERATED ==========');
        console.log('Analysis object:', JSON.stringify(analysis, null, 2));
        console.log('Full report length:', analysisText?.length || 0);
        console.log('Full report preview:', analysisText?.substring(0, 200) || 'No report');
        console.log('========================================');

        res.json({
            success: true,
            analysis,
            fullReport: analysisText,
            currentPhase: 'POST_COUNSELLING'
        });

    } catch (error) {
        console.error('========== ANALYSIS GENERATION ERROR ==========');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        console.error('===============================================');

        res.status(500).json({
            error: 'Failed to generate AI analysis',
            details: error.message
        });
    }
});

/* =========================
   POST-COUNSELLING ACTIONS
========================= */

// Start Skill Assessment
router.post('/start-skill-assessment', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId, skillName } = req.body;

        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Mark skill assessment as started
        session.postCounsellingActions = session.postCounsellingActions || {};
        session.postCounsellingActions.skillAssessmentTaken = true;
        await session.save();

        res.json({
            success: true,
            message: 'Skill assessment started',
            skillName
        });

    } catch (error) {
        console.error('Start skill assessment error:', error);
        res.status(500).json({ error: 'Failed to start skill assessment' });
    }
});

// Save Skill Assessment Results
router.post('/save-skill-assessment', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId, results } = req.body;

        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        session.postCounsellingActions = session.postCounsellingActions || {};
        session.postCounsellingActions.skillAssessmentResults = {
            ...results,
            takenAt: new Date()
        };

        await session.save();

        res.json({
            success: true,
            message: 'Skill assessment results saved'
        });

    } catch (error) {
        console.error('Save skill assessment error:', error);
        res.status(500).json({ error: 'Failed to save assessment results' });
    }
});

// Save Mock Interview Results
router.post('/save-mock-interview', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId, results } = req.body;

        const session = await CounsellingSession.findOne({
            _id: sessionId,
            firebaseUid: userId
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        session.postCounsellingActions = session.postCounsellingActions || {};
        session.postCounsellingActions.mockInterviewTaken = true;
        session.postCounsellingActions.mockInterviewResults = {
            ...results,
            takenAt: new Date()
        };

        await session.save();

        res.json({
            success: true,
            message: 'Mock interview results saved'
        });

    } catch (error) {
        console.error('Save mock interview error:', error);
        res.status(500).json({ error: 'Failed to save interview results' });
    }
});

module.exports = router;
