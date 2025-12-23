"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Eye, Download, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resume {
    id: string;
    fullName: string;
    role: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
    status: string;
    template: string;
}

interface ResumeSelectorProps {
    resumes: Resume[];
    onClose: () => void;
    onSelectResume: (resume: Resume) => void;
    isLoading?: boolean;
}

// Template thumbnail mapping
const TEMPLATE_THUMBNAILS: Record<string, string> = {
    modern: "/templates/modern-thumb.png",
    classic: "/templates/classic-thumb.png",
    minimal: "/templates/minimal-thumb.png",
    creative: "/templates/creative-thumb.png",
    professional: "/templates/professional-thumb.png",
};

// Template colors for fallback
const TEMPLATE_COLORS: Record<string, string> = {
    modern: "from-blue-400 to-purple-500",
    classic: "from-gray-400 to-gray-600",
    minimal: "from-green-400 to-teal-500",
    creative: "from-pink-400 to-orange-500",
    professional: "from-indigo-400 to-blue-500",
};

export default function ResumeSelector({ resumes, onClose, onSelectResume, isLoading }: ResumeSelectorProps) {
    if (resumes.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-md w-full bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Resumes</h2>
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">You haven't created any resumes yet.</p>
                            <Button onClick={onClose}>Close</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="max-w-5xl w-full bg-white dark:bg-gray-800 my-8">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Your Resume Templates</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} found
                            </p>
                        </div>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Resume Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
                        {resumes.map((resume) => {
                            const templateColor = TEMPLATE_COLORS[resume.template] || "from-gray-400 to-gray-600";

                            return (
                                <Card
                                    key={resume.id}
                                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-400"
                                    onClick={() => onSelectResume(resume)}
                                >
                                    <div className="relative">
                                        {/* Template Thumbnail/Preview */}
                                        <div className={cn(
                                            "h-48 bg-gradient-to-br",
                                            templateColor,
                                            "flex items-center justify-center relative overflow-hidden"
                                        )}>
                                            {/* Template Name Overlay */}
                                            <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-xs font-semibold">
                                                {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)}
                                            </div>

                                            {/* Resume Preview Mockup */}
                                            <div className="w-32 h-40 bg-white rounded shadow-lg p-2 transform hover:scale-105 transition-transform">
                                                <div className="h-full border border-gray-200 rounded p-2">
                                                    <div className="h-2 bg-gray-800 rounded mb-1"></div>
                                                    <div className="h-1 bg-gray-400 rounded mb-2 w-3/4"></div>
                                                    <div className="space-y-1">
                                                        <div className="h-1 bg-gray-300 rounded"></div>
                                                        <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                                                        <div className="h-1 bg-gray-300 rounded w-4/6"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Resume Info */}
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-lg mb-1 truncate">
                                                {resume.fullName || "Untitled Resume"}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                                                {resume.role || "No role specified"}
                                            </p>

                                            {/* Skills */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {resume.skills.slice(0, 3).map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {resume.skills.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{resume.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Meta Info */}
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>
                                                    {new Date(resume.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full",
                                                    resume.status === "Active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                )}>
                                                    {resume.status}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectResume(resume);
                                                    }}
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Handle edit action
                                                        console.log("Edit resume:", resume.id);
                                                    }}
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end">
                        <Button onClick={onClose} variant="outline">
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
