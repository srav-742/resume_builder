"use client";

import React, { useState } from 'react';
import { BookOpen, Target, TrendingUp, Lightbulb, Briefcase, Heart, Download, Edit, CheckCircle, Brain, MessageCircle, ArrowLeft } from 'lucide-react';
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

    const handleDownloadPDF = () => {
        try {
            console.log("Starting PDF generation...");
            const { jsPDF } = require("jspdf");
            const doc = new jsPDF();

            // Set fonts and colors
            const primaryColor = [37, 99, 235]; // #2563eb
            const textColor = [31, 41, 55]; // #1f2937
            const secondaryColor = [107, 114, 128]; // #6b7280

            // Helper for text wrapping and auto-paging
            let yPos = 20;
            const margin = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const contentWidth = pageWidth - (margin * 2);

            const addNewPageIfNeeded = (height: number) => {
                if (yPos + height > 280) {
                    doc.addPage();
                    yPos = 20;
                    return true;
                }
                return false;
            };

            // Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("Career Counselling Report", margin, yPos);
            yPos += 10;

            doc.setFontSize(10);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text(`Generated on: ${new Date().toLocaleDateString()} | Session: ${sessionId}`, margin, yPos);
            yPos += 15;

            // Horizontal Line
            doc.setDrawColor(229, 231, 235);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 15;

            // Summary Section
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("1. Career Position Summary", margin, yPos);
            yPos += 8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const summaryLines = doc.splitTextToSize(analysis.analysis?.careerPositionSummary || "No summary available.", contentWidth);
            doc.text(summaryLines, margin, yPos);
            yPos += (summaryLines.length * 6) + 10;

            addNewPageIfNeeded(40);

            // Alignment Section
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("2. Resume vs Goal Alignment", margin, yPos);
            yPos += 8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const alignmentLines = doc.splitTextToSize(analysis.analysis?.resumeGoalAlignment || "No alignment data available.", contentWidth);
            doc.text(alignmentLines, margin, yPos);
            yPos += (alignmentLines.length * 6) + 10;

            addNewPageIfNeeded(40);

            // Skills Section
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("3. Skills Assessment", margin, yPos);
            yPos += 10;

            doc.setFontSize(12);
            doc.text("Strengths:", margin, yPos);
            yPos += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            analysis.analysis?.skillStrengths?.forEach((s: string) => {
                addNewPageIfNeeded(10);
                doc.text(`• ${s}`, margin + 5, yPos);
                yPos += 6;
            });
            yPos += 5;

            addNewPageIfNeeded(20);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Gaps:", margin, yPos);
            yPos += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            analysis.analysis?.skillGaps?.forEach((g: string) => {
                addNewPageIfNeeded(10);
                doc.text(`• ${g}`, margin + 5, yPos);
                yPos += 6;
            });
            yPos += 10;

            addNewPageIfNeeded(50);

            // Roadmap Section
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("4. Learning Roadmap", margin, yPos);
            yPos += 10;

            const renderRoadmap = (title: string, items: string[]) => {
                addNewPageIfNeeded(30);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                doc.text(title, margin, yPos);
                yPos += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                items?.forEach((item: string) => {
                    addNewPageIfNeeded(10);
                    const wrappedItem = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
                    doc.text(wrappedItem, margin + 5, yPos);
                    yPos += (wrappedItem.length * 5) + 2;
                });
                yPos += 5;
            };

            renderRoadmap("Immediate (0-3 Months)", analysis.analysis?.learningRoadmap?.immediate);
            renderRoadmap("Short-term (3-6 Months)", analysis.analysis?.learningRoadmap?.shortTerm);
            renderRoadmap("Medium-term (6-12 Months)", analysis.analysis?.learningRoadmap?.mediumTerm);

            addNewPageIfNeeded(40);

            // Job Strategy
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("5. Job Application Strategy", margin, yPos);
            yPos += 8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const strategyLines = doc.splitTextToSize(analysis.analysis?.jobApplicationStrategy || "No strategy available.", contentWidth);
            doc.text(strategyLines, margin, yPos);
            yPos += (strategyLines.length * 6) + 10;

            // Footer on last page
            doc.setFontSize(9);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text("This report was generated by AI Counsellor Prof. All rights reserved.", margin, 285);

            // Save PDF
            doc.save(`Career_Report_${new Date().getTime()}.pdf`);
            console.log("PDF download triggered!");
        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    return (
        <div className="counselling-results">
            <div className="results-header">
                <button
                    onClick={onBackToChat}
                    className="back-button"
                    style={{
                        position: 'absolute',
                        left: '15px',
                        top: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Chat
                </button>

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
                <button className="download-btn" onClick={handleDownloadPDF}>
                    <Download />
                    Download Full Report (PDF)
                </button>
            </div>
        </div>
    );
};

export default CounsellingResults;
