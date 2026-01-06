"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Lock, FileText, Brain, MessageCircle, Mic, MicOff, Volume2, ArrowLeft, Upload, Download, Edit, Eye, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { chatWithAI, getUserResume } from "@/services/api";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { getQuizQuestions, getAvailableQuizSkills } from "@/lib/quizQuestions";
import WelcomeScreen, { AIMode } from "./WelcomeScreen";
import ResumeSelector from "./ResumeSelector";
import ResumeSelectionFlow from "./ResumeSelectionFlow";
import CounsellingQuestionnaire from "./CounsellingQuestionnaire";
import CounsellingResults from "./CounsellingResults";
import "./chat-interface.css";


type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
    showResumesButton?: boolean; // Optional flag to show Resumes button
    showActionButtons?: boolean; // Optional flag to show Career Counselling and other action buttons
};

type ResumeData = {
    fullName: string;
    role: string;
    skills: string[];
    experience: string;
};

type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
};

type QuizState = {
    active: boolean;
    questions: QuizQuestion[];
    currentQuestion: number;
    userAnswers: (number | null)[];
    selectedSkill: string;
    showResults: boolean;
    score: number;
};

type InterviewState = {
    active: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    allQuestions: string[];  // Store all 5 questions upfront
    currentQuestion: string;
    questionNumber: number;
    totalQuestions: number;
    questionsAndAnswers: Array<{ question: string; answer: string; feedback: string }>;
    showFinalReport: boolean;
};

// ✅ Using pre-built quiz questions - NO API CALLS!
const FRONTEND_SKILLS = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"];
const BACKEND_SKILLS = ["Node.js", "Express.js", "Python", "MongoDB"];

const formatAIResponse = (text: string) => {
    return text.split('\n').map((line, idx) => (
        <p key={idx} className="mb-2 leading-relaxed">{line}</p>
    ));
};

const calculateExperience = (workExp: any) => {
    if (!workExp?.startDate) return "Not Set";
    const start = new Date(workExp.startDate);
    const end = workExp.currentlyWorking ? new Date() : new Date(workExp.endDate || new Date());
    const years = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return years > 0 ? `${years} Years` : "Less than 1 Year";
};

