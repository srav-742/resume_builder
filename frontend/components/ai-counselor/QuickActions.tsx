// components/ai-counselor/QuickActions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function QuickActions({ onModeSelect }: { onModeSelect: (mode: string, targetRole?: string) => void }) {
  const [targetRole, setTargetRole] = useState('');

  return (
    <div className="bg-white p-4 border-b">
      <div className="flex gap-2 mb-3">
        <Button variant="outline" onClick={() => onModeSelect('gap', targetRole)}>
          🎯 Gap Analysis
        </Button>
        <Button variant="outline" onClick={() => onModeSelect('quiz')}>
          🧠 Skill Quiz
        </Button>
        <Button variant="outline" onClick={() => onModeSelect('mock')}>
          💼 Mock Interview
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Target Role (e.g., Frontend Developer)"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => onModeSelect('gap', targetRole)}>Go</Button>
      </div>
    </div>
  );
}