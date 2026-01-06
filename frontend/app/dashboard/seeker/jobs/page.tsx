'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Briefcase, Sparkles, SlidersHorizontal, ChevronRight, Zap } from 'lucide-react'

const MOCK_ALL_JOBS = [
    { id: 1, title: 'Senior Frontend Engineer', company: 'Linear', location: 'Remote', salary: '₹30L - ₹45L', match: 96, tags: ['React', 'Next.js'] },
    { id: 2, title: 'Backend Architect', company: 'Stripe', location: 'Bangalore', salary: '₹50L+', match: 82, tags: ['Go', 'Kubernetes'] },
    { id: 3, title: 'Product Designer', company: 'Airbnb', location: 'Hybrid', salary: '₹25L - ₹35L', match: 74, tags: ['Figma', 'System'] },
    { id: 4, title: 'Full Stack Developer', company: 'Vercel', location: 'Remote', salary: '₹40L+', match: 89, tags: ['Next.js', 'Postgres'] },
    { id: 5, title: 'Growth Manager', company: 'GrowthX', location: 'Remote', salary: '₹20L - ₹30L', match: 65, tags: ['Marketing', 'Analytics'] },
]

export default function JobsDiscovery() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">

            {/* Search Header */}
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] -z-10"></div>
                <h1 className="text-4xl font-black text-white mb-8">Find your next <span className="text-indigo-400 italic">Dream Path.</span></h1>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, skill, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                    <button className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white hover:bg-slate-800 transition">
                        <SlidersHorizontal size={20} /> Filters
                    </button>
                    <button className="bg-indigo-600 px-10 py-4 rounded-2xl font-black text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition active:scale-95">
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">

                {/* Sidebar Filters */}
                <div className="hidden lg:block space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Job Type</h3>
                        <div className="space-y-3">
                            {['Full-time', 'Freelance', 'Contract', 'Internship'].map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-800 group-hover:border-indigo-500 transition-colors"></div>
                                    <span className="text-slate-400 group-hover:text-white transition-colors">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Work Mode</h3>
                        <div className="space-y-3">
                            {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                                <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-800 group-hover:border-indigo-500 transition-colors"></div>
                                    <span className="text-slate-400 group-hover:text-white transition-colors">{mode}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                        <p className="text-xs text-slate-500 mb-2">PRO TIP</p>
                        <p className="text-sm text-slate-300 font-medium">Verify your skills to appear higher in recruiter searches!</p>
                        <button className="w-full mt-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition">Verify Now</button>
                    </div>
                </div>

                {/* Job Results */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-slate-400 font-medium">{MOCK_ALL_JOBS.length} jobs found</p>
                        <select className="bg-transparent text-slate-400 font-bold outline-none cursor-pointer">
                            <option>Relevance</option>
                            <option>Newest</option>
                            <option>Salary (High to Low)</option>
                        </select>
                    </div>

                    {MOCK_ALL_JOBS.map(job => (
                        <div key={job.id} className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900/60 hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden group">

                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                                    {job.company[0]}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">{job.title}</h3>
                                            <p className="text-slate-400 font-semibold">{job.company}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-black mb-2">
                                                <Zap size={14} className="fill-current" /> {job.match}% Match
                                            </div>
                                            <p className="text-lg font-black text-white">{job.salary}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 mt-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
                                        <div className="flex items-center gap-1.5"><Briefcase size={16} /> Full-time</div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex gap-2">
                                            {job.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-xs font-bold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <button className="flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
                                            Apply Now <ChevronRight size={18} className="text-indigo-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Skill Gap Indicator */}
                            {job.match < 90 && (
                                <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center gap-2 text-xs text-slate-500">
                                    <Sparkles size={14} className="text-indigo-400" />
                                    <span>Learn <b>GraphQL</b> to increase your match score to 95%+</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