export default function ChatInterface() {
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(false); // Changed to false to show chat directly
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome-1",
            role: "ai",
            content: "Hey there, welcome to AI Career Counsellor! How can I help you today? 😊",
            timestamp: new Date()
        },
        {
            id: "action-buttons",
            role: "ai",
            content: "", // Empty content, just showing action buttons
            timestamp: new Date(),
            showActionButtons: true // This will display Career Counselling and other buttons
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [activeMode, setActiveMode] = useState<string | null>(null);
    const [quizState, setQuizState] = useState<QuizState>({
        active: false,
        questions: [],
        currentQuestion: 0,
        userAnswers: [],
        selectedSkill: "",
        showResults: false,
        score: 0
    });
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);
    const [interviewState, setInterviewState] = useState<InterviewState>({
        active: false,
        isListening: false,
        isSpeaking: false,
        allQuestions: [],
        currentQuestion: "",
        questionNumber: 0,
        totalQuestions: 5,
        questionsAndAnswers: [],
        showFinalReport: false
    });
    const [uploadedResume, setUploadedResume] = useState<File | null>(null);
    const [showResumeSelector, setShowResumeSelector] = useState(false);
    const [fetchedResumes, setFetchedResumes] = useState<any[]>([]);

    // Counselling State
    const [counsellingSessionId, setCounsellingSessionId] = useState<string | null>(null);
    const [counsellingPhase, setCounsellingPhase] = useState<string>('RESUME_SELECTION');
    const [counsellingAnalysis, setCounsellingAnalysis] = useState<any>(null);


    const endRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        fetchResumeData();
    }, []);

    const fetchResumeData = async () => {
        try {
            const resume = await getUserResume();
            if (resume) {
                setResumeData({
                    fullName: resume.personalInfo?.fullName || "Not Set",
                    role: resume.workExperience?.[0]?.jobTitle || "Not Set",
                    skills: resume.skills || [],
                    experience: calculateExperience(resume.workExperience?.[0]) || "Not Set"
                });
            }
        } catch (error) {
            console.error("Failed to fetch resume data:", error);
        }
    };

    const handleModeSelection = (mode: AIMode) => {
        setShowWelcomeScreen(false);

        // Clear any existing modes
        setQuizState({ ...quizState, active: false });
        setInterviewState({ ...interviewState, active: false });

        // Handle different modes
        switch (mode) {
            case "resume_analysis":
                handleResumeAnalysis();
                break;
            case "gap_analysis":
                handleGapAnalysis();
                break;
            case "mock_interview":
                handleMockInterview();
                break;
            case "tech_quiz":
                handleTechQuizClick();
                break;
            case "career_counselling":
                handleCareerCounselling();
                break;
            case "resume_building":
                const resumeBuildingMsg: Message = {
                    id: Date.now().toString(),
                    role: "ai",
                    content: `📝 **Resume Building & Improvement Guide**\n\n**I can help you with:**\n✅ Crafting compelling resume sections\n✅ Writing impactful bullet points\n✅ Choosing the right keywords for ATS\n✅ Structuring your education and experience\n✅ Creating a powerful summary/objective\n\n**What would you like help with today?**\n- Writing a resume summary\n- Improving work experience descriptions\n- Adding projects effectively\n- Optimizing for specific job roles\n- General resume structure advice\n\nJust ask me anything about resume building!`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, resumeBuildingMsg]);
                break;
            case "general_chat":
                const counselingMsg: Message = {
                    id: Date.now().toString(),
                    role: "ai",
                    content: `💼 **Career Counseling & Guidance**\n\n**I'm here to help with:**\n✅ Career planning and development\n✅ Job search strategies\n✅ Interview preparation tips\n✅ Skill development recommendations\n✅ Industry insights and trends\n✅ Salary negotiation advice\n\n**Popular Topics:**\n- "How to switch careers?"\n- "What skills are in demand?"\n- "How to prepare for interviews?"\n- "Career growth strategies"\n- "Work-life balance tips"\n\nFeel free to ask me anything about your career!`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, counselingMsg]);
                break;
        }
    };

    const handleBackToWelcome = () => {
        // Reset all states and show welcome screen
        setShowWelcomeScreen(true);
        setActiveMode(null);
        setQuizState({
            active: false,
            questions: [],
            currentQuestion: 0,
            userAnswers: [],
            selectedSkill: "",
            showResults: false,
            score: 0
        });
        setInterviewState({
            active: false,
            isListening: false,
            isSpeaking: false,
            allQuestions: [],
            currentQuestion: "",
            questionNumber: 0,
            totalQuestions: 5,
            questionsAndAnswers: [],
            showFinalReport: false
        });
        setShowSkillDropdown(false);
        // Optionally clear messages or keep them
        // setMessages([]);
    };

    const handleFileUpload = () => {
        // Trigger the hidden file input
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: "❌ **Invalid File Type**\n\nPlease upload a resume file in one of these formats:\n- PDF (.pdf)\n- Word Document (.docx, .doc)\n- Text File (.txt)\n\nTry again with a supported format!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
            return;
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: "❌ **File Too Large**\n\nYour resume file is too large. Please upload a file smaller than 5MB.\n\n**Current size:** " + (file.size / 1024 / 1024).toFixed(2) + " MB\n**Maximum size:** 5 MB\n\nTry compressing your file or using a different format!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
            return;
        }

        setUploadedResume(file);

        // Show user message about upload
        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: `Uploaded resume: ${file.name}`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);

        // Show AI confirmation with file details
        const confirmMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: `✅ **Resume Uploaded Successfully!**\n\n📄 **File Details:**\n- **Name:** ${file.name}\n- **Type:** ${file.type.split('/').pop()?.toUpperCase() || 'Unknown'}\n- **Size:** ${(file.size / 1024).toFixed(2)} KB\n- **Uploaded:** ${new Date().toLocaleTimeString()}\n\n**What would you like me to do?**\n\n1. **Analyze this resume** - I can review the content, structure, and quality\n2. **Extract information** - I'll pull out key details like skills, experience, etc.\n3. **Compare with your profile** - See how it matches your current resume\n4. **Get improvement tips** - Suggestions to make it better\n\n**Note:** For full resume parsing and analysis, I can analyze the text content. Would you like me to analyze this resume now?\n\n*Type "analyze" or "yes" to start the analysis!*`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMsg]);

        // Reset file input for future uploads
        event.target.value = '';
    };

    const handleShowResumes = async () => {
        setIsLoading(true);

        try {
            // Get Firebase auth token
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }
            const token = await user.getIdToken();

            // Fetch user's resumes from API
            const response = await fetch('http://localhost:5000/api/users/resumes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch resumes');
            }

            const resumes = await response.json();

            // Set fetched resumes and show selector modal
            setFetchedResumes(resumes);
            setShowResumeSelector(true);

        } catch (error) {
            console.error('Error fetching resumes:', error);

            // Show error message in chat
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: "❌ **Unable to fetch your resumes**\n\nThere was an error loading your resumes. This could be because:\n- No resumes have been created yet\n- Connection issue with the server\n- You need to log in first\n\n**Try these:**\n- Refresh the page\n- Create a new resume in Resume Builder\n- Ask me for help: 'How do I create a resume?'",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectResume = (resume: any) => {
        // Close the selector
        setShowResumeSelector(false);

        // Add message to chat showing selected resume
        const msg: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: `📄 **You selected: ${resume.fullName || 'Untitled Resume'}**\n\n**Role:** ${resume.role || 'Not specified'}\n**Template:** ${resume.template}\n**Skills:** ${resume.skills?.join(', ') || 'None'}\n**Status:** ${resume.status}\n\n**What would you like me to do with this resume?**\n- Analyze it for improvements\n- Check ATS compatibility\n- Compare with job requirements\n- Get career advice based on this resume\n\nJust let me know!`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, msg]);
    };

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Check if interview is active - process as interview answer
        if (interviewState.active && !interviewState.showFinalReport) {
            setIsLoading(true);

            try {
                // Save Q&A without immediate feedback
                const newQA = {
                    question: interviewState.currentQuestion,
                    answer: text,
                    feedback: "" // Will be analyzed at the end
                };

                const updatedQAs = [...interviewState.questionsAndAnswers, newQA];

                // Check if we should ask another question or finish
                if (interviewState.questionNumber < interviewState.totalQuestions - 1) {
                    // Get next pre-generated question (NO API CALL!)
                    const nextQuestionNumber = interviewState.questionNumber + 1;
                    const nextQuestion = interviewState.allQuestions[nextQuestionNumber];

                    const nextQMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "ai",
                        content: `**Question ${nextQuestionNumber + 1} of ${interviewState.totalQuestions}:**\n\n${nextQuestion}`,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, nextQMsg]);

                    setInterviewState(prev => ({
                        ...prev,
                        currentQuestion: nextQuestion,
                        questionNumber: prev.questionNumber + 1,
                        questionsAndAnswers: updatedQAs
                    }));
                } else {
                    // All questions answered - Now analyze everything together
                    const reportPrompt = `You are a technical interviewer. Analyze these interview answers and provide a VERY SHORT response (maximum 10 lines).

Candidate: ${resumeData?.role || "professional"} with ${resumeData?.experience || "unknown"} experience

Questions and Answers:
${updatedQAs.map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join('\n\n')}

Provide ONLY:
1. A score out of 100 (e.g., "Score: 65/100")
2. Performance level (Excellent/Good/Average/Weak)
3. Top 3 things to improve (one sentence each)

Keep it SHORT - maximum 10 lines total!`;

                    const { response: finalReport } = await chatWithAI(reportPrompt);

                    const reportMsg: Message = {
                        id: (Date.now() + 2).toString(),
                        role: "ai",
                        content: `🎤 **Interview Complete - Performance Analysis**\n\n${finalReport}\n\n---\n\n**💡 Next Steps:**\n- Review the feedback carefully\n- Work on the recommended improvements\n- Practice again after improving\n- Take another mock interview to track progress!`,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, reportMsg]);

                    setInterviewState(prev => ({
                        ...prev,
                        questionsAndAnswers: updatedQAs,
                        showFinalReport: true,
                        active: false
                    }));

                    setActiveMode(null);
                }
            } catch (error) {
                console.error('Failed to process interview answer:', error);
                console.error('Error details:', error instanceof Error ? error.message : String(error));
                console.error('Interview state:', interviewState);

                const errorMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: `Error processing answer: ${error instanceof Error ? error.message : 'Unknown error'}. Interview state: active=${interviewState.active}, question=${interviewState.questionNumber}/${interviewState.totalQuestions}`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMsg]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // Normal chat flow (not interview)
        setIsLoading(true);

        try {
            const { response } = await chatWithAI(text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error: any) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "I'm having trouble connecting right now.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeAnalysis = async () => {
        setActiveMode("resume");
        setQuizState({ ...quizState, active: false });
        setInterviewState({ ...interviewState, active: false });

        setIsLoading(true);

        try {
            const fullName = resumeData?.fullName || "Not Set";
            const role = resumeData?.role || "Not Set";
            const skills = resumeData?.skills || [];
            const experience = resumeData?.experience || "Not Set";

            const prompt = `You are an expert resume reviewer and ATS specialist. Analyze this resume comprehensively:

**Name:** ${fullName}
**Current Role:** ${role}
**Skills:** ${skills.join(", ")}
**Years of Experience:** ${experience}

Provide a detailed resume analysis with:

## 1. OVERALL IMPRESSION
Provide a quick summary of the resume's strengths and weaknesses (2-3 sentences).

## 2. RESUME STRUCTURE REVIEW
- Is the information well-organized?
- Are there any missing sections (e.g., summary, projects, certifications)?
- How's the overall formatting and readability?

## 3. ATS COMPATIBILITY
- Will this resume pass ATS (Applicant Tracking Systems)?
- Are the skills properly formatted for ATS scanning?
- What keywords are missing for the role "${role}"?

## 4. CONTENT QUALITY
- Are the skills relevant to the role?
- Does the experience level match the role expectations?
- What's missing from the skill set?

## 5. IMPROVEMENT RECOMMENDATIONS
Provide 5-7 specific, actionable improvements:
- What to add
- What to remove or improve
- How to make the resume stand out

## 6. COMPETITIVE SCORE
Rate this resume out of 100 for the role "${role}" and explain why.

Be honest, specific, and constructive!`;

            const { response: analysis } = await chatWithAI(prompt);

            const resumeMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: analysis,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, resumeMsg]);

        } catch (error: any) {
            console.error("Resume analysis failed:", error);

            const errorMessage = error?.message?.includes("Rate limit")
                ? `⚠️ **API Rate Limit Reached**

The resume analysis couldn't be generated due to too many API requests.

**Wait 2 minutes** and try again. Resume Analysis will show you:
✅ Overall impression of your resume
✅ Resume structure review
✅ ATS compatibility check
✅ Content quality assessment
✅ Specific improvement recommendations
✅ Competitive score for your role`
                : `Failed to analyze resume. Please try again.`;

            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: errorMessage,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGapAnalysis = async () => {
        setActiveMode("gap");
        setQuizState({ ...quizState, active: false });
        setInterviewState({ ...interviewState, active: false });

        setIsLoading(true);

        try {
            const role = resumeData?.role || "developer";
            const skills = resumeData?.skills || [];
            const experience = resumeData?.experience || "Not Set"; // Use the calculated experience string

            const prompt = `You are a career advisor. Analyze this resume and identify skill gaps:

**Current Role:** ${role}
**Current Skills:** ${skills.join(", ")}
**Years of Experience:** ${experience}

Provide a detailed gap analysis with:

## 1. MISSING CRITICAL SKILLS
List 5-7 essential skills for a ${role} that are NOT in their current skillset.

## 2. SKILLS TO UPGRADE
Which existing skills need improvement based on their experience level?

## 3. PROGRAMMING LANGUAGES
What languages should they learn to advance in this role?

## 4. RESUME GAPS
What's missing from their resume? (certifications, projects, experience areas)

## 5. ACTIONABLE ROADMAP
Provide a 3-month learning plan with specific steps.

Be specific and honest!`;

            const { response: analysis } = await chatWithAI(prompt);

            const gapMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: analysis,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, gapMsg]);

        } catch (error: any) {
            console.error("Gap analysis failed:", error);

            const errorMessage = error?.message?.includes("Rate limit")
                ? `⚠️ **API Rate Limit Reached**

The gap analysis couldn't be generated due to too many API requests.

**Wait 2 minutes** and try again. Gap Analysis will show you:
✅ Missing critical skills for your role
✅ Skills that need upgrading
✅ Programming languages to learn
✅ Resume gaps to fill
✅ 3-month learning roadmap`
                : `Failed to analyze resume gaps. Please try again.`;

            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: errorMessage,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTechQuizClick = () => {
        setShowSkillDropdown(true);
        setActiveMode("quiz");
        setInterviewState({ ...interviewState, active: false });
    };

    const startQuizWithSkill = async (skill: string) => {
        setQuizState({
            ...quizState,
            selectedSkill: skill,
            active: true,
            showResults: false
        });
        setShowSkillDropdown(false);
        setIsLoading(true);

        try {
            // ✅ NO API CALL! Using pre-built questions
            const questions = getQuizQuestions(skill, 5);

            if (questions.length === 0) {
                throw new Error("No questions available for this skill");
            }

            setQuizState(prev => ({
                ...prev,
                questions,
                userAnswers: new Array(questions.length).fill(null),
                currentQuestion: 0
            }));

            // Show confirmation message
            const startMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: `Great! I've prepared 5 ${skill} questions for you. Take your time and select the best answer for each question. Good luck! 🎯`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, startMsg]);

        } catch (error: any) {
            console.error("Quiz generation failed:", error);

            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: `Failed to load quiz questions for ${skill}. Please try another skill.`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);

            setQuizState(prev => ({ ...prev, active: false }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...quizState.userAnswers];
        newAnswers[quizState.currentQuestion] = answerIndex;
        setQuizState(prev => ({ ...prev, userAnswers: newAnswers }));
    };

    const handleNextQuestion = () => {
        if (quizState.currentQuestion < quizState.questions.length - 1) {
            setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
        }
    };

    const handlePreviousQuestion = () => {
        if (quizState.currentQuestion > 0) {
            setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
        }
    };

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        quizState.questions.forEach((q, idx) => {
            if (quizState.userAnswers[idx] === q.correctAnswer) correctCount++;
        });
        const score = (correctCount / quizState.questions.length) * 100;
        setQuizState(prev => ({ ...prev, showResults: true, score }));

        // Generate performance analysis message
        const skill = quizState.selectedSkill;
        const performance = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Needs Improvement";
        const feedback = score >= 80
            ? `Outstanding! You have a strong understanding of ${skill}! 🎉`
            : score >= 60
                ? `Good job! You have a solid foundation in ${skill}, but there's room for improvement.`
                : score >= 40
                    ? `You're on the right track! Keep practicing ${skill} to strengthen your knowledge.`
                    : `Don't worry! Everyone starts somewhere. Focus on ${skill} fundamentals and practice more.`;

        // Identify weak areas
        const wrongAnswers = quizState.questions
            .map((q, idx) => ({
                question: q.question,
                wrongAnswer: quizState.userAnswers[idx] !== q.correctAnswer,
                topic: q.question.substring(0, 30) + "..."
            }))
            .filter(item => item.wrongAnswer);

        const improvements = score < 100 ? [
            `Review ${skill} documentation thoroughly`,
            `Practice with more ${skill} coding exercises`,
            `Build small projects using ${skill}`,
            `Watch video tutorials on ${skill} concepts you missed`,
            wrongAnswers.length > 2 ? `Focus on fundamentals - you missed ${wrongAnswers.length} questions` : `Review the specific topics you missed`
        ] : [];

        const analysisMsg: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: `🎯 **${skill} Quiz - Performance Analysis**

**📊 Your Score:**
${score.toFixed(0)}% (${correctCount} out of ${quizState.questions.length} correct)

**📈 Performance Level:**
${performance} ${score >= 80 ? "🌟" : score >= 60 ? "👍" : score >= 40 ? "📚" : "💪"}

**💬 Feedback:**
${feedback}

${score < 100 ? `
**❌ Questions You Missed: ${wrongAnswers.length}**
${wrongAnswers.map((item, i) => `${i + 1}. ${item.topic}`).join("\n")}

