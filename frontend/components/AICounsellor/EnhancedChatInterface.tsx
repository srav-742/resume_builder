"use client";

import React, { useState } from 'react';
import WelcomeScreen, { AIMode } from './WelcomeScreen';
import ChatInterfaceWithMode from './ChatInterfaceWithMode';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EnhancedChatInterface() {
    const [currentMode, setCurrentMode] = useState<AIMode | null>(null);
    const [showWelcome, setShowWelcome] = useState(true);

    const handleModeSelect = (mode: AIMode) => {
        setCurrentMode(mode);
        setShowWelcome(false);
    };

    const handleBackToWelcome = () => {
        setCurrentMode(null);
        setShowWelcome(true);
    };

    return (
        <div className="relative w-full h-full">
            {showWelcome ? (
                <WelcomeScreen onSelectMode={handleModeSelect} />
            ) : (
                <div className="relative w-full h-full">
                    {/* Back to Welcome Button */}
                    <div className="absolute top-4 left-4 z-20">
                        <Button
                            onClick={handleBackToWelcome}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Options
                        </Button>
                    </div>

                    {/* Chat Interface with Selected Mode */}
                    <ChatInterfaceWithMode
                        selectedMode={currentMode!}
                        onModeChange={handleBackToWelcome}
                    />
                </div>
            )}
        </div>
    );
}
