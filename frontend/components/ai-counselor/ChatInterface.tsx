// frontend/app/components/ai-counselor/ChatInterface.tsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

// Accept messages in format: { sender: 'user' | 'ai', text: string }
export default function ChatInterface({ messages }: { messages: { sender: string; text: string }[] }) {
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Select a mode above to start your career counseling session.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <Card 
              key={i} 
              className={`max-w-[80%] ${
                msg.sender === 'user' ? 'ml-auto bg-blue-50' : 'mr-auto bg-white border-gray-200'
              }`}
            >
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}