**🎯 What You Need to Improve:**
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join("\n")}

**📚 Recommended Learning Path:**
1. **Review Basics:** Go through ${skill} fundamentals again
2. **Practice:** Solve 10-15 coding problems on ${skill}
3. **Build:** Create a small project using ${skill}
4. **Retake Quiz:** Come back and score 100%!

**🔗 Free Resources:**
- ${skill === "HTML" ? "MDN HTML Guides" : skill === "CSS" ? "CSS-Tricks" : skill === "JavaScript" ? "JavaScript.info" : skill === "React" ? "React Official Docs" : skill === "Node.js" ? "NodeJS.org Guides" : `${skill} Official Documentation`}
- freeCodeCamp ${skill} Course
- YouTube: "${skill} Tutorial for Beginners"
- LeetCode/HackerRank ${skill} Practice
` : `
**✅ Perfect Score!**
Congratulations! You've mastered ${skill}! 🏆

**🚀 Next Steps:**
1. Try quizzes on other technologies
2. Build advanced projects with ${skill}
3. Help others learn ${skill}
4. Consider getting certified in ${skill}
`}

---

**💡 Ready to improve?**
- Take another quiz on a different topic
- Or chat with me for personalized learning advice!`,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, analysisMsg]);
    };

    const resetQuiz = () => {
        setQuizState({
            active: false,
            questions: [],
            currentQuestion: 0,
            userAnswers: [],
            selectedSkill: "",
            showResults: false,
            score: 0
        });
        setActiveMode(null);
    };

    // Voice Interview Functions
    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => {
                setInterviewState(prev => ({ ...prev, isSpeaking: true }));
            };

            utterance.onend = () => {
                setInterviewState(prev => ({ ...prev, isSpeaking: false }));
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    const startVoiceRecognition = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Voice recognition is not supported in your browser.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onstart = () => {
            setInterviewState(prev => ({ ...prev, isListening: true }));
        };

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("User answered:", transcript);
            console.log("Current question number:", interviewState.questionNumber);

            // Show user's answer in chat
            const userMsg: Message = {
                id: Date.now().toString(),
                role: "user",
                content: transcript,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);

            setIsLoading(true);
            setInterviewState(prev => ({ ...prev, isListening: false }));

            try {
                // Save Q&A without immediate feedback
                const newQA = {
                    question: interviewState.currentQuestion,
                    answer: transcript,
                    feedback: "" // Will be analyzed at the end
                };

                const updatedQAs = [...interviewState.questionsAndAnswers, newQA];
                console.log("Total answers so far:", updatedQAs.length);

                // Check if we should ask another question or finish
                if (interviewState.questionNumber < interviewState.totalQuestions - 1) {
                    console.log("Asking next question...");
                    // Get next pre-generated question (NO API CALL!)
                    const nextQuestionNumber = interviewState.questionNumber + 1;
                    const nextQuestion = interviewState.allQuestions[nextQuestionNumber];

                    const nextQMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "ai",
                        content: nextQuestion,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, nextQMsg]);

                    setInterviewState(prev => ({
                        ...prev,
                        currentQuestion: nextQuestion,
                        questionNumber: prev.questionNumber + 1,
                        questionsAndAnswers: updatedQAs
                    }));

                    // Speak next question
                    setTimeout(() => speak(nextQuestion), 500);
                } else {
                    // All questions answered - Now analyze everything together
                    console.log("🎯 Interview Complete! Analyzing all answers...");

                    const reportPrompt = `You are a technical interviewer analyzing interview performance for a ${resumeData?.role} position.

Here are ALL 5 questions and the candidate's answers:

${updatedQAs.map((qa, i) => `📝 QUESTION ${i + 1}: ${qa.question}
💬 ANSWER: ${qa.answer}`).join('\n\n')}

---

Provide a DETAILED analysis with the following sections:

## 1. OVERALL PERFORMANCE
Summarize how well the candidate performed overall (1-2 sentences).

## 2. QUESTION-BY-QUESTION ANALYSIS
For EACH of the 5 questions:
- Q1: [Evaluate quality, completeness, technical accuracy]
- Q2: [Evaluate quality, completeness, technical accuracy]
- Q3: [Evaluate quality, completeness, technical accuracy]
- Q4: [Evaluate quality, completeness, technical accuracy]
- Q5: [Evaluate quality, completeness, technical accuracy]

## 3. SKILLS & LANGUAGES TO IMPROVE
Based on the answers, list SPECIFIC technical skills and programming languages where the candidate is LAGGING:
- [Skill/Language 1]: Why they need to improve this
- [Skill/Language 2]: Why they need to improve this
- [Skill/Language 3]: Why they need to improve this

## 4. KNOWLEDGE GAPS
What important topics or concepts did they miss or answer incorrectly?

## 5. ACTIONABLE RECOMMENDATIONS
Provide 3-5 specific steps they should take:
1. [Action item]
2. [Action item]
3. [Action item]

Be HONEST and SPECIFIC. Don't just be polite - point out real weaknesses and gaps!`;

                    console.log("🤖 Calling AI for detailed analysis...");
                    const { response: finalReport } = await chatWithAI(reportPrompt);

                    const reportMsg: Message = {
                        id: (Date.now() + 2).toString(),
                        role: "ai",
                        content: finalReport,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, reportMsg]);

                    setInterviewState(prev => ({
                        ...prev,
                        questionsAndAnswers: updatedQAs,
                        showFinalReport: true
                    }));

                    // Speak the summary
                    setTimeout(() => speak(finalReport), 500);
                }
            } catch (error) {
                console.error('Failed to process answer:', error);
            } finally {
                setIsLoading(false);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setInterviewState(prev => ({ ...prev, isListening: false }));
        };

        recognition.start();
    };

    const handleMockInterview = async () => {
        setActiveMode("interview");
        setQuizState({ ...quizState, active: false });

        // CLIENT-SIDE question generation - NO API CALL to avoid rate limits!
        const role = resumeData?.role || "developer";
        const skills = resumeData?.skills || [];
        const primarySkill = skills[0] || "programming";
        const skillList = skills.slice(0, 3).join(", ") || "technology";

        const finalQuestions = [
            `Tell me about your experience as a ${role}. What projects have you worked on?`,
            `What are your strongest technical skills in ${primarySkill} and how have you applied them?`,
            `Describe a challenging bug or technical problem you encountered. How did you solve it?`,
            `How do you stay updated with new technologies and best practices in ${skillList}?`,
            `Why are you interested in this ${role} position and what are your career goals?`
        ];

        const firstQuestion = finalQuestions[0];

        // Set interview state with ALL questions
        setInterviewState({
            active: true,
            isListening: false,
            isSpeaking: false,
            allQuestions: finalQuestions,
            currentQuestion: firstQuestion,
            questionNumber: 0,
            totalQuestions: 5,
            questionsAndAnswers: [],
            showFinalReport: false
        });

        const aiMsg: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: firstQuestion,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        setTimeout(() => {
            speak(firstQuestion);
        }, 500);
    };

    const stopInterview = () => {
        window.speechSynthesis.cancel();
        setInterviewState({
            active: false,
            isListening: false,
            isSpeaking: false,
            allQuestions: [],
            currentQuestion: "",
            questionNumber: 0,
            totalQuestions: 5,
            questionsAndAnswers: [],
            showFinalReport: false
        });
        setActiveMode(null);
    };

    // ===== CAREER COUNSELLING HANDLERS =====
    const handleCareerCounselling = async () => {
        setActiveMode("career_counselling");
        setCounsellingPhase('RESUME_SELECTION');
        setShowWelcomeScreen(false);

        try {
            // Get Firebase auth token properly
            const user = auth.currentUser;
            if (!user) {
                console.error('User not authenticated');
                setActiveMode(null);
                return;
            }

            const token = await user.getIdToken();
            console.log('Starting counselling session with token...');

            const response = await fetch('http://localhost:5000/api/counselling/start-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Session started:', data);
                setCounsellingSessionId(data.sessionId);
            } else {
                const errorData = await response.json();
                console.error('Failed to start counselling session:', errorData);
                setActiveMode(null);
            }
        } catch (error) {
            console.error('Error starting counselling session:', error);
            setActiveMode(null);
        }
    };

    const handleResumeSelected = async (resumeId: string | null, manualSkills?: string[]) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('User not authenticated');
                return;
            }

            const token = await user.getIdToken();
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
            } else {
                console.error('Failed to select resume');
            }
        } catch (error) {
            console.error('Error selecting resume:', error);
        }
    };

    const handleCounsellingComplete = (analysis: any) => {
        console.log('========== COUNSELLING COMPLETE ==========');
        console.log('Analysis received:', analysis);
        console.log('Analysis structure:', JSON.stringify(analysis, null, 2));
        console.log('Has analysis property:', !!analysis.analysis);
        console.log('Has fullReport property:', !!analysis.fullReport);
        console.log('==========================================');

        setCounsellingAnalysis(analysis);
        setCounsellingPhase('RESULTS');
    };

    const handleStartSkillAssessmentFromCounselling = () => {
        setCounsellingPhase('ASSESSMENT');
        setActiveMode(null);
        handleTechQuizClick();
    };

    const handleStartMockInterviewFromCounselling = () => {
        setCounsellingPhase('INTERVIEW');
        setActiveMode(null);
        handleMockInterview();
    };

    const handleUpdateResumeFromCounselling = () => {
        const msg: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: "Resume update feature will be integrated with your resume builder. For now, you can navigate to the Resume Builder section to apply AI suggestions!",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, msg]);
        setActiveMode(null);
        setCounsellingPhase('RESUME_SELECTION');
    };

    const handleBackToChatFromCounselling = () => {
        // Just switch off career counselling mode but keep the analysis
        setActiveMode(null);
        // Don't reset phase or analysis, so user can go back to view results
    };

    const handleViewCounsellingResults = () => {
        // Go back to viewing the results
        if (counsellingAnalysis) {
            setActiveMode('career_counselling');
            setCounsellingPhase('RESULTS');
        }
    };

    const renderCounsellingFlow = () => {
        if (!counsellingSessionId && activeMode === 'career_counselling') {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
                        <p className="text-lg font-medium">Starting counselling session...</p>
                    </div>
                </div>
            );
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

        return null;
    };

    // Information display functions (instead of executing)
    const showGapAnalysisInfo = () => {
        const infoMsg: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: `📊 **Gap Analysis - Feature Overview**

**What it does:**
Gap Analysis identifies missing skills and knowledge gaps in your resume compared to industry standards for your role.

**What you'll get:**
✅ List of 5-7 essential skills missing from your current skillset
✅ Recommendations for skills that need improvement
✅ Programming languages to learn for career advancement
✅ Missing certifications, projects, or experience areas
✅ 3-month actionable learning roadmap

**Resume Context Used:**
- Current Role: ${resumeData?.role || "Not Set"}
- Current Skills: ${resumeData?.skills?.slice(0, 5).join(", ") || "Not Set"}
- Experience Level: ${resumeData?.experience || "Not Set"}

**API Usage:** Makes 1 API call to analyze your specific gaps

Would you like me to run a Gap Analysis now? Just type "yes" or ask me to "analyze my gaps"!`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, infoMsg]);
    };

    const showTechQuizInfo = () => {
        const infoMsg: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: `🧠 **Tech Quiz - Feature Overview**

**What it does:**
Test your technical knowledge with a 5-question multiple-choice quiz on various technologies.

**Available Topics:**
📘 **Frontend:** HTML, CSS, JavaScript, TypeScript, React, Next.js
📗 **Backend:** Node.js, Express.js, Python, MongoDB

**What you'll get:**
✅ 5 carefully curated multiple-choice questions
✅ Instant quiz loading (no waiting!)
✅ Score calculation and performance feedback
✅ Identify areas where you need more practice

**Special Feature:**
⚡ **Zero API calls!** - Questions are pre-loaded for instant access
🎯 **No rate limits** - Take as many quizzes as you want
📚 **Professional quality** - All questions are industry-standard

**API Usage:** 0 API calls (fully optimized!)

Ready to test your skills? Just click "Tech Quiz" button and select your topic!`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, infoMsg]);
    };

    const showMockInterviewInfo = () => {
        const infoMsg: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: `🎤 **Mock Interview - Feature Overview**

**What it does:**
Conducts a realistic AI-powered voice interview tailored to your resume and experience level.

**How it works:**
1️⃣ I ask 5 interview questions based on your role: ${resumeData?.role || "your profession"}
2️⃣ You answer using voice (speech-to-text) or typing
3️⃣ After all 5 questions, I provide a comprehensive performance analysis

**What you'll get:**
✅ 5 personalized interview questions matching your experience
✅ Voice-enabled interaction (optional)
✅ Question-by-question evaluation
✅ Overall performance summary
✅ Specific skills and languages to improve
✅ Knowledge gaps identification
✅ Actionable recommendations for improvement

**Resume Context Used:**
- Your Role: ${resumeData?.role || "Not Set"}
- Primary Skills: ${resumeData?.skills?.slice(0, 3).join(", ") || "Not Set"}
- Experience: ${resumeData?.experience || "Not Set  "}

**API Usage:** 
- Questions: 0 API calls (generated client-side)
- Final Analysis: 1 API call for comprehensive feedback

**Pro Tip:** Enable your microphone for a realistic interview experience!

Ready to practice? Type "start mock interview" or "begin interview"!`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, infoMsg]);
    };

    // Handler functions for clickable options WITHOUT API calls
    const handleOptionClick = (option: string) => {
        let infoMsg: Message;

        switch (option) {
            case 'gap_analysis':
                // Actual gap analysis based on resume data
                const role = resumeData?.role || "web developer";
                const skills = resumeData?.skills || [];
                const experience = resumeData?.experience || "Less than 1 Year";

                // Define industry-standard skills for common roles
                const roleRequirements: Record<string, string[]> = {
                    "web developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git", "REST APIs", "MongoDB", "Express.js", "TypeScript"],
                    "frontend developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Redux", "Webpack", "Git", "Responsive Design", "Testing"],
                    "backend developer": ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs", "Authentication", "Docker", "Git", "Testing", "TypeScript"],
                    "full stack developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "PostgreSQL", "Git", "Docker", "AWS", "TypeScript"],
                    "software engineer": ["Data Structures", "Algorithms", "System Design", "Git", "Testing", "CI/CD", "Docker", "Cloud (AWS/Azure)", "TypeScript", "Microservices"]
                };

                // Get required skills for the role (case-insensitive match)
                const roleLower = role.toLowerCase();
                let requiredSkills = roleRequirements[roleLower] || roleRequirements["web developer"];

                // Find missing skills
                const userSkillsLower = skills.map((s: string) => s.toLowerCase());
                const missingSkills = requiredSkills.filter(skill =>
                    !userSkillsLower.some(userSkill =>
                        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
                    )
                );

                // Find skills user has
                const hasSkills = requiredSkills.filter(skill =>
                    userSkillsLower.some(userSkill =>
                        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
                    )
                );

                // Recommendations based on experience level
                const isJunior = experience.toLowerCase().includes("less than") || experience.includes("1 Year") || experience.includes("0");
                const isMid = experience.includes("2") || experience.includes("3") || experience.includes("4");

                let experienceGaps = [];
                let certifications = [];
                let projectSuggestions = [];

                if (isJunior) {
                    experienceGaps = [
                        "Build 3-5 complete projects to showcase your skills",
                        "Contribute to open-source projects on GitHub",
                        "Create a personal portfolio website",
                        "Write technical blog posts about what you learn"
                    ];
                    certifications = [
                        "freeCodeCamp Responsive Web Design",
                        "JavaScript Algorithms and Data Structures",
                        "Meta Front-End Developer (Coursera)",
                        "Google UX Design Certificate"
                    ];
                    projectSuggestions = [
                        "E-commerce website with cart functionality",
                        "Task management app with authentication",
                        "Weather app using external APIs",
                        "Blog platform with CRUD operations",
                        "Real-time chat application"
                    ];
                } else if (isMid) {
                    experienceGaps = [
                        "Lead at least one project from start to finish",
                        "Mentor junior developers",
                        "Contribute to system architecture decisions",
                        "Implement CI/CD pipelines"
                    ];
                    certifications = [
                        "AWS Certified Developer - Associate",
                        "Google Cloud Professional Developer",
                        "MongoDB Certified Developer",
                        "Docker Certified Associate"
                    ];
                    projectSuggestions = [
                        "Microservices architecture project",
                        "Real-time collaboration tool",
                        "Cloud-native application with AWS/Azure",
                        "Performance optimization case study",
                        "Open-source contribution with significant impact"
                    ];
                } else {
                    experienceGaps = [
                        "Architect and design scalable systems",
                        "Lead and mentor development teams",
                        "Drive technical strategy and roadmap",
                        "Contribute to high-impact open-source projects"
                    ];
                    certifications = [
                        "AWS Solutions Architect Professional",
                        "System Design Expert Certification",
                        "Tech Lead Bootcamp",
                        "Leadership and Management Courses"
                    ];
                    projectSuggestions = [
                        "System design implementation (scalable to millions)",
                        "Technical blog or video tutorials",
                        "Speaking at tech conferences",
                        "Building and maintaining OSS libraries"
                    ];
                }

                infoMsg = {
                    id: Date.now().toString(),
                    role: "ai",
                    content: `🎯 **Gap Analysis for ${resumeData?.fullName || "You"}**

**📊 Your Current Profile:**
- **Role:** ${role}
- **Skills:** ${skills.join(", ") || "No skills listed"}
- **Experience:** ${experience}

---

**✅ Skills You Already Have (${hasSkills.length}/${requiredSkills.length}):**
${hasSkills.length > 0 ? hasSkills.map(s => `✓ ${s}`).join("\n") : "None from the required list"}

---

**❌ MISSING SKILLS - What You Need to Add (${missingSkills.length}):**
${missingSkills.length > 0 ? missingSkills.map((s, i) => `${i + 1}. **${s}** - Industry standard for ${role}`).join("\n") : "✅ You have all the essential skills!"}

${missingSkills.length > 0 ? `
**🎯 Priority Skills to Learn First:**
1. **${missingSkills[0]}** - Most important
2. **${missingSkills[1] || missingSkills[0]}** - Second priority
3. **${missingSkills[2] || missingSkills[1] || missingSkills[0]}** - Third priority
` : ""}

---

**📚 RECOMMENDED CERTIFICATIONS:**
${certifications.map((c, i) => `${i + 1}. ${c}`).join("\n")}

---

**🚀 PROJECT SUGGESTIONS to Fill Gaps:**
${projectSuggestions.map((p, i) => `${i + 1}. ${p}`).join("\n")}

---

**⚠️ EXPERIENCE GAPS & AREAS TO IMPROVE:**
${experienceGaps.map((g, i) => `${i + 1}. ${g}`).join("\n")}

---

**📝 WHAT TO ADD TO YOUR RESUME:**

**1. Skills Section - Add These:**
${missingSkills.slice(0, 5).map(s => `   • ${s}`).join("\n")}

**2. Projects Section - Build & Add:**
   • ${projectSuggestions[0]}
   • ${projectSuggestions[1]}
   • ${projectSuggestions[2]}

**3. Certifications Section - Get & Add:**
   • ${certifications[0]}
   • ${certifications[1]}

**4. Additional Sections to Include:**
   • GitHub profile link with active repositories
   • Portfolio website showcasing projects
   • Technical blog or LinkedIn articles
   • Open-source contributions
   • Achievements & awards

---

**🎯 3-MONTH ACTION PLAN:**

**Month 1:**
- Learn ${missingSkills[0] || "new technology"}
- Start building ${projectSuggestions[0]}
- Create GitHub profile if not exists

**Month 2:**
- Learn ${missingSkills[1] || "second skill"}
- Complete first project
- Start ${projectSuggestions[1]}
- Begin ${certifications[0]}

**Month 3:**
- Learn ${missingSkills[2] || "third skill"}
- Complete second project
- Finish certification
- Update resume with new skills & projects
- Apply for Jobs!

---

**💡 NEXT STEPS:**
1. Start with the Priority Skills above
2. Build the suggested projects
3. Get at least one certification
4. Update your resume every week
5. Practice with Mock Interview (button below)

**🎓 Free Learning Resources:**
- freeCodeCamp.org - Free coding bootcamp
- MDN Web Docs - Best for web development
- YouTube tutorials for ${missingSkills[0] || "technologies"}
- LeetCode/HackerRank - Coding practice

---

Ready to start learning? Pick the first priority skill and let's go! 🚀`,
                    timestamp: new Date(),
                };
                break;

            case 'tech_quiz':
                infoMsg = {
                    id: Date.now().toString(),
                    role: "ai",
                    content: `🧠 **Tech Quiz - Choose Your Topic**

Select a technology to test your knowledge with 5 multiple-choice questions:

**📘 Frontend Technologies:**
[QUIZ_BUTTON:HTML]
[QUIZ_BUTTON:CSS]
[QUIZ_BUTTON:JavaScript]
[QUIZ_BUTTON:TypeScript]
[QUIZ_BUTTON:React]
[QUIZ_BUTTON:Next.js]

**📗 Backend Technologies:**
[QUIZ_BUTTON:Node.js]
[QUIZ_BUTTON:Express.js]
[QUIZ_BUTTON:Python]
[QUIZ_BUTTON:MongoDB]

Each quiz has:
✅ 5 multiple-choice questions
✅ Instant scoring
✅ Performance analysis
✅ Improvement suggestions

Click any technology above to start! 🚀`,
                    timestamp: new Date(),
                };
                break;

            case 'mock_interview':
                infoMsg = {
                    id: Date.now().toString(),
                    role: "ai",
                    content: `🎤 **Mock Interview - Complete Overview**

**How It Works:**

**Phase 1: Interview Setup**
- AI generates 5 questions based on YOUR resume
- Questions match your role: ${resumeData?.role || "your role"}
- Tailored to your experience level: ${resumeData?.experience || "your level"}

**Phase 2: The Interview (5 Questions)**
1. **Question 1:** About your experience and projects
2. **Question 2:** Technical skills demonstration
3. **Question 3:** Problem-solving scenario
4. **Question 4:** Technology knowledge
5. **Question 5:** Career goals and motivation

**Phase 3: Your Answers**
- 🎤 Use voice input (speech-to-text)
- ⌨️ Or type your answers
- ⏱️ No time limits - answer at your pace
- 🔊 Questions read aloud to you

**Phase 4: Performance Analysis**
After all 5 questions, you get:
✅ Overall performance summary
✅ Individual question evaluation
✅ Skills you need to improve
✅ Knowledge gaps identified
✅ Specific action items
✅ Interview tips for improvement

**Perfect For:**
- First-time interview prep
- Practicing technical discussions
- Building confidence
- Improving communication

**System Requirements:**
🎤 Microphone (optional, for voice)
🔊 Speakers (to hear questions)

**Next Steps:**
Click the "Mock Interview" button below to start your practice session!`,
                    timestamp: new Date(),
                };
                break;

            default:
                return;
        }

        setMessages((prev) => [...prev, infoMsg]);
    };

    // Render clickable options for welcome message
    const renderMessageContent = (msg: Message) => {
        // Check if this is the welcome message with options
        if (msg.id === "welcome-2" && msg.content.includes("Choose an option below")) {
            return (
                <div>
                    <p className="mb-4">Choose an option below to get started:</p>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <button
                            onClick={() => handleOptionClick('career_counselling')}
                            className="option-btn btn-gradient-indigo"
                        >
                            <Sparkles className="h-5 w-5 text-indigo-600" />
                            <div className="text-left">
                                <div className="font-bold text-gray-900">Career Counselling</div>
                                <div className="text-xs text-gray-500 font-normal">Expert guidance for your journey</div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleOptionClick('gap_analysis')}
                            className="option-btn btn-gradient-purple"
                        >
                            <Brain className="h-5 w-5 text-purple-600" />
                            <div className="text-left">
                                <div className="font-bold text-gray-900">Gap Analysis</div>
                                <div className="text-xs text-gray-500 font-normal">Identify and bridge skill gaps</div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleOptionClick('tech_quiz')}
                            className="option-btn btn-gradient-blue"
                        >
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div className="text-left">
                                <div className="font-bold text-gray-900">Tech Quiz</div>
                                <div className="text-xs text-gray-500 font-normal">Validate your technical skills</div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleOptionClick('mock_interview')}
                            className="option-btn btn-gradient-green"
                        >
                            <Mic className="h-5 w-5 text-green-600" />
                            <div className="text-left">
                                <div className="font-bold text-gray-900">Mock Interview</div>
                                <div className="text-xs text-gray-500 font-normal">AI-powered interview practice</div>
                            </div>
                        </button>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Or chat with me directly!</p>
                </div>
            );
        }

        // Check if message contains quiz buttons
        if (msg.content.includes("[QUIZ_BUTTON:")) {
            const lines = msg.content.split("\n");
            const elements: JSX.Element[] = [];

            lines.forEach((line, idx) => {
                if (line.includes("[QUIZ_BUTTON:")) {
                    // Extract technology name
                    const match = line.match(/\[QUIZ_BUTTON:(.+?)\]/);
                    if (match) {
                        const tech = match[1];
                        const isFrontend = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"].includes(tech);

                        elements.push(
                            <button
                                key={`quiz-${idx}`}
                                onClick={() => startQuizWithSkill(tech)}
                                className={cn(
                                    "w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors border-2",
                                    isFrontend
                                        ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-300 dark:border-blue-700"
                                        : "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 border-green-300 dark:border-green-700"
                                )}
                            >
                                <span className={cn(
                                    "font-semibold",
                                    isFrontend ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"
                                )}>
                                    {isFrontend ? "📘" : "📗"} {tech}
                                </span>
                            </button>
                        );
                    }
                } else if (line.trim() && !line.includes("**")) {
                    // Regular text line
                    elements.push(<p key={`text-${idx}`} className="mb-2">{line}</p>);
                } else if (line.includes("**")) {
                    // Bold heading
                    const cleaned = line.replace(/\*\*/g, "");
                    elements.push(<p key={`heading-${idx}`} className="font-bold mt-3 mb-2">{cleaned}</p>);
                }
            });

            return <div>{elements}</div>;
        }

        // For all other messages, use the regular formatting
        const formattedContent = formatAIResponse(msg.content);

        // If this message should show the Resumes button, add it below the content
        if (msg.showResumesButton) {
            return (
                <div>
                    {formattedContent}
                    <div className="mt-4">
                        <Button
                            onClick={handleShowResumes}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <FileText className="h-4 w-4" />
                            📄 Resumes
                        </Button>
                    </div>
                </div>
            );
        }

        // If this message should show the Action buttons, display them in a grid
        if (msg.showActionButtons) {
            return (
                <div className="mt-4">
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                        {counsellingAnalysis ? (
                            <Button
                                onClick={handleViewCounsellingResults}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white hover:from-green-400 hover:via-emerald-500 hover:to-teal-500 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] transition-all duration-300 font-bold text-sm border border-green-400/30 hover:border-green-400/60 hover:scale-105"
                            >
                                <Eye className="h-5 w-5" />
                                View My Results
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCareerCounselling}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all duration-300 font-bold text-sm border border-cyan-400/30 hover:border-cyan-400/60 hover:scale-105"
                            >
                                <Sparkles className="h-5 w-5 animate-pulse" />
                                Career Counselling
                            </Button>
                        )}
                        <Button
                            onClick={handleGapAnalysis}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 bg-gradient-to-br from-violet-500 via-fuchsia-600 to-pink-600 text-white hover:from-violet-400 hover:via-fuchsia-500 hover:to-pink-500 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(167,139,250,0.6)] hover:shadow-[0_0_50px_rgba(167,139,250,0.8)] transition-all duration-300 font-bold text-sm border border-violet-400/30 hover:border-violet-400/60 hover:scale-105"
                        >
                            <FileText className="h-5 w-5" />
                            Gap Analysis
                        </Button>
                        <Button
                            onClick={handleTechQuizClick}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white hover:from-amber-400 hover:via-orange-500 hover:to-red-500 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(251,146,60,0.6)] hover:shadow-[0_0_50px_rgba(251,146,60,0.8)] transition-all duration-300 font-bold text-sm border border-amber-400/30 hover:border-amber-400/60 hover:scale-105"
                        >
                            <Brain className="h-5 w-5" />
                            Tech Quiz
                        </Button>
                        <Button
                            onClick={handleMockInterview}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white hover:from-emerald-400 hover:via-green-500 hover:to-teal-500 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] transition-all duration-300 font-bold text-sm border border-emerald-400/30 hover:border-emerald-400/60 hover:scale-105"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Mock Interview
                        </Button>
                    </div>
                </div>
            );
        }

        return formattedContent;
    };

    return (
        <div className="ai-counsellor-bg">
            <div className="ai-counsellor-container">
                {activeMode === 'career_counselling' ? (
                    <div className="flex-1 counselling-content-wrapper">
                        {renderCounsellingFlow()}
                    </div>
                ) : showWelcomeScreen ? (
                    <WelcomeScreen
                        onSelectMode={handleModeSelection}
                        userName={resumeData?.fullName}
                    />
                ) : (
                    <>
                        <Card className="resume-sidebar glass-card hidden md:flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 float-animation" />
                                    RESUME CONTEXT
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <div className="flex justify-center mb-6">
                                    <div className="avatar-glow w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                        <User className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                                {resumeData ? (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Name</p>
                                            <p className="text-base font-bold">{resumeData.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Role</p>
                                            <p className="text-base font-bold">{resumeData.role}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Experience</p>
                                            <p className="text-base font-bold">{resumeData.experience}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Skills</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {resumeData.skills.slice(0, 10).map(skill => (
                                                    <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                                        <p className="text-sm text-gray-500">Loading context...</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex-1 flex flex-col h-full min-w-0">
                            <Card className="glass-card flex-1 flex flex-col shadow-lg">
                                <div className="chat-header-bar">
                                    <Sparkles className="h-5 w-5 float-animation" />
                                    AI COUNSELOR CHAT
                                </div>

                                <div className="chat-messages-area custom-scrollbar">
                                    <div className="flex flex-col gap-6">
                                        {messages.map((msg) => (
                                            <div key={msg.id} className={cn("flex items-start gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                                                {msg.role === "ai" && (
                                                    <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-400 to-blue-500 shadow-md">
                                                        <AvatarFallback className="text-white"><Bot className="h-6 w-6" /></AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={msg.role === "user" ? "user-message" : "ai-message"}>
                                                    {msg.role === "ai" ? renderMessageContent(msg) : msg.content}
                                                </div>
                                                {msg.role === "user" && (
                                                    <Avatar className="h-10 w-10 bg-indigo-500 shadow-md">
                                                        <AvatarFallback className="text-white"><User className="h-6 w-6" /></AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        ))}

                                        {isLoading && (
                                            <div className="flex items-start gap-4">
                                                <Avatar className="h-10 w-10 bg-purple-400">
                                                    <AvatarFallback className="text-white"><Bot className="h-6 w-6 animate-pulse" /></AvatarFallback>
                                                </Avatar>
                                                <div className="ai-message flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Thinking...</span>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={endRef} />
                                    </div>
                                </div>

                                <div className="chat-input-container">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="w-full flex gap-4">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Type your question here..."
                                            className="premium-input flex-1"
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={!input.trim() || isLoading}
                                            className="send-button"
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </form>
                                </div>

                                {showSkillDropdown && (
                                    <div className="p-6 bg-white border-t">
                                        <h3 className="font-bold mb-4">Select a technology to start your quiz:</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {FRONTEND_SKILLS.concat(BACKEND_SKILLS).map(skill => (
                                                <Button key={skill} onClick={() => startQuizWithSkill(skill)} variant="outline" className="justify-start">
                                                    {skill}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button onClick={() => setShowSkillDropdown(false)} variant="ghost" className="w-full mt-4">Cancel</Button>
                                    </div>
                                )}

                                {quizState.active && !quizState.showResults && (
                                    <div className="p-6 bg-blue-50 border-t">
                                        <div className="flex justify-between mb-4 font-bold">
                                            <span>{quizState.selectedSkill} Quiz</span>
                                            <span>Question {quizState.currentQuestion + 1} / {quizState.questions.length}</span>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                            <p className="text-lg font-bold mb-4">{quizState.questions[quizState.currentQuestion]?.question}</p>
                                            <RadioGroup value={quizState.userAnswers[quizState.currentQuestion]?.toString() || ""} onValueChange={(v) => handleAnswerSelect(parseInt(v))}>
                                                <div className="space-y-3">
                                                    {quizState.questions[quizState.currentQuestion]?.options.map((opt, i) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                                                            <RadioGroupItem value={i.toString()} id={`q${i}`} />
                                                            <Label htmlFor={`q${i}`} className="flex-1 cursor-pointer">{opt}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className="flex justify-between">
                                            <Button onClick={handlePreviousQuestion} disabled={quizState.currentQuestion === 0} variant="outline">Back</Button>
                                            <Button onClick={quizState.currentQuestion === quizState.questions.length - 1 ? handleSubmitQuiz : handleNextQuestion} className="bg-indigo-600">
                                                {quizState.currentQuestion === quizState.questions.length - 1 ? "Finish" : "Next"}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {quizState.showResults && (
                                    <div className="p-8 text-center border-t bg-green-50">
                                        <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                                        <p className="text-5xl font-black text-green-600 mb-6">{quizState.score.toFixed(0)}%</p>
                                        <Button onClick={resetQuiz} className="bg-indigo-600 px-8">Try Another Quiz</Button>
                                    </div>
                                )}

                                {interviewState.active && (
                                    <div className="p-8 bg-purple-50 border-t">
                                        <div className="text-center mb-6">
                                            <Avatar className={cn("h-24 w-24 mx-auto mb-4 bg-purple-600 shadow-lg", interviewState.isSpeaking && "animate-pulse ring-4 ring-purple-300")}>
                                                <AvatarFallback className="text-white"><Bot className="h-12 w-12" /></AvatarFallback>
                                            </Avatar>
                                            <h3 className="text-xl font-bold">Mock Interview Session</h3>
                                            <p className="text-purple-600 font-semibold">Question {interviewState.questionNumber + 1} of {interviewState.totalQuestions}</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                                            <p className="text-lg font-bold text-center leading-relaxed">{interviewState.currentQuestion}</p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <Button onClick={startVoiceRecognition} disabled={interviewState.isListening || interviewState.isSpeaking} className={cn("py-6 text-lg font-bold rounded-full transition-all", interviewState.isListening ? "bg-red-500 animate-pulse" : "bg-purple-600 hover:bg-purple-700")}>
                                                {interviewState.isListening ? "Listening... Speak Now" : "🎤 Answer with Voice"}
                                            </Button>
                                            <div className="flex gap-4">
                                                <Button onClick={stopInterview} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 py-4">Stop Interview</Button>
                                                <Button onClick={() => speak(interviewState.currentQuestion)} variant="outline" className="flex-1 py-4">Repeat Question</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </>
                )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} />
            {showResumeSelector && (
                <ResumeSelector
                    resumes={fetchedResumes}
                    onClose={() => setShowResumeSelector(false)}
                    onSelectResume={handleSelectResume}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
