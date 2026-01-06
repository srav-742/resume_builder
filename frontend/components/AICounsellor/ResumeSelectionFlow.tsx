"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Plus, ChevronRight, Sparkles } from 'lucide-react';
import './resume-selection.css';

interface ResumeSelectionProps {
    onResumeSelected: (resumeId: string | null, manualSkills?: string[]) => void;
}

const ResumeSelection: React.FC<ResumeSelectionProps> = ({ onResumeSelected }) => {
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
    const [showManualEntry, setShowManualEntry] = useState<boolean>(false);
    const [manualSkills, setManualSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            console.log('========== FETCHING RESUMES FOR COUNSELLING ==========');

            // Use Firebase authentication
            const { auth } = await import('@/lib/firebase');
            const user = auth.currentUser;

            if (!user) {
                console.error('❌ User not authenticated');
                setIsLoading(false);
                return;
            }

            console.log('✅ User authenticated:', user.uid);
            const token = await user.getIdToken();
            console.log('✅ JWT token obtained');
            console.log('→ Calling API: /api/resume');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://resume-builder-2gji.onrender.com'}/api/resume`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Response data:', data);
                console.log('Data structure:', typeof data);
                console.log('Has resumes property:', !!data.resumes);

                // The API returns { success: true, resumes: [...] }
                const resumeList = data.resumes || data;
                console.log('✅ Resumes found:', resumeList.length);
                console.log('Resume list:', resumeList);

                setResumes(resumeList);
            } else {
                const error = await response.json();
                console.error('❌ Failed to fetch resumes:', error);
            }
        } catch (error) {
            const err = error as Error;
            console.error('❌ Error fetching resumes:', err);
            console.error('Error name:', err.name);
            console.error('Error message:', err.message);
        } finally {
            setIsLoading(false);
            console.log('========== FETCH RESUMES COMPLETED ==========');
        }
    };

    const handleContinue = () => {
        if (showManualEntry) {
            onResumeSelected(null, manualSkills);
        } else if (selectedResumeId) {
            onResumeSelected(selectedResumeId);
        }
    };

    const addSkill = () => {
        if (skillInput.trim()) {
            setManualSkills([...manualSkills, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const removeSkill = (index: number) => {
        setManualSkills(manualSkills.filter((_, i) => i !== index));
    };

    if (isLoading) {
        return (
            <div className="resume-selection-loading">
                <Sparkles className="loading-icon spinning" />
                <p>Loading your resumes...</p>
            </div>
        );
    }

    return (
        <div className="resume-selection">
            <div className="selection-container">
                <div className="selection-header">
                    <Sparkles className="header-icon" />
                    <h1>AI Career Counselling</h1>
                    <p>Let's start by understanding your skills</p>
                </div>

                {resumes.length === 0 ? (
                    // No Resume Exists
                    <div className="no-resume-container">
                        <div className="info-box">
                            <FileText className="info-icon" />
                            <h2>You haven't created a resume yet</h2>
                            <p>To continue counselling, please enter your skills manually.</p>
                        </div>

                        <div className="manual-skills-entry">
                            <h3>Enter Your Skills:</h3>
                            <div className="skill-input-container">
                                <input
                                    type="text"
                                    placeholder="Enter a skill (e.g., React, Python, etc.)"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addSkill();
                                        }
                                    }}
                                    className="skill-input"
                                />
                                <button onClick={addSkill} className="add-skill-btn">
                                    <Plus />
                                </button>
                            </div>

                            {manualSkills.length > 0 && (
                                <div className="skills-preview">
                                    <p className="skills-count">{manualSkills.length} skills added</p>
                                    <div className="skill-tags">
                                        {manualSkills.map((skill, index) => (
                                            <span key={index} className="skill-tag">
                                                {skill}
                                                <button onClick={() => removeSkill(index)}>✕</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                className="continue-btn"
                                onClick={() => onResumeSelected(null, manualSkills)}
                                disabled={manualSkills.length === 0}
                            >
                                Continue with {manualSkills.length} skills
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                ) : resumes.length === 1 ? (
                    // Single Resume
                    <div className="single-resume-container">
                        <div className="info-box">
                            <h2>We will analyze skills from your resume:</h2>
                            <div className="resume-card selected">
                                <FileText className="resume-icon" />
                                <div className="resume-info">
                                    <h3>{resumes[0].personalInfo?.fullName || 'Your Resume'}</h3>
                                    <p>{resumes[0].skills?.length || 0} skills found</p>
                                    <div className="resume-skills-preview">
                                        {resumes[0].skills?.slice(0, 5).map((skill: string, index: number) => (
                                            <span key={index} className="skill-pill">{skill}</span>
                                        ))}
                                        {resumes[0].skills?.length > 5 && (
                                            <span className="skill-pill more">+{resumes[0].skills.length - 5} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                className="continue-btn"
                                onClick={() => onResumeSelected(resumes[0]._id)}
                            >
                                Continue with this resume
                                <ChevronRight />
                            </button>

                            <button
                                className="manual-entry-btn"
                                onClick={() => setShowManualEntry(true)}
                            >
                                Or enter skills manually
                            </button>
                        </div>

                        {showManualEntry && (
                            <div className="manual-skills-entry">
                                <h3>Enter Your Skills Manually:</h3>
                                <div className="skill-input-container">
                                    <input
                                        type="text"
                                        placeholder="Enter a skill"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addSkill();
                                            }
                                        }}
                                        className="skill-input"
                                    />
                                    <button onClick={addSkill} className="add-skill-btn">
                                        <Plus />
                                    </button>
                                </div>

                                {manualSkills.length > 0 && (
                                    <div className="skills-preview">
                                        <div className="skill-tags">
                                            {manualSkills.map((skill, index) => (
                                                <span key={index} className="skill-tag">
                                                    {skill}
                                                    <button onClick={() => removeSkill(index)}>✕</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="continue-btn"
                                    onClick={() => onResumeSelected(null, manualSkills)}
                                    disabled={manualSkills.length === 0}
                                >
                                    Continue with manual skills
                                    <ChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Multiple Resumes
                    <div className="multiple-resumes-container">
                        <div className="info-box">
                            <h2>You have created {resumes.length} resumes</h2>
                            <p>Please select one resume for skill analysis and counselling.</p>
                        </div>

                        <div className="resumes-grid">
                            {resumes.map((resume) => (
                                <div
                                    key={resume._id}
                                    className={`resume-card ${selectedResumeId === resume._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedResumeId(resume._id)}
                                >
                                    <FileText className="resume-icon" />
                                    <div className="resume-info">
                                        <h3>{resume.personalInfo?.fullName || 'Unnamed Resume'}</h3>
                                        <p>{resume.skills?.length || 0} skills</p>
                                        <div className="resume-skills-preview">
                                            {resume.skills?.slice(0, 3).map((skill: string, index: number) => (
                                                <span key={index} className="skill-pill">{skill}</span>
                                            ))}
                                            {resume.skills?.length > 3 && (
                                                <span className="skill-pill more">+{resume.skills.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                    {selectedResumeId === resume._id && (
                                        <div className="selected-badge">✓</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="action-buttons">
                            <button
                                className="continue-btn"
                                onClick={handleContinue}
                                disabled={!selectedResumeId}
                            >
                                Continue with selected resume
                                <ChevronRight />
                            </button>

                            <button
                                className="manual-entry-btn"
                                onClick={() => setShowManualEntry(true)}
                            >
                                Or enter skills manually
                            </button>
                        </div>

                        {showManualEntry && (
                            <div className="manual-skills-entry">
                                <h3>Enter Your Skills Manually:</h3>
                                <div className="skill-input-container">
                                    <input
                                        type="text"
                                        placeholder="Enter a skill"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addSkill();
                                            }
                                        }}
                                        className="skill-input"
                                    />
                                    <button onClick={addSkill} className="add-skill-btn">
                                        <Plus />
                                    </button>
                                </div>

                                {manualSkills.length > 0 && (
                                    <div className="skills-preview">
                                        <div className="skill-tags">
                                            {manualSkills.map((skill, index) => (
                                                <span key={index} className="skill-tag">
                                                    {skill}
                                                    <button onClick={() => removeSkill(index)}>✕</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="continue-btn"
                                    onClick={handleContinue}
                                    disabled={manualSkills.length === 0}
                                >
                                    Continue with manual skills
                                    <ChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeSelection;
