"use client";

import React, { useState } from 'react';
import { BookOpen, Target, TrendingUp, Lightbulb, Briefcase, Heart, Download, Edit, CheckCircle, Brain, MessageCircle } from 'lucide-react';
import './counselling-results.css';

interface CounsellingResultsProps {
    analysis: any;
    sessionId: string;
    onStartSkillAssessment: () => void;
    onStartMockInterview: () => void;
    onUpdateResume: () => void;
    onBackToChat: () => void;
}

const CounsellingResults: React.FC<CounsellingResultsProps> = ({
    analysis,
    sessionId,
    onStartSkillAssessment,
    onStartMockInterview,
    onUpdateResume,
    onBackToChat
}) => {
    const [activeTab, setActiveTab] = useState<string>('summary');

    const renderFullReport = () => {
        // Display the full markdown-formatted report
        const sections = analysis.fullReport?.split('#').filter((s: string) => s.trim());

        return (
            <div className="full-report-container">
                <div className="markdown-content">
                    <pre className="report-text">{analysis.fullReport}</pre>
                </div>
            </div>
        );
    };

    const renderStructuredAnalysis = () => (
        <div className="structured-analysis">
            {/* Career Position Summary */}
            <div className="analysis-card">
                <div className="card-header">
                    <Target className="card-icon" />
                    <h3>Current Career Position</h3>
                </div>
                <div className="card-content">
                    <p>{analysis.analysis?.careerPositionSummary || 'Analyzing your current position...'}</p>
                </div>
            </div>

            {/* Resume Goal Alignment */}
            <div className="analysis-card">
                <div className="card-header">
                    <Briefcase className="card-icon" />
                    <h3>Resume vs Career Goal Alignment</h3>
                </div>
                <div className="card-content">
                    <p>{analysis.analysis?.resumeGoalAlignment || 'Analyzing alignment...'}</p>
                </div>
            </div>

            {/* Skill Strengths */}
            <div className="analysis-card strengths-card">
                <div className="card-header">
                    <CheckCircle className="card-icon" />
                    <h3>Your Skill Strengths</h3>
                </div>
                <div className="card-content">
                    <ul className="strength-list">
                        {analysis.analysis?.skillStrengths?.map((strength: string, index: number) => (
                            <li key={index} className="strength-item">
                                <CheckCircle size={20} className="check-icon" />
                                {strength}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Skill Gaps */}
            <div className="analysis-card gaps-card">
                <div className="card-header">
                    <TrendingUp className="card-icon" />
                    <h3>Skill Gaps (Priority Order)</h3>
                </div>
                <div className="card-content">
                    <ul className="gap-list">
                        {analysis.analysis?.skillGaps?.map((gap: string, index: number) => (
                            <li key={index} className="gap-item">
                                <span className="priority-badge">P{index + 1}</span>
                                {gap}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Learning Roadmap */}
            <div className="analysis-card roadmap-card">
                <div className="card-header">
                    <BookOpen className="card-icon" />
                    <h3>Learning Roadmap</h3>
                </div>
                <div className="card-content">
                    <div className="roadmap-section">
                        <h4>🎯 0-3 Months (Immediate Actions)</h4>
                        <ul>
                            {analysis.analysis?.learningRoadmap?.immediate?.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="roadmap-section">
                        <h4>🚀 3-6 Months (Short-term Goals)</h4>
                        <ul>
                            {analysis.analysis?.learningRoadmap?.shortTerm?.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="roadmap-section">
                        <h4>⭐ 6-12 Months (Medium-term Goals)</h4>
                        <ul>
                            {analysis.analysis?.learningRoadmap?.mediumTerm?.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Resume Improvement Tips */}
            <div className="analysis-card tips-card">
                <div className="card-header">
                    <Edit className="card-icon" />
                    <h3>Resume Improvement Tips</h3>
                </div>
                <div className="card-content">
                    <ul className="tips-list">
                        {analysis.analysis?.resumeImprovementTips?.map((tip: string, index: number) => (
                            <li key={index} className="tip-item">
                                <Lightbulb size={20} className="tip-icon" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Job Application Strategy */}
            <div className="analysis-card strategy-card">
                <div className="card-header">
                    <Target className="card-icon" />
                    <h3>Job Application Strategy</h3>
                </div>
                <div className="card-content">
                    <p>{analysis.analysis?.jobApplicationStrategy || 'Developing strategy...'}</p>
                </div>
            </div>

            {/* Confidence & Motivation */}
            <div className="analysis-card motivation-card">
                <div className="card-header">
                    <Heart className="card-icon" />
                    <h3>Confidence & Motivation</h3>
                </div>
                <div className="card-content">
                    <p>{analysis.analysis?.confidenceGuidance || 'You\'ve got this!'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="counselling-results">
            <div className="results-header">
                <div className="header-content">
                    <h1>🎉 Your Personalized Career Counselling Report</h1>
                    <p>Based on your comprehensive profile analysis</p>
                </div>

                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summary')}
                    >
                        Structured View
                    </button>
                    <button
                        className={`toggle-btn ${activeTab === 'full' ? 'active' : ''}`}
                        onClick={() => setActiveTab('full')}
                    >
                        Full Report
                    </button>
                </div>
            </div>

            <div className="results-content">
                {activeTab === 'summary' ? renderStructuredAnalysis() : renderFullReport()}
            </div>

            {/* Post-Counselling CTA Options */}
            <div className="post-counselling-cta">
                <h2>What Would You Like to Do Next?</h2>
                <div className="cta-grid">
                    <button className="cta-card" onClick={onUpdateResume}>
                        <Edit className="cta-icon" />
                        <h3>Improve Resume</h3>
                        <p>Apply AI suggestions to your resume</p>
                    </button>

                    <button className="cta-card" onClick={onStartSkillAssessment}>
                        <Brain className="cta-icon" />
                        <h3>Take Skill Assessment</h3>
                        <p>Evaluate your skill confidence</p>
                    </button>

                    <button className="cta-card" onClick={onStartMockInterview}>
                        <MessageCircle className="cta-icon" />
                        <h3>Start Mock Interview</h3>
                        <p>Practice with AI interviewer</p>
                    </button>

                    <button className="cta-card" onClick={onBackToChat}>
                        <MessageCircle className="cta-icon" />
                        <h3>Continue Chat</h3>
                        <p>Ask follow-up questions</p>
                    </button>
                </div>
            </div>

            <div className="download-section">
                <button className="download-btn">
                    <Download />
                    Download Full Report (PDF)
                </button>
            </div>
        </div>
    );
};

export default CounsellingResults;
