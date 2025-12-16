
import React from 'react';
import ChatInterface from '@/components/AICounsellor/ChatInterface';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Career Counsellor | Resume Builder',
    description: 'Get expert career advice and resume tips from our AI counsellor.',
};

export default function AICounsellorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <ChatInterface />
        </div>
    );
}
