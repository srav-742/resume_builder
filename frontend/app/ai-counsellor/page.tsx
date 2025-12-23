
import React from 'react';
import ChatInterface from '@/components/AICounsellor/ChatInterface';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Career Counsellor | Resume Builder',
    description: 'Get personalized career guidance and AI-powered resume assistance.',
};

export default function AICounsellorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <ChatInterface />
        </div>
    );
}
