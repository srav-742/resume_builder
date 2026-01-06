'use client'

import { useState } from 'react'
import { Send, User, Search, Paperclip } from 'lucide-react'

const MOCK_CHATS = [
    { id: 1, name: 'Anjali Sharma', lastMsg: 'I have shared the portfolio link.', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Rahul Verma', lastMsg: 'Thanks for the opportunity!', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'TechFlow HR', lastMsg: 'Your interview is scheduled for Friday.', time: 'Monday', unread: 1 },
]

export default function MessagesPage() {
    const [activeChat, setActiveChat] = useState(MOCK_CHATS[0])
    const [msg, setMsg] = useState('')

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden animate-in fade-in duration-500">
            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/10">
                <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {MOCK_CHATS.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`p-4 border-b border-slate-800/30 cursor-pointer transition-all ${activeChat.id === chat.id ? 'bg-indigo-600/10 border-r-4 border-r-indigo-500' : 'hover:bg-slate-800/30'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold ${activeChat.id === chat.id ? 'text-indigo-400' : 'text-white'}`}>{chat.name}</h4>
                                <span className="text-[10px] text-slate-500">{chat.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">{chat.lastMsg}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-950/20">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white border border-slate-700 shadow-lg">
                            {activeChat.name[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{activeChat.name}</h3>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
                    <div className="flex justify-start">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl rounded-tl-none max-w-md text-sm text-slate-200 shadow-xl">
                            Hello! I'm interested in the Senior Frontend role. I've worked with React for 5 years.
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-indigo-600 p-4 rounded-3xl rounded-tr-none max-w-md text-sm text-white shadow-xl shadow-indigo-600/10">
                            That's great to hear, Anjali! Your profile looks impressive. Would you be available for a quick chat tomorrow?
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl rounded-tl-none max-w-md text-sm text-slate-200 shadow-xl">
                            Yes, afternoon works for me. I have shared the portfolio link.
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-slate-900/50 border-t border-slate-800">
                    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-2 px-4 shadow-xl focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
                        <button className="text-slate-500 hover:text-white transition"><Paperclip size={20} /></button>
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent border-none text-white outline-none py-2 text-sm"
                        />
                        <button className="bg-indigo-600 p-2 rounded-xl text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
