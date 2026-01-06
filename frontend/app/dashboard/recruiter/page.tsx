'use client'

import { useState } from 'react'
import { PlusCircle, Search, Users, Briefcase, Zap, Star, MoreHorizontal, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'

const ACTIVE_JOBS = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        applicants: 42,
        matches: 8,
        status: 'High Urgency',
        postedAt: '2 days ago'
    },
    {
        id: 2,
        title: 'UI/UX Designer',
        applicants: 128,
        matches: 15,
        status: 'Normal',
        postedAt: '1 week ago'
    }
]

const TOP_CANDIDATES = [
    {
        id: 1,
        name: 'Anjali Sharma',
        role: 'Senior React Developer',
        score: 98,
        skills: ['React', 'Next.js', 'Typescript'],
        why: 'Matches 100% of mandatory skills and has experience in similar high-scale fintech apps.',
    },
    {
        id: 2,
        name: 'Rahul Verma',
        role: 'Frontend Architect',
        score: 94,
        skills: ['React', 'Redux', 'Architecture'],
        why: 'Highly relevant experience in system design and leadership roles.',
    }
]

export default function RecruiterDashboard() {
    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">

            {/* Overview Stats */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 mb-4">
                        <Briefcase size={24} />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Active Posts</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-white">4</h3>
                        <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                            <TrendingUp size={16} /> +1 this week
                        </span>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
                        <Users size={24} />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Total Applicants</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-white">182</h3>
                        <span className="text-indigo-400 text-sm font-bold">24 new</span>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-4">
                        <Star size={24} />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Shortlisted</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-white">12</h3>
                        <span className="text-slate-500 text-sm font-bold">Avg 8.5/10</span>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4">
                        <Zap size={24} />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">AI Matches</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-white">23</h3>
                        <span className="text-pink-400 text-sm font-bold">Top Picks</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Active Jobs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white">Active Job Posts</h2>
                        <Link href="/dashboard/recruiter/post" className="text-sm font-bold text-pink-500 flex items-center gap-2 hover:text-pink-400 transition">
                            <PlusCircle size={18} /> New Post
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {ACTIVE_JOBS.map(job => (
                            <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition cursor-pointer group">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-pink-500 transition-colors">{job.title}</h3>
                                        <p className="text-sm text-slate-500">Posted {job.postedAt} • <span className={`font-bold ${job.status === 'High Urgency' ? 'text-pink-400' : 'text-indigo-400'}`}>{job.status}</span></p>
                                    </div>
                                    <button className="text-slate-500 hover:text-white transition">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                                        <div className="text-slate-500 text-xs font-bold uppercase mb-1">Applicants</div>
                                        <div className="text-2xl font-black text-white">{job.applicants}</div>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                                        <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                                            <Sparkles size={12} className="text-pink-400" /> Top Matches
                                        </div>
                                        <div className="text-2xl font-black text-white">{job.matches}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: AI Insights & Top Picks */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white">Top Candidate Matches</h2>
                        <Zap size={20} className="text-pink-500 animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        {TOP_CANDIDATES.map(candidate => (
                            <div key={candidate.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-pink-500/30 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-pink-500">
                                            {candidate.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{candidate.name}</h4>
                                            <p className="text-xs text-slate-500">{candidate.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-black text-pink-500">{candidate.score}%</div>
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed mb-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-pink-400 font-bold uppercase text-[10px] block mb-1">AI Explanation</span>
                                    "{candidate.why}"
                                </p>

                                <div className="flex gap-4">
                                    <button className="flex-1 bg-pink-600 hover:bg-pink-500 text-white py-2 rounded-xl text-xs font-bold transition">View Profile</button>
                                    <button className="flex-1 border border-slate-800 hover:bg-slate-800 py-2 rounded-xl text-xs font-bold transition">Message</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hiring Insights */}
                    <div className="bg-indigo-900/20 border border-indigo-500/20 p-6 rounded-3xl">
                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Hiring Insights</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-950/50 rounded-xl">
                                <p className="text-xs text-slate-400 mb-1">Market Trend</p>
                                <p className="text-sm font-medium text-white">Frontend React developers are in <span className="text-red-400">High Demand</span> right now. Salary range up 12%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
