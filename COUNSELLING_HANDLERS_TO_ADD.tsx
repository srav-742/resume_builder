// ===== ADD THESE HANDLERS TO ChatInterface.tsx AFTER stopInterview() FUNCTION =====

// ===== CAREER COUNSELLING HANDLERS =====
const handleCareerCounselling = async () => {
    setActiveMode("career_counselling");
    setCounsellingPhase('RESUME_SELECTION');
    setShowWelcomeScreen(false);

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

const handleCounsellingComplete = (analysis: any) => {
    setCounsellingAnalysis(analysis);
    setCounsellingPhase('RESULTS');
};

const handleStartSkillAssessmentFromCounselling = () => {
    setCounsellingPhase('ASSESSMENT');
    handleTechQuizClick();
};

const handleStartMockInterviewFromCounselling = () => {
    setCounsellingPhase('INTERVIEW');
    handleMockInterview();
};

const handleUpdateResumeFromCounselling = () => {
    alert('Resume update feature - integrate with your resume builder');
};

const handleBackToChatFromCounselling = () => {
    setCounsellingPhase('RESUME_SELECTION');
    setActiveMode(null);
    setShowWelcomeScreen(true);
};

const renderCounsellingFlow = () => {
    if (!counsellingSessionId && activeMode === 'career_counselling') {
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
                sessionId={counsellingSessionId!}
                onComplete={handleCounsellingComplete}
                onBack={() => setCounsellingPhase('RESUME_SELECTION')}
            />
        );
    }

    if (counsellingPhase === 'RESULTS') {
        return (
            <CounsellingResults
                analysis={counsellingAnalysis}
                sessionId={counsellingSessionId!}
                onStartSkillAssessment={handleStartSkillAssessmentFromCounselling}
                onStartMockInterview={handleStartMockInterviewFromCounselling}
                onUpdateResume={handleUpdateResumeFromCounselling}
                onBackToChat={handleBackToChatFromCounselling}
            />
        );
    }

    if (counsellingPhase === 'ASSESSMENT') {
        return null; // Show existing skill assessment UI
    }

    if (counsellingPhase === 'INTERVIEW') {
        return null; // Show existing mock interview UI
    }
};

// ===== ADD THIS TO THE MAIN RETURN STATEMENT =====
// Find the return statement and add this line before the closing div:
// {activeMode === 'career_counselling' && renderCounsellingFlow()}
