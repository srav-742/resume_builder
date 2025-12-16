// components/ai-counselor/AICounselorPage.tsx
'use client';

import { useEffect, useState } from 'react';
import ResumeSidebar from './ResumeSidebar';
import ChatInterface from './ChatInterface';
import QuickActions from './QuickActions';
import { fetchUserResume, startAISession } from '@/services/aiCounselorService';

export default function AICounselorPage() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const token = await getToken(); // Firebase ID token
        if (!token) return;
        const data = await fetchUserResume(token);
        setResumeData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, []);

  const handleModeSelect = async (mode: string, targetRole?: string) => {
    if (!resumeData) return;
    try {
      const token = await getToken();
      const { aiResponse } = await startAISession(token, { mode, targetRole });
      setMessages([{ role: 'assistant', content: aiResponse }]);
    } catch (err) {
      alert('AI service unavailable. Please try again.');
    }
  };

  if (loading) return <div className="p-8">Loading your resume...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <ResumeSidebar data={resumeData} />
      </div>
      <div className="w-2/3 flex flex-col">
        <QuickActions onModeSelect={handleModeSelect} />
        <ChatInterface messages={messages} />
      </div>
    </div>
  );
}

// Helper: Get Firebase ID token
async function getToken(): Promise<string | null> {
  // If using Firebase JS SDK in browser
  const user = (window as any).firebaseAuth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch (e) {
    console.error('Token error:', e);
    return null;
  }
}