// backend/models/CounsellingSession.js
const mongoose = require('mongoose');

const counsellingSessionSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        index: true
    },

    // Pre-Step: Resume Selection
    selectedResumeId: {
        type: String,
        default: null
    },
    hasResume: {
        type: Boolean,
        default: false
    },

    // Skill Extraction & Validation
    extractedSkills: [{
        skillName: String,
        confidence: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced']
        },
        usedIn: {
            type: String,
            enum: ['Academic projects', 'Personal projects', 'Professional work', 'Not used practically yet']
        },
        isValidated: Boolean
    }],
    additionalSkills: [String],

    // Section 1: Personal & Background
    personalBackground: {
        currentStatus: {
            type: String,
            enum: ['Student', 'Fresher', 'Working professional', 'Career break', 'Career switcher']
        },
        highestQualification: {
            type: String,
            enum: ['Diploma', "Bachelor's degree", "Master's degree", 'PhD', 'Other']
        },
        fieldOfEducation: String,
        currentLocation: String,
        preferredJobLocation: {
            type: String,
            enum: ['Remote', 'Hybrid', 'On-site', 'Open to any']
        }
    },

    // Section 2: Career Goals
    careerGoals: {
        immediateGoal: {
            type: String,
            enum: ['Get a job', 'Switch domain', 'Improve current role', 'Higher studies', 'Freelancing / Startup']
        },
        longTermGoal: String,
        targetRoles: [String],
        targetIndustry: {
            type: String,
            enum: ['IT', 'Data', 'Core engineering', 'Management', 'Healthcare', 'Others']
        },
        careerPathClarity: {
            type: String,
            enum: ['Very clear', 'Somewhat clear', 'Confused']
        }
    },

    // Section 3: Skills & Technical Strength
    skillsAssessment: {
        strongestSkill: String,
        leastConfidentSkill: String,
        currentlyLearningSkills: [String],
        dailyLearningTime: {
            type: String,
            enum: ['< 1 hour', '1–2 hours', '2–4 hours', '4+ hours']
        }
    },

    // Section 4: Work Experience
    workExperience: {
        hasExperience: Boolean,
        totalYearsExperience: Number,
        currentJobTitle: String,
        keyResponsibilities: String,
        biggestChallenge: String,
        reasonForJobChange: String,
        hasInternships: Boolean,
        hasRealWorldProjects: Boolean
    },

    // Section 5: Resume & Job Readiness
    jobReadiness: {
        resumeConfidence: {
            type: String,
            enum: ['Very confident', 'Needs improvement', 'Not confident']
        },
        hasAppliedToJobs: Boolean,
        interviewCallFrequency: {
            type: String,
            enum: ['Frequently', 'Sometimes', 'Rarely', 'Never']
        },
        biggestChallenge: {
            type: String,
            enum: ['Skill gap', 'Resume quality', 'Interview confidence', 'Career direction', 'Guidance']
        }
    },

    // Section 6: Personal Constraints
    personalConstraints: {
        dailyTimeAvailable: String,
        hasFinancialConstraints: Boolean,
        preferredLearningStyle: {
            type: String,
            enum: ['Self-learning', 'Guided mentoring', 'Online courses', 'Project-based learning']
        },
        careerStressLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High']
        },
        openToReskilling: {
            type: String,
            enum: ['Yes', 'No', 'Not sure']
        }
    },

    // Phase Tracking
    currentPhase: {
        type: String,
        enum: [
            'RESUME_CHECK',
            'SKILL_EXTRACTION',
            'PERSONAL_BACKGROUND',
            'CAREER_GOALS',
            'SKILLS_ASSESSMENT',
            'WORK_EXPERIENCE',
            'JOB_READINESS',
            'PERSONAL_CONSTRAINTS',
            'AI_ANALYSIS',
            'POST_COUNSELLING',
            'COMPLETED'
        ],
        default: 'RESUME_CHECK'
    },

    currentQuestion: {
        type: Number,
        default: 0
    },

    // AI Analysis Results
    aiAnalysis: {
        careerPositionSummary: String,
        resumeGoalAlignment: String,
        skillStrengths: [String],
        skillGaps: [String],
        learningRoadmap: {
            immediate: [String],      // 0-3 months
            shortTerm: [String],       // 3-6 months
            mediumTerm: [String]       // 6-12 months
        },
        resumeImprovementTips: [String],
        jobApplicationStrategy: String,
        confidenceGuidance: String,
        generatedAt: Date
    },

    // Post-Counselling Actions
    postCounsellingActions: {
        skillAssessmentTaken: Boolean,
        skillAssessmentResults: {
            skillName: String,
            score: Number,
            weakAreas: [String],
            suggestions: [String],
            takenAt: Date
        },
        mockInterviewTaken: Boolean,
        mockInterviewResults: {
            role: String,
            interviewType: String,
            technicalAccuracy: Number,
            communicationClarity: Number,
            confidenceLevel: Number,
            feedback: String,
            takenAt: Date
        }
    },

    // Session Metadata
    sessionStatus: {
        type: String,
        enum: ['IN_PROGRESS', 'AWAITING_AI', 'COMPLETED', 'ABANDONED'],
        default: 'IN_PROGRESS'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    completedAt: {
        type: Date,
        default: null
    }
});

// Update timestamp on save
counsellingSessionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Index for performance
counsellingSessionSchema.index({ firebaseUid: 1, createdAt: -1 });

module.exports = mongoose.model('CounsellingSession', counsellingSessionSchema);
