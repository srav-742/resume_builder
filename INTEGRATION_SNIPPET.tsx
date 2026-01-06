// =============================================================================
// INTEGRATION SNIPPET FOR ChatInterface.tsx
// =============================================================================
// Add this code to your existing ChatInterface.tsx to enable Career Counselling
// =============================================================================

// ===== 1. ADD IMPORTS (at top of file) =====
import ResumeSelectionFlow from './ResumeSelectionFlow';
import CounsellingQuestionnaire from './CounsellingQuestionnaire';
import CounsellingResults from './CounsellingResults';

// ===== 2. ADD TO STATE VARIABLES (inside ChatInterface function) =====
const [counsellingSessionId, setCounsellingSessionId] = useState<string | null>(null);
const [counsellingPhase, setCounsellingPhase] = useState<string>('RESUME_SELECTION');
const [counsellingAnalysis, setCounsellingAnalysis] = useState<any>(null);

// ===== 3. ADD CAREER COUNSELLING HANDLER =====
const handleCareerCounselling = async () => {
    setCurrentMode('career_counselling');
    setCounsellingPhase('RESUME_SELECTION');
    setShowWelcome(false);

    // Start counselling session
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/counselling/start-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setCounsellingSessionId(data.sessionId);
        } else {
            console.error('Failed to start counselling session');
        }
    } catch (error) {
        console.error('Error starting counselling session:', error);
    }
};

// ===== 4. UPDATE handleModeSelection FUNCTION =====
// Add this case to your existing handleModeSelection function:
const handleModeSelection = (mode: AIMode) => {
    if (mode === 'career_counselling') {
        handleCareerCounselling();
        return;
    }

    // ... existing mode handlers (gap_analysis, mock_interview, etc.)
};

// ===== 5. ADD RESUME SELECTION HANDLER =====
const handleResumeSelected = async (resumeId: string | null, manualSkills?: string[]) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/counselling/select-resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                sessionId: counsellingSessionId,
                resumeId,
                manualSkills
            })
        });

        if (response.ok) {
            setCounsellingPhase('QUESTIONNAIRE');
        }
    } catch (error) {
        console.error('Error selecting resume:', error);
    }
};

// ===== 6. ADD QUESTIONNAIRE COMPLETE HANDLER =====
const handleCounsellingComplete = (analysis: any) => {
    setCounsellingAnalysis(analysis);
    setCounsellingPhase('RESULTS');
};

// ===== 7. ADD POST-COUNSELLING ACTION HANDLERS =====
const handleStartSkillAssessmentFromCounselling = () => {
    // Navigate to existing skill assessment
    setCounsellingPhase('ASSESSMENT');
    handleTechQuizClick(); // Use your existing tech quiz function
};

const handleStartMockInterviewFromCounselling = () => {
    // Navigate to existing mock interview
    setCounsellingPhase('INTERVIEW');
    handleMockInterview(); // Use your existing mock interview function
};

const handleUpdateResumeFromCounselling = () => {
    // Navigate to resume builder or show AI suggestions
    alert('Resume update feature - integrate with your resume builder');
    // You can navigate to resume page or show suggestions modal
};

const handleBackToChatFromCounselling = () => {
    setCounsellingPhase('RESUME_SELECTION');
    setCurrentMode(null);
    setShowWelcome(true);
};

// ===== 8. ADD RENDER FUNCTION FOR COUNSELLING FLOW =====
const renderCounsellingFlow = () => {
    if (!counsellingSessionId) {
        return <div>Loading counselling session...</div>;
    }

    if (counsellingPhase === 'RESUME_SELECTION') {
        return (
            <ResumeSelectionFlow
                onResumeSelected={handleResumeSelected}
            />
        );
    }

    if (counsellingPhase === 'QUESTIONNAIRE') {
        return (
            <CounsellingQuestionnaire
                sessionId={counsellingSessionId}
                onComplete={handleCounsellingComplete}
                onBack={() => setCounsellingPhase('RESUME_SELECTION')}
            />
        );
    }

    if (counsellingPhase === 'RESULTS') {
        return (
            <CounsellingResults
                analysis={counsellingAnalysis}
                sessionId={counsellingSessionId}
                onStartSkillAssessment={handleStartSkillAssessmentFromCounselling}
                onStartMockInterview={handleStartMockInterviewFromCounselling}
                onUpdateResume={handleUpdateResumeFromCounselling}
                onBackToChat={handleBackToChatFromCounselling}
            />
        );
    }

    if (counsellingPhase === 'ASSESSMENT') {
        // Show skill assessment (your existing component)
        return (
            <div>
                {/* Your existing skill assessment UI */}
                {/* You already have tech quiz functionality */}
            </div>
        );
    }

    if (counsellingPhase === 'INTERVIEW') {
        // Show mock interview (your existing component)
        return (
            <div>
                {/* Your existing mock interview UI */}
            </div>
        );
    }
};

// ===== 9. UPDATE MAIN RENDER (in main return statement) =====
// Find your main return statement and add this:
return (
    <div className="chat-interface">
        {/* ... existing code ... */}

        {showWelcome && !currentMode && (
            <WelcomeScreen
                onModeSelect={handleModeSelection}
                onClose={handleBackToWelcome}
            />
        )}

        {/* ADD THIS NEW SECTION */}
        {currentMode === 'career_counselling' && renderCounsellingFlow()}

        {/* ... rest of your existing code ... */}
    </div>
);

// =============================================================================
// THAT'S IT! The career counselling flow is now integrated.
// =============================================================================

// =============================================================================
// OPTIONAL: UPDATE WelcomeScreen.tsx to add Career Counselling option
// =============================================================================

// In WelcomeScreen.tsx, update the modes array:
export const modes: Array<{
    id: AIMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
}> = [
        {
            id: 'resume_analysis',
            title: '📄 Resume Analysis',
            description: 'Get detailed feedback on your resume',
            icon: <FileText />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            id: 'gap_analysis',
            title: '🎯 Gap Analysis',
            description: 'Identify skill gaps for your target role',
            icon: <Target />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            id: 'mock_interview',
            title: '🎤 Mock Interview',
            description: 'Practice with AI interviewer',
            icon: <MessageCircle />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            id: 'tech_quiz',
            title: '🧠 Tech Quiz',
            description: 'Test your technical knowledge',
            icon: <Brain />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        // ADD THIS NEW MODE:
        {
            id: 'career_counselling',
            title: '💼 Career Counselling',
            description: 'Complete career assessment and personalized roadmap',
            icon: <Briefcase />,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            id: 'resume_building',
            title: '📝 Resume Building',
            description: 'Build your resume step by step',
            icon: <Edit />,
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        },
        {
            id: 'general_chat',
            title: '💬 General Chat',
            description: 'Ask me anything about your career',
            icon: <MessageCircle />,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        }
    ];

// Update the AIMode type:
export type AIMode =
    | 'resume_analysis'
    | 'gap_analysis'
    | 'mock_interview'
    | 'tech_quiz'
    | 'career_counselling'  // ADD THIS
    | 'resume_building'
    | 'general_chat';

// =============================================================================
// END OF INTEGRATION SNIPPET
// =============================================================================
