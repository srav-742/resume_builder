'use client'

import { useState } from 'react'
import { Sparkles, Briefcase, MapPin, Clock, Search, Filter, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react'

const MOCK_JOBS = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechFlow Systems',
        logo: '🚀',
        location: 'Remote',
        salary: '₹18L - ₹24L',
        matchScore: 94,
        tags: ['React', 'Next.js', 'Typescript'],
        postedAt: '2h ago'
    },
    {
        id: 2,
        title: 'Product Designer (UCX)',
        company: 'Gradient Labs',
        logo: '🎨',
        location: 'Bangalore / Hybrid',
        salary: '₹12L - ₹18L',
        matchScore: 82,
        tags: ['Figma', 'Prototyping', 'User Research'],
        postedAt: '5h ago'
    },
    {
        id: 3,
        title: 'Backend Engineer (Node.js)',
        company: 'DataScale',
        logo: '⚓',
        location: 'Remote',
        salary: '₹20L+',
        matchScore: 88,
        tags: ['Node.js', 'MongoDB', 'Redis'],
        postedAt: '1d ago'
    }
]

export default function SeekerDashboard() {
    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Morning, Sravan! 👋</h1>
                    <p className="text-slate-400">Here's what's happening with your job search today.</p>
                </div>
                <div className="flex gap-3">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex-1 md:w-40">
                        <p className="text-xs text-slate-500 uppercase font-black mb-1">Applications</p>
                        <p className="text-2xl font-black text-white">12</p>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex-1 md:w-40">
                        <p className="text-xs text-slate-500 uppercase font-black mb-1">Interviews</p>
                        <p className="text-2xl font-black text-indigo-400">2</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="text-indigo-400 w-5 h-5" />
                            AI Recommended for You
                        </h2>
                        <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition">View All</button>
                    </div>

                    <div className="space-y-4">
                        {MOCK_JOBS.map((job) => (
                            <div key={job.id} className="group bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all cursor-pointer relative overflow-hidden">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                        {job.logo}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                                <p className="text-slate-400 font-medium">{job.company}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-bold">
                                                    <Sparkles size={14} /> {job.matchScore}% Match
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                                            <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
                                            <div className="flex items-center gap-1.5"><Briefcase size={16} /> {job.salary}</div>
                                            <div className="flex items-center gap-1.5"><Clock size={16} /> {job.postedAt}</div>
                                        </div>

                                        <div className="flex gap-2 mt-5">
                                            {job.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 text-xs font-semibold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Match Explanation (Hidden small text) */}
                                <div className="mt-4 pt-4 border-t border-slate-800/50 text-xs text-slate-500 italic">
                                    Matched because: Your experience with React and Next.js align with 90% of the core requirements.
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Profile Strength */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/20">
                        <h3 className="text-lg font-bold mb-4">Complete your Profile</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-slate-400 font-medium">Profile Strength: <span className="text-white font-bold">Good</span></span>
                                <span className="text-white font-bold">65%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Add your <b>Top 3 Projects</b> to reach 85% and get 3x more recruiter views.
                            </p>
                            <button className="w-full bg-white text-slate-900 py-2 rounded-xl font-bold text-sm hover:bg-slate-100 transition">
                                Fix Profile
                            </button>
                        </div>
                    </div>

                    {/* Skill Gap Analysis */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-orange-400" />
                            Skill Gap Analysis
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">Based on your dream role: <b>Senior Frontend Developer</b></p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                <span className="text-slate-300 font-medium">GraphQL</span>
                                <span className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg font-bold">Missing</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                <span className="text-slate-300 font-medium">Redis</span>
                                <span className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg font-bold">Missing</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                                <span className="text-slate-300 font-medium">Next.js</span>
                                <CheckCircle2 size={16} className="text-green-500" />
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 border border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-800 transition">
                            Recommended Courses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
