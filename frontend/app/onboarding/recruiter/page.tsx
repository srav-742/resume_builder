'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ArrowLeft, Building2, Rocket, UserCircle2, ShieldCheck, Briefcase } from 'lucide-react'
import { auth } from '@/lib/firebase'

export default function RecruiterOnboarding() {
    const [step, setStep] = useState(1)
    const [data, setData] = useState({
        type: '', // Company HR, Founder, Freelance Recruiter
        companyName: '',
        industry: '',
        urgency: ''
    })
    const router = useRouter()

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleComplete = async () => {
        try {
            const idToken = await auth.currentUser?.getIdToken()
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    company: {
                        name: data.companyName,
                        industry: data.industry
                    },
                    role: 'recruiter',
                    onboardingComplete: true
                })
            })
            router.push('/dashboard/recruiter')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-2xl z-10">
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-pink-500' : 'bg-slate-800'
                                }`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-pink-400 w-8 h-8" />
                            <h1 className="text-3xl font-bold">Tell us about your role</h1>
                        </div>
                        <p className="text-slate-400 text-lg mb-8">How will you be using DreamPath?</p>

                        <div className="grid gap-4">
                            {[
                                { id: 'hr', icon: <Building2 />, label: 'Company HR / Recruiter', desc: 'Hiring for my current organization.' },
                                { id: 'founder', icon: <Rocket />, label: 'Startup Founder', desc: 'Building my core team from scratch.' },
                                { id: 'agency', icon: <UserCircle2 />, label: 'Independent Recruiter / Agency', desc: 'Hiring for multiple clients.' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setData({ ...data, type: item.label }); nextStep(); }}
                                    className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-pink-500 hover:bg-slate-800/50 transition-all text-left group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{item.label}</h3>
                                        <p className="text-slate-400 text-sm">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-3xl font-bold mb-8">Organization Details</h1>
                        <div className="space-y-6 mb-12">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={data.companyName}
                                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                                    className="w-full bg-slate-900 border-slate-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-pink-500 outline-none transition"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
                                <select
                                    value={data.industry}
                                    onChange={(e) => setData({ ...data, industry: e.target.value })}
                                    className="w-full bg-slate-900 border-slate-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-pink-500 outline-none transition"
                                >
                                    <option value="">Select Industry</option>
                                    <option value="tech">Technology / Software</option>
                                    <option value="fintech">Fintech</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={prevStep} className="text-slate-400 flex items-center gap-2 hover:text-white transition">
                                <ArrowLeft size={18} /> Previous
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!data.companyName || !data.industry}
                                className="bg-pink-600 px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-pink-500 transition disabled:opacity-50"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
                        <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-pink-400 ring-4 ring-pink-500/10 animate-pulse">
                            <Briefcase size={40} />
                        </div>
                        <h1 className="text-4xl font-black mb-4">Welcome aboard, Partner.</h1>
                        <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto">
                            Your recruitment workspace is ready. Let's post your first role and find your next star employee.
                        </p>

                        <button
                            onClick={handleComplete}
                            className="w-full bg-pink-600 py-4 rounded-2xl font-black text-xl hover:bg-pink-500 transition shadow-lg shadow-pink-600/20 flex items-center justify-center gap-3 group"
                        >
                            Enter Recruiter Portal <ArrowRight className="group-hover:translate-x-1 transition" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
