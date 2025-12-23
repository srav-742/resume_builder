"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, CheckCircle2, Brain, Target, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';
import './counselling-questionnaire.css';

interface CounsellingQuestionnaireProps {
    sessionId: string;
    onComplete: (analysis: any) => void;
    onBack: () => void;
}

interface Skill {
    skillName: string;
    confidence: 'Beginner' | 'Intermediate' | 'Advanced';
    usedIn: string;
}

const CounsellingQuestionnaire: React.FC<CounsellingQuestionnaireProps> = ({
    sessionId,
    onComplete,
    onBack
}) => {
    // Phase tracking
    const [currentPhase, setCurrentPhase] = useState<string>('SKILL_EXTRACTION');
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Skill validation state
    const [extractedSkills, setExtractedSkills] = useState<Skill[]>([]);
    const [additionalSkills, setAdditionalSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState<string>('');

    // Section responses
    const [personalBackground, setPersonalBackground] = useState<any>({});
    const [careerGoals, setCareerGoals] = useState<any>({});
    const [skillsAssessment, setSkillsAssessment] = useState<any>({});
    const [workExperience, setWorkExperience] = useState<any>({});
    const [jobReadiness, setJobReadiness] = useState<any>({});
    const [personalConstraints, setPersonalConstraints] = useState<any>({});

    // Load session data on mount
    useEffect(() => {
        loadSessionData();
    }, [sessionId]);

    const loadSessionData = async () => {
        try {
            const { auth } = await import('@/lib/firebase');
            const user = auth.currentUser;
            if (!user) {
                console.error('User not authenticated');
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(`http://localhost:5000/api/counselling/session/${sessionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const session = await response.json();
                setCurrentPhase(session.currentPhase);
                setCurrentQuestion(session.currentQuestion || 0);
                setExtractedSkills(session.extractedSkills || []);
                setAdditionalSkills(session.additionalSkills || []);
                setPersonalBackground(session.personalBackground || {});
                setCareerGoals(session.careerGoals || {});
                setSkillsAssessment(session.skillsAssessment || {});
                setWorkExperience(session.workExperience || {});
                setJobReadiness(session.jobReadiness || {});
                setPersonalConstraints(session.personalConstraints || {});
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    };

    const saveResponse = async (section: string, data: any, advance: boolean = false) => {
        try {
            setIsLoading(true);

            const { auth } = await import('@/lib/firebase');
            const user = auth.currentUser;
            if (!user) {
                console.error('User not authenticated');
                return false;
            }

            const token = await user.getIdToken();
            console.log('Saving response for section:', section, 'Advance:', advance);

            const response = await fetch('http://localhost:5000/api/counselling/save-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sessionId,
                    section,
                    data,
                    advance
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Response saved:', result);
                if (advance) {
                    setCurrentPhase(result.currentPhase);
                    setCurrentQuestion(0);
                }
                return true;
            } else {
                const error = await response.json();
                console.error('Failed to save response:', error);
            }
            return false;
        } catch (error) {
            console.error('Error saving response:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkillValidation = async () => {
        try {
            setIsLoading(true);

            // Use Firebase auth
            const { auth } = await import('@/lib/firebase');
            const user = auth.currentUser;
            if (!user) {
                console.error('User not authenticated');
                return;
            }

            const token = await user.getIdToken();
            console.log('Validating skills...');

            const response = await fetch('http://localhost:5000/api/counselling/validate-skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sessionId,
                    validatedSkills: extractedSkills,
                    additionalSkills
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Skills validated:', result);
                setCurrentPhase(result.currentPhase);
                setCurrentQuestion(0);
            } else {
                const error = await response.json();
                console.error('Failed to validate skills:', error);
            }
        } catch (error) {
            console.error('Error validating skills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIAnalysis = async () => {
        try {
            console.log('========== GENERATE AI ANALYSIS STARTED ==========');
            console.log('Timestamp:', new Date().toISOString());
            console.log('Session ID:', sessionId);

            // First set the phase to AI_ANALYSIS to show loading screen
            console.log('→ Setting phase to AI_ANALYSIS...');
            setCurrentPhase('AI_ANALYSIS');
            setIsLoading(true);
            console.log('✅ Phase set to AI_ANALYSIS, isLoading set to true');

            const { auth } = await import('@/lib/firebase');
            const user = auth.currentUser;
            if (!user) {
                console.error('❌ User not authenticated');
                return;
            }
            console.log('✅ User authenticated:', user.uid);

            const token = await user.getIdToken();
            console.log('✅ JWT token obtained');
            console.log('→ Calling backend API: /api/counselling/generate-analysis');

            const response = await fetch('http://localhost:5000/api/counselling/generate-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId })
            });

            console.log('✅ API call completed');
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Analysis generated successfully!');
                console.log('Result keys:', Object.keys(result));
                console.log('Result:', JSON.stringify(result, null, 2));
                console.log('→ Calling onComplete callback...');
                onComplete(result);
                console.log('✅ onComplete callback called');
            } else {
                const error = await response.json();
                console.error('❌ Failed to generate analysis');
                console.error('Error status:', response.status);
                console.error('Error response:', error);
                alert('Failed to generate analysis. Please try again.');
            }
        } catch (error) {
            console.error('========== GENERATE AI ANALYSIS ERROR ==========');
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Full error:', error);
            alert('Error generating analysis. Please check your connection and try again.');
        } finally {
            console.log('→ Setting isLoading to false');
            setIsLoading(false);
            console.log('========== GENERATE AI ANALYSIS COMPLETED ==========');
        }
    };

    // Skill extraction phase
    const renderSkillExtraction = () => (
        <div className="questionnaire-phase">
            <div className="phase-header">
                <Brain className="phase-icon" />
                <h2>Skill Extraction & Validation</h2>
                <p>Let's confirm your skills and expertise</p>
            </div>

            <div className="skill-validation-container">
                <h3>We found the following skills:</h3>
                <div className="skills-grid">
                    {extractedSkills.map((skill, index) => (
                        <div key={index} className="skill-card">
                            <div className="skill-header">
                                <input
                                    type="text"
                                    value={skill.skillName}
                                    onChange={(e) => {
                                        const updated = [...extractedSkills];
                                        updated[index].skillName = e.target.value;
                                        setExtractedSkills(updated);
                                    }}
                                    className="skill-name-input"
                                />
                                <button
                                    className="remove-skill-btn"
                                    onClick={() => {
                                        setExtractedSkills(extractedSkills.filter((_, i) => i !== index));
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="skill-options">
                                <label>Confidence Level:</label>
                                <select
                                    value={skill.confidence}
                                    onChange={(e) => {
                                        const updated = [...extractedSkills];
                                        updated[index].confidence = e.target.value as any;
                                        setExtractedSkills(updated);
                                    }}
                                    className="skill-select"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="skill-options">
                                <label>Used In:</label>
                                <select
                                    value={skill.usedIn}
                                    onChange={(e) => {
                                        const updated = [...extractedSkills];
                                        updated[index].usedIn = e.target.value;
                                        setExtractedSkills(updated);
                                    }}
                                    className="skill-select"
                                >
                                    <option value="Academic projects">Academic projects</option>
                                    <option value="Personal projects">Personal projects</option>
                                    <option value="Professional work">Professional work</option>
                                    <option value="Not used practically yet">Not used practically yet</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-skills-section">
                    <h3>Add Additional Skills:</h3>
                    <div className="skill-input-group">
                        <input
                            type="text"
                            placeholder="Enter a skill and press Enter"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && skillInput.trim()) {
                                    setAdditionalSkills([...additionalSkills, skillInput.trim()]);
                                    setSkillInput('');
                                }
                            }}
                            className="skill-input"
                        />
                    </div>

                    {additionalSkills.length > 0 && (
                        <div className="additional-skills-tags">
                            {additionalSkills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                    <button onClick={() => {
                                        setAdditionalSkills(additionalSkills.filter((_, i) => i !== index));
                                    }}>✕</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="next-phase-btn"
                    onClick={handleSkillValidation}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Continue to Questions'}
                    <ChevronRight />
                </button>
            </div>
        </div>
    );

    // Section 1: Personal Background
    const renderPersonalBackground = () => {
        const questions = [
            {
                key: 'currentStatus',
                question: 'What is your current status?',
                type: 'select',
                options: ['Student', 'Fresher', 'Working professional', 'Career break', 'Career switcher']
            },
            {
                key: 'highestQualification',
                question: 'What is your highest qualification?',
                type: 'select',
                options: ['Diploma', "Bachelor's degree", "Master's degree", 'PhD', 'Other']
            },
            {
                key: 'fieldOfEducation',
                question: 'What is your field/stream of education?',
                type: 'text'
            },
            {
                key: 'currentLocation',
                question: 'Current location (city & country)?',
                type: 'text'
            },
            {
                key: 'preferredJobLocation',
                question: 'Preferred job location?',
                type: 'select',
                options: ['Remote', 'Hybrid', 'On-site', 'Open to any']
            }
        ];

        return renderQuestionSection('Personal Background', questions, personalBackground, setPersonalBackground, 'PERSONAL_BACKGROUND', GraduationCap);
    };

    // Section 2: Career Goals
    const renderCareerGoals = () => {
        const questions = [
            {
                key: 'immediateGoal',
                question: 'What is your immediate goal (next 6–12 months)?',
                type: 'select',
                options: ['Get a job', 'Switch domain', 'Improve current role', 'Higher studies', 'Freelancing / Startup']
            },
            {
                key: 'longTermGoal',
                question: 'What is your long-term career goal (3–5 years)?',
                type: 'textarea'
            },
            {
                key: 'targetRoles',
                question: 'Which job roles are you targeting?',
                type: 'text',
                placeholder: 'e.g., Software Engineer, Data Analyst (comma-separated)'
            },
            {
                key: 'targetIndustry',
                question: 'Which industry/domain are you interested in?',
                type: 'select',
                options: ['IT', 'Data', 'Core engineering', 'Management', 'Healthcare', 'Others']
            },
            {
                key: 'careerPathClarity',
                question: 'How clear are you about your career path?',
                type: 'select',
                options: ['Very clear', 'Somewhat clear', 'Confused']
            }
        ];

        return renderQuestionSection('Career Goals & Direction', questions, careerGoals, setCareerGoals, 'CAREER_GOALS', Target);
    };

    // Section 3: Skills Assessment
    const renderSkillsAssessment = () => {
        const questions = [
            {
                key: 'strongestSkill',
                question: 'Which skill do you consider your strongest?',
                type: 'text'
            },
            {
                key: 'leastConfidentSkill',
                question: 'Which skill do you feel least confident about?',
                type: 'text'
            },
            {
                key: 'currentlyLearningSkills',
                question: 'Are you currently learning any new skills?',
                type: 'text',
                placeholder: 'e.g., React, Python, AWS (comma-separated, or leave blank)'
            },
            {
                key: 'dailyLearningTime',
                question: 'How much time can you dedicate daily for skill improvement?',
                type: 'select',
                options: ['< 1 hour', '1–2 hours', '2–4 hours', '4+ hours']
            }
        ];

        return renderQuestionSection('Skills & Technical Strength', questions, skillsAssessment, setSkillsAssessment, 'SKILLS_ASSESSMENT', Brain);
    };

    // Section 4: Work Experience
    const renderWorkExperience = () => {
        const isFresher = personalBackground.currentStatus === 'Student' || personalBackground.currentStatus === 'Fresher';

        const questions = isFresher ? [
            {
                key: 'hasInternships',
                question: 'Have you done internships?',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                key: 'hasRealWorldProjects',
                question: 'Have you worked on real-world projects?',
                type: 'select',
                options: ['Yes', 'No']
            }
        ] : [
            {
                key: 'totalYearsExperience',
                question: 'Total years of experience?',
                type: 'number'
            },
            {
                key: 'currentJobTitle',
                question: 'Current / last job title?',
                type: 'text'
            },
            {
                key: 'keyResponsibilities',
                question: 'Key responsibilities handled?',
                type: 'textarea'
            },
            {
                key: 'biggestChallenge',
                question: 'Biggest challenge faced in your role?',
                type: 'textarea'
            },
            {
                key: 'reasonForJobChange',
                question: 'Reason for job change (if applicable)?',
                type: 'textarea'
            }
        ];

        return renderQuestionSection('Work Experience', questions, workExperience, setWorkExperience, 'WORK_EXPERIENCE', Briefcase);
    };

    // Section 5: Job Readiness
    const renderJobReadiness = () => {
        const questions = [
            {
                key: 'resumeConfidence',
                question: 'How confident are you with your resume?',
                type: 'select',
                options: ['Very confident', 'Needs improvement', 'Not confident']
            },
            {
                key: 'hasAppliedToJobs',
                question: 'Have you applied to jobs using this resume?',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                key: 'interviewCallFrequency',
                question: 'Are you receiving interview calls?',
                type: 'select',
                options: ['Frequently', 'Sometimes', 'Rarely', 'Never']
            },
            {
                key: 'biggestChallenge',
                question: 'What is your biggest challenge right now?',
                type: 'select',
                options: ['Skill gap', 'Resume quality', 'Interview confidence', 'Career direction', 'Guidance']
            }
        ];

        return renderQuestionSection('Resume & Job Readiness', questions, jobReadiness, setJobReadiness, 'JOB_READINESS', CheckCircle2);
    };

    // Section 6: Personal Constraints
    const renderPersonalConstraints = () => {
        const questions = [
            {
                key: 'dailyTimeAvailable',
                question: 'How much time can you realistically dedicate per day for career improvement?',
                type: 'text',
                placeholder: 'e.g., 2 hours'
            },
            {
                key: 'hasFinancialConstraints',
                question: 'Do you have financial constraints for learning?',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                key: 'preferredLearningStyle',
                question: 'Preferred learning style?',
                type: 'select',
                options: ['Self-learning', 'Guided mentoring', 'Online courses', 'Project-based learning']
            },
            {
                key: 'careerStressLevel',
                question: 'Current stress level regarding your career?',
                type: 'select',
                options: ['Low', 'Medium', 'High']
            },
            {
                key: 'openToReskilling',
                question: 'Are you open to reskilling or changing domains completely?',
                type: 'select',
                options: ['Yes', 'No', 'Not sure']
            }
        ];

        return renderQuestionSection('Personal Constraints & Preferences', questions, personalConstraints, setPersonalConstraints, 'PERSONAL_CONSTRAINTS', TrendingUp, true);
    };

    // Generic question section renderer
    const renderQuestionSection = (
        title: string,
        questions: any[],
        data: any,
        setData: (data: any) => void,
        sectionKey: string,
        Icon: any,
        isLastSection: boolean = false
    ) => {
        const currentQ = questions[currentQuestion];

        if (!currentQ) return null;

        const handleNext = async () => {
            console.log('---------- handleNext called ----------');
            console.log('Current question index:', currentQuestion);
            console.log('Total questions:', questions.length);
            console.log('Is last question?', currentQuestion === questions.length - 1);
            console.log('Section key:', sectionKey);
            console.log('Is last section?', isLastSection);
            console.log('Data to save (raw):', data);

            // Convert "Yes"/"No" to boolean ONLY for specific boolean fields in database
            const booleanFields = ['hasInternships', 'hasRealWorldProjects', 'hasAppliedToJobs', 'hasFinancialConstraints'];
            const convertedData = { ...data };
            Object.keys(convertedData).forEach(key => {
                if (booleanFields.includes(key)) {
                    if (convertedData[key] === 'Yes') {
                        convertedData[key] = true;
                    } else if (convertedData[key] === 'No') {
                        convertedData[key] = false;
                    }
                }
            });
            console.log('Data to save (converted):', convertedData);

            try {
                if (currentQuestion < questions.length - 1) {
                    // Not the last question, advance within section
                    console.log('→ Saving and advancing to next question in same section');
                    const success = await saveResponse(sectionKey, { ...convertedData, questionNumber: currentQuestion }, false);
                    console.log('Save successful?', success);

                    if (success) {
                        setCurrentQuestion(currentQuestion + 1);
                        console.log('✅ Advanced to question', currentQuestion + 1);
                    } else {
                        console.error('❌ Save failed, not advancing');
                    }
                } else {
                    // Last question in section
                    console.log('→ Last question - saving and advancing to next section');
                    const success = await saveResponse(sectionKey, { ...convertedData, questionNumber: currentQuestion }, true);
                    console.log('Save successful?', success);

                    if (success) {
                        if (isLastSection) {
                            console.log('→ This is the last section - generating AI analysis');
                            await generateAIAnalysis();
                        } else {
                            console.log('✅ Section completed, should advance to next section now');
                        }
                    } else {
                        console.error('❌ Save failed, not advancing to next section');
                    }
                }
            } catch (error) {
                console.error('❌ Error in handleNext:', error);
            }

            console.log('---------- handleNext completed ----------');
        };

        const handleBack = () => {
            if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
            }
        };

        return (
            <div className="questionnaire-phase">
                <div className="phase-header">
                    <Icon className="phase-icon" />
                    <h2>{title}</h2>
                    <p>Question {currentQuestion + 1} of {questions.length}</p>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <div className="question-container">
                    <h3>{currentQ.question}</h3>

                    {currentQ.type === 'select' && (
                        <select
                            value={data[currentQ.key] || ''}
                            onChange={(e) => {
                                console.log('Select changed for:', currentQ.key, 'New value:', e.target.value);
                                const newData = { ...data, [currentQ.key]: e.target.value };
                                console.log('Updated data:', newData);
                                setData(newData);
                            }}
                            className="question-select"
                        >
                            <option value="">Select an option...</option>
                            {currentQ.options.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}

                    {currentQ.type === 'text' && (
                        <input
                            type="text"
                            value={data[currentQ.key] || ''}
                            onChange={(e) => setData({ ...data, [currentQ.key]: e.target.value })}
                            placeholder={currentQ.placeholder || 'Enter your answer...'}
                            className="question-input"
                        />
                    )}

                    {currentQ.type === 'number' && (
                        <input
                            type="number"
                            value={data[currentQ.key] || ''}
                            onChange={(e) => setData({ ...data, [currentQ.key]: parseFloat(e.target.value) })}
                            placeholder={currentQ.placeholder || 'Enter number...'}
                            className="question-input"
                        />
                    )}

                    {currentQ.type === 'textarea' && (
                        <textarea
                            value={data[currentQ.key] || ''}
                            onChange={(e) => setData({ ...data, [currentQ.key]: e.target.value })}
                            placeholder={currentQ.placeholder || 'Enter your answer...'}
                            className="question-textarea"
                            rows={4}
                        />
                    )}

                    <div className="question-nav-buttons">
                        {currentQuestion > 0 && (
                            <button className="nav-btn back-btn" onClick={handleBack}>
                                <ChevronLeft /> Back
                            </button>
                        )}

                        <button
                            className="nav-btn next-btn"
                            onClick={() => {
                                console.log('========== NEXT BUTTON CLICKED ==========');
                                console.log('Current question:', currentQ);
                                console.log('Current data:', data);
                                console.log('Answer for', currentQ.key, ':', data[currentQ.key]);
                                console.log('Is answer truthy?', !!data[currentQ.key]);
                                console.log('Is loading?', isLoading);
                                console.log('=========================================');
                                handleNext();
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' :
                                isLastSection && currentQuestion === questions.length - 1
                                    ? 'Generate Analysis'
                                    : currentQuestion === questions.length - 1
                                        ? 'Next Section'
                                        : 'Next'}
                            {!isLoading && <ChevronRight />}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div className="counselling-questionnaire">
            <div className="questionnaire-container">
                {currentPhase === 'SKILL_EXTRACTION' && renderSkillExtraction()}
                {currentPhase === 'PERSONAL_BACKGROUND' && renderPersonalBackground()}
                {currentPhase === 'CAREER_GOALS' && renderCareerGoals()}
                {currentPhase === 'SKILLS_ASSESSMENT' && renderSkillsAssessment()}
                {currentPhase === 'WORK_EXPERIENCE' && renderWorkExperience()}
                {currentPhase === 'JOB_READINESS' && renderJobReadiness()}
                {currentPhase === 'PERSONAL_CONSTRAINTS' && renderPersonalConstraints()}

                {isLoading && currentPhase === 'AI_ANALYSIS' && (
                    <div className="generating-analysis">
                        <Sparkles className="sparkle-icon spinning" />
                        <h2>Generating Your Personalized Analysis...</h2>
                        <p>Our AI is analyzing your responses to create a comprehensive career roadmap</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CounsellingQuestionnaire;
