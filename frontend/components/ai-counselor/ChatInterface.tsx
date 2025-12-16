// components/ai-counselor/ChatInterface.tsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

export default function ChatInterface({ messages }: { messages: { role: string; content: string }[] }) {
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Select a mode above to start your career counseling session.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <Card key={i} className={`max-w-[80%] ${msg.role === 'user' ? 'ml-auto bg-blue-50' : 'mr-auto bg-white'}`}>
              <CardContent className="p-3">
                <p className="text-sm">{msg.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}