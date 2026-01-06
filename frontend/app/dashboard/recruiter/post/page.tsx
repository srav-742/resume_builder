'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ArrowLeft, Target, Briefcase, Zap, HelpCircle, DollarSign, MapPin } from 'lucide-react'
import { auth } from '@/lib/firebase'

export default function PostJobPage() {
    const [step, setStep] = useState(1)
    const [data, setData] = useState({
        title: '',
        problemToSolve: '',
        mandatorySkills: [] as string[],
        experience: 'Fresher',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salary: { min: '', max: '' },
        urgency: 'Normal',
        openings: 1
    })
    const router = useRouter()

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleSubmit = async () => {
        try {
            const idToken = await auth.currentUser?.getIdToken()
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                },
                body: JSON.stringify(data)
            })
            if (res.ok) {
                router.push('/dashboard/recruiter/jobs')
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-6 lg:p-12 max-w-4xl mx-auto min-h-screen">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2">Create a New Role</h1>
                <p className="text-slate-400">Let's find your next star colleague through smart questions.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-2 bg-slate-800">
                    <div
                        className="h-full bg-pink-500 transition-all duration-500"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8 lg:p-12">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="space-y-4">
                                <label className="text-xl font-bold flex items-center gap-2">
                                    <HelpCircle className="text-pink-400" />
                                    What is the job title and the main problem this person will solve?
                                </label>
                                <input
                                    type="text"
                                    placeholder="Role Title (e.g. Senior Product Engineer)"
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                    className="w-full bg-slate-950 border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-pink-500 transition"
                                />
                                <textarea
                                    placeholder="Describe the main challenge (e.g. Building our core banking ledger from zero to scale...)"
                                    value={data.problemToSolve}
                                    onChange={(e) => setData({ ...data, problemToSolve: e.target.value })}
                                    className="w-full bg-slate-950 border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-pink-500 transition h-32"
                                />
                            </div>
                            <button onClick={nextStep} disabled={!data.title || !data.problemToSolve} className="w-full bg-pink-600 py-4 rounded-2xl font-black text-lg hover:bg-pink-500 transition disabled:opacity-50">
                                Next Step
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="space-y-4">
                                <label className="text-xl font-bold flex items-center gap-2">
                                    <Target className="text-pink-400" />
                                    What skills are absolutely mandatory?
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {['React', 'Node.js', 'Python', 'Go', 'AWS', 'Figma', 'Solidity', 'Rust', 'Docker'].map(skill => (
                                        <button
                                            key={skill}
                                            onClick={() => {
                                                const newSkills = data.mandatorySkills.includes(skill)
                                                    ? data.mandatorySkills.filter(s => s !== skill)
                                                    : [...data.mandatorySkills, skill]
                                                setData({ ...data, mandatorySkills: newSkills })
                                            }}
                                            className={`p-4 rounded-xl border-2 transition-all font-bold ${data.mandatorySkills.includes(skill)
                                                    ? 'border-pink-500 bg-pink-500/10 text-white'
                                                    : 'border-slate-800 bg-slate-950 text-slate-400'
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-4 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition">Back</button>
                                <button onClick={nextStep} disabled={data.mandatorySkills.length === 0} className="flex-[2] bg-pink-600 py-4 rounded-2xl font-black text-lg hover:bg-pink-500 transition disabled:opacity-50">Continue</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="font-bold flex items-center gap-2">Experience Level</label>
                                    <select
                                        value={data.experience}
                                        onChange={(e) => setData({ ...data, experience: e.target.value })}
                                        className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="Fresher">Fresher / Intern</option>
                                        <option value="0-2">0-2 Years</option>
                                        <option value="3-5">3-5 Years</option>
                                        <option value="5+">5+ Years</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="font-bold flex items-center gap-2">Work Mode</label>
                                    <select
                                        value={data.workMode}
                                        onChange={(e) => setData({ ...data, workMode: e.target.value })}
                                        className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="Remote">Fully Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Onsite">On-site</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="font-bold flex items-center gap-2">Hiring Urgency</label>
                                    <select
                                        value={data.urgency}
                                        onChange={(e) => setData({ ...data, urgency: e.target.value })}
                                        className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="Immediate">Immediate Hire (ASAP)</option>
                                        <option value="Normal">Normal (2-4 Weeks)</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="font-bold flex items-center gap-2">Openings</label>
                                    <input
                                        type="number"
                                        value={data.openings}
                                        onChange={(e) => setData({ ...data, openings: parseInt(e.target.value) })}
                                        className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-4 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition">Back</button>
                                <button onClick={nextStep} className="flex-[2] bg-pink-600 py-4 rounded-2xl font-black text-lg hover:bg-pink-500 transition">Almost Done</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in duration-500 text-center">
                            <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
                                <Zap size={40} />
                            </div>
                            <h2 className="text-3xl font-black">Ready to Publish?</h2>
                            <p className="text-slate-400 max-w-md mx-auto">
                                By publishing this job, our AI will immediately start scanning 100,000+ candidates for the perfect match.
                            </p>

                            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-left space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Title</span>
                                    <span className="font-bold">{data.title}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Role Type</span>
                                    <span className="font-bold">{data.employmentType}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Experience</span>
                                    <span className="font-bold">{data.experience}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-4 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition">Back</button>
                                <button onClick={handleSubmit} className="flex-[2] bg-pink-600 py-4 rounded-2xl font-black text-lg hover:bg-pink-500 transition shadow-lg shadow-pink-600/20">
                                    Publish Job Post
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
