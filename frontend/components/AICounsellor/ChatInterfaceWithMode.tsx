"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { chatWithAI, getUserResume } from "@/services/api";
import { cn } from "@/lib/utils";
import "./chat-interface.css";
import { AIMode, getModeWelcomeMessage, getModeName, getModeSystemPrompt } from "@/lib/aiModeConfig";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
};

type ResumeData = {
    fullName: string;
    role: string;
    skills: string[];
    experience: string;
};

const formatAIResponse = (text: string) => {
    // Split by lines and format markdown-like content
    const lines = text.split('\n');
    const formatted: JSX.Element[] = [];

    lines.forEach((line, idx) => {
        // Handle headers
        if (line.startsWith('## ')) {
            formatted.push(
                <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-purple-700 dark:text-purple-300">
                    {line.replace('## ', '')}
                </h3>
            );
        } else if (line.startsWith('# ')) {
            formatted.push(
                <h2 key={idx} className="text-2xl font-bold mt-6 mb-4 text-blue-700 dark:text-blue-300">
                    {line.replace('# ', '')}
                </h2>
            );
        }
        // Handle bullet points
        else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const content = line.trim().replace(/^[*-]\s/, '');
            formatted.push(
                <li key={idx} className="ml-4 mb-2 leading-relaxed list-disc">
                    {renderBoldText(content)}
                </li>
            );
        }
        // Handle numbered lists
        else if (/^\d+\.\s/.test(line.trim())) {
            const content = line.trim().replace(/^\d+\.\s/, '');
            formatted.push(
                <li key={idx} className="ml-4 mb-2 leading-relaxed list-decimal">
                    {renderBoldText(content)}
                </li>
            );
        }
        // Handle checkmarks
        else if (line.trim().startsWith('✅')) {
            formatted.push(
                <p key={idx} className="mb-2 leading-relaxed flex items-start gap-2">
                    <span className="text-green-500 flex-shrink-0">✅</span>
                    <span>{renderBoldText(line.trim().replace('✅', ''))}</span>
                </p>
            );
        }
        // Handle regular paragraphs
        else if (line.trim()) {
            formatted.push(
                <p key={idx} className="mb-2 leading-relaxed">
                    {renderBoldText(line)}
                </p>
            );
        }
        // Handle empty lines (spacing)
        else {
            formatted.push(<div key={idx} className="h-2" />);
        }
    });

    return <div className="space-y-1">{formatted}</div>;
};

const renderBoldText = (text: string) => {
    // Replace **text** with bold text
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx} className="font-bold text-purple-700 dark:text-purple-300">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const calculateExperience = (workExp: any) => {
    if (!workExp?.startDate) return "Not Set";
    const start = new Date(workExp.startDate);
    const end = workExp.currentlyWorking ? new Date() : new Date(workExp.endDate || new Date());
    const years = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return years > 0 ? `${years} Years` : "Less than 1 Year";
};

interface ChatInterfaceWithModeProps {
    selectedMode: AIMode;
    onModeChange?: () => void;
}

export default function ChatInterfaceWithMode({ selectedMode, onModeChange }: ChatInterfaceWithModeProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [currentMode, setCurrentMode] = useState<AIMode>(selectedMode);

    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        fetchResumeData();
    }, []);

    // Initialize mode when selected
    useEffect(() => {
        if (selectedMode) {
            setCurrentMode(selectedMode);
            initializeMode(selectedMode);
        }
    }, [selectedMode]);

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

    const initializeMode = (mode: AIMode) => {
        const welcomeMessage = getModeWelcomeMessage(mode);

        const welcomeMsg: Message = {
            id: "mode-welcome",
            role: "ai",
            content: welcomeMessage,
            timestamp: new Date()
        };

        setMessages([welcomeMsg]);
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
        setIsLoading(true);

        try {
            // Get mode-specific system prompt
            const systemPrompt = getModeSystemPrompt(currentMode);

            // Combine system prompt with user message
            const enhancedMessage = `${systemPrompt}

---

USER'S RESUME CONTEXT:
Name: ${resumeData?.fullName}
Role: ${resumeData?.role}
Skills: ${resumeData?.skills.join(', ')}
Experience: ${resumeData?.experience}

---

USER MESSAGE:
${text}

---

AI RESPONSE (following mode rules):`;

            const { response } = await chatWithAI(enhancedMessage);

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
                content: "I'm having trouble connecting right now. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const getModeColor = (mode: AIMode): string => {
        const colors: Record<AIMode, string> = {
            welcome: "bg-gray-500",
            resume_analysis: "bg-blue-500",
            gap_analysis: "bg-purple-500",
            mock_interview: "bg-green-500",
            tech_quiz: "bg-orange-500",
            resume_building: "bg-indigo-500",
            general_chat: "bg-pink-500"
        };
        return colors[mode] || "bg-gray-500";
    };

    return (
        <div className="ai-counsellor-container flex h-full gap-6 p-4 md:p-6 max-w-7xl mx-auto relative z-10">
            {/* Resume Sidebar */}
            <Card className="resume-sidebar glass-card hidden md:flex flex-col w-80 h-full border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <Lock className="h-4 w-4 float-animation" />
                        RESUME CONTEXT
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-6 space-y-6 custom-scrollbar overflow-y-auto">
                    <div className="flex justify-center">
                        <div className="avatar-glow w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <User className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    {resumeData ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Name:</p>
                                <p className="text-base font-bold text-gray-900 dark:text-gray-100">{resumeData.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Role:</p>
                                <p className="text-base font-bold">{resumeData.role}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Skills:</p>
                                <p className="text-sm">{resumeData.skills.slice(0, 6).join(', ')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Experience:</p>
                                <p className="text-base font-bold">{resumeData.experience}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-center">Loading...</p>
                    )}

                    {/* Current Mode Display */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 mb-2">Active Mode:</p>
                        <Badge className={cn("w-full justify-center py-2", getModeColor(currentMode))}>
                            {getModeName(currentMode)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col h-full">
                <Card className="glass-card flex-1 flex flex-col shadow-lg">
                    <CardHeader className="border-b pb-4">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-500 float-animation" />
                                <span>{getModeName(currentMode)}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                Intent-Based AI
                            </Badge>
                        </CardTitle>
                    </CardHeader>

                    <ScrollArea className="flex-1 p-6 custom-scrollbar">
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn("flex items-start gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                                    {msg.role === "ai" && (
                                        <Avatar className="avatar-glow h-10 w-10 bg-gradient-to-br from-purple-400 to-blue-500">
                                            <AvatarFallback className="text-white"><Bot className="h-6 w-6" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("max-w-[75%]", msg.role === "user" ? "user-message" : "ai-message")}>
                                        {msg.role === "ai" ? formatAIResponse(msg.content) : msg.content}
                                    </div>
                                    {msg.role === "user" && (
                                        <Avatar className="avatar-glow h-10 w-10 bg-blue-500">
                                            <AvatarFallback className="text-white"><User className="h-6 w-6" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-400 to-blue-500">
                                        <AvatarFallback className="text-white"><Bot className="h-6 w-6 animate-pulse" /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-gray-100 p-4 rounded-2xl flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Ask about ${getModeName(currentMode).toLowerCase()}...`}
                                className="premium-input flex-1 rounded-full"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="premium-button rounded-full bg-blue-500"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                                Mode-focused AI • Guided responses • Resume-aware
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
