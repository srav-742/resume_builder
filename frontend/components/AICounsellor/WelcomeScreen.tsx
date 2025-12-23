"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Target,
    MessageCircle,
    Brain,
    Hammer,
    Sparkles
} from "lucide-react";
import "./welcome-screen.css";

export type AIMode =
    | "resume_analysis"
    | "gap_analysis"
    | "mock_interview"
    | "tech_quiz"
    | "career_counselling"
    | "resume_building"
    | "general_chat";

interface WelcomeOption {
    id: AIMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
}

const welcomeOptions: WelcomeOption[] = [
    {
        id: "resume_analysis",
        title: "Resume Analysis",
        description: "Get a comprehensive review of your resume structure, content, and ATS compatibility",
        icon: <FileText className="h-8 w-8" />,
        color: "text-blue-600",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "gap_analysis",
        title: "Gap Analysis",
        description: "Identify missing skills and knowledge gaps based on your target role",
        icon: <Target className="h-8 w-8" />,
        color: "text-purple-600",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: "mock_interview",
        title: "Mock Interview",
        description: "Practice with AI-powered interview questions tailored to your experience",
        icon: <MessageCircle className="h-8 w-8" />,
        color: "text-green-600",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        id: "tech_quiz",
        title: "Tech Quiz",
        description: "Test your knowledge with technical questions in your skill areas",
        icon: <Brain className="h-8 w-8" />,
        color: "text-orange-600",
        gradient: "from-orange-500 to-amber-500"
    },
    {
        id: "career_counselling",
        title: "Career Counselling",
        description: "Complete career assessment with personalized roadmap and guidance",
        icon: <Sparkles className="h-8 w-8" />,
        color: "text-pink-600",
        gradient: "from-pink-500 to-rose-500"
    },
    {
        id: "resume_building",
        title: "Resume Building",
        description: "Get step-by-step guidance on creating or improving your resume",
        icon: <Hammer className="h-8 w-8" />,
        color: "text-indigo-600",
        gradient: "from-indigo-500 to-blue-500"
    },
    {
        id: "general_chat",
        title: "General Chat",
        description: "Ask me anything about career advice, job search, or professional development",
        icon: <MessageCircle className="h-8 w-8" />,
        color: "text-teal-600",
        gradient: "from-teal-500 to-cyan-500"
    }
];

interface WelcomeScreenProps {
    onSelectMode: (mode: AIMode) => void;
    userName?: string;
}

export default function WelcomeScreen({ onSelectMode, userName }: WelcomeScreenProps) {
    return (
        <div className="welcome-screen-container p-8 max-w-6xl mx-auto">
            <div className="text-center mb-12 welcome-header">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="welcome-icon-pulse">
                        <Sparkles className="h-12 w-12 text-purple-500" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Welcome{userName ? `, ${userName}` : " to AI Career Counsellor"}!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    I'm your intelligent career assistant. Choose what you'd like help with today:
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {welcomeOptions.map((option) => (
                    <Card
                        key={option.id}
                        className="welcome-option-card group cursor-pointer border-2 hover:border-transparent transition-all duration-300 hover:shadow-2xl"
                        onClick={() => onSelectMode(option.id)}
                    >
                        <CardHeader>
                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${option.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {option.icon}
                            </div>
                            <CardTitle className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                                {option.title}
                            </CardTitle>
                            <CardDescription className="text-sm leading-relaxed">
                                {option.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className={`w-full bg-gradient-to-r ${option.gradient} text-white hover:shadow-lg transition-all duration-300`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectMode(option.id);
                                }}
                            >
                                Start {option.title}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-full border border-purple-200 dark:border-gray-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        AI is ready to assist you
                    </span>
                </div>
            </div>
        </div>
    );
}
