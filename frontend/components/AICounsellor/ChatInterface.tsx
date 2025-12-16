"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatWithAI } from "@/services/api";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
};

const SUGGESTED_TOPICS = [
    "How can I improve my resume summary?",
    "What are common interview questions for software engineers?",
    "How do I negotiate my salary?",
    "Tips for writing a cover letter"
];

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            content: "Hello! I'm your AI Career Counsellor. I can help you with resume tips, interview preparation, and career advice. What's on your mind today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
            const { response } = await chatWithAI(text);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (error: any) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: error.message || "I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTopicClick = (topic: string) => {
        handleSend(topic);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Sidebar - Hidden on small screens */}
            <Card className="hidden md:flex flex-col w-80 h-full border-muted/50 shadow-sm bg-background/60 backdrop-blur-xl">
                <CardHeader className="pb-4 border-b">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        AI Counsellor
                    </CardTitle>
                    <CardDescription>
                        Your personal career guide
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Suggested Topics</h3>
                        <div className="flex flex-col gap-2">
                            {SUGGESTED_TOPICS.map((topic, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className="justify-start h-auto py-3 text-left whitespace-normal text-sm font-normal border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all"
                                    onClick={() => handleTopicClick(topic)}
                                >
                                    <ArrowRight className="h-4 w-4 mr-2 shrink-0 opacity-50" />
                                    {topic}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col h-full shadow-lg border-muted/50 overflow-hidden">
                <ScrollArea className="flex-1 p-4 md:p-6">
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex items-start gap-3 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <Avatar className={cn(
                                    "h-8 w-8 md:h-10 md:w-10 border shadow-sm",
                                    msg.role === "ai" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-primary/10"
                                )}>
                                    {msg.role === "ai" ? (
                                        <AvatarImage src="/ai-avatar.png" /> // Fallback handled below
                                    ) : null}
                                    <AvatarFallback className={msg.role === "ai" ? "text-purple-600" : "text-primary"}>
                                        {msg.role === "ai" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-bottom-2",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "bg-muted/50 border border-muted rounded-tl-sm"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-start gap-3 max-w-[85%] mr-auto">
                                <Avatar className="h-8 w-8 md:h-10 md:w-10 border shadow-sm bg-purple-100 dark:bg-purple-900/30">
                                    <AvatarFallback className="text-purple-600">
                                        <Bot className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="p-4 rounded-2xl rounded-tl-sm bg-muted/50 border border-muted flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2 relative"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for career advice..."
                            className="pr-12 py-6 text-base rounded-full border-muted-foreground/20 focus-visible:ring-purple-500 hover:border-purple-500/50 transition-colors shadow-sm"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-1 top-1 bottom-1 h-auto w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
