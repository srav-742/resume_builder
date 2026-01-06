'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ArrowLeft, Target, Briefcase, GraduationCap, MapPin, BadgeCheck } from 'lucide-react'
import { auth } from '@/lib/firebase'

export default function SeekerOnboarding() {
    const [step, setStep] = useState(1)
    const [data, setData] = useState({
        type: '', // Fresher, Experienced, Freelancer
        jobTypes: [] as string[],
        skills: [] as string[],
        locationPref: '',
        workMode: ''
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
                    summary: `Looking for ${data.type} opportunities in ${data.jobTypes.join(', ')}. Preferred mode: ${data.workMode}.`,
                    preferences: {
                        jobTypes: data.jobTypes,
                        workModes: [data.workMode],
                        locations: [data.locationPref]
                    },
                    onboardingComplete: true
                })
            })
            router.push('/dashboard/seeker')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-2xl z-10">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-500' : 'bg-slate-800'
                                }`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="text-indigo-400 w-8 h-8" />
                            <h1 className="text-3xl font-bold">First, what's your stage?</h1>
                        </div>
                        <p className="text-slate-400 text-lg mb-8">We'll tailor your experience based on your current professional status.</p>

                        <div className="grid gap-4">
                            {[
                                { id: 'fresher', icon: <GraduationCap />, label: 'Fresher', desc: 'I recently graduated or am about to.' },
                                { id: 'experienced', icon: <Briefcase />, label: 'Experienced Professional', desc: 'I have 1+ years of work experience.' },
                                { id: 'freelancer', icon: <Target />, label: 'Freelancer / Intern', desc: 'I am looking for project-based work.' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setData({ ...data, type: item.label }); nextStep(); }}
                                    className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-indigo-500 hover:bg-slate-800/50 transition-all text-left group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
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
                        <h1 className="text-3xl font-bold mb-8">What kind of roles interest you?</h1>
                        <div className="grid grid-cols-2 gap-4 mb-12">
                            {['Full-time', 'Internship', 'Freelance', 'Contract'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        const newTypes = data.jobTypes.includes(type)
                                            ? data.jobTypes.filter(t => t !== type)
                                            : [...data.jobTypes, type]
                                        setData({ ...data, jobTypes: newTypes })
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${data.jobTypes.includes(type)
                                            ? 'border-indigo-500 bg-indigo-500/10 text-white'
                                            : 'border-slate-800 bg-slate-900 text-slate-400'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={prevStep} className="text-slate-400 flex items-center gap-2 hover:text-white transition">
                                <ArrowLeft size={18} /> Previous
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={data.jobTypes.length === 0}
                                className="bg-indigo-600 px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-indigo-500 transition disabled:opacity-50"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-3xl font-bold mb-8">Where do you want to work?</h1>
                        <div className="grid gap-4 mb-12">
                            {[
                                { id: 'Remote', icon: <MapPin />, label: 'Remote / Work from Anywhere' },
                                { id: 'Onsite', icon: <BadgeCheck />, label: 'Onsite / Office only' },
                                { id: 'Hybrid', icon: <Sparkles />, label: 'Hybrid (Best of both worlds)' }
                            ].map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => setData({ ...data, workMode: mode.id })}
                                    className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${data.workMode === mode.id
                                            ? 'border-indigo-500 bg-indigo-500/10 text-white'
                                            : 'border-slate-800 bg-slate-900 text-slate-400'
                                        }`}
                                >
                                    <span className="text-indigo-400">{mode.icon}</span>
                                    <span className="text-lg font-bold">{mode.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={prevStep} className="text-slate-400 flex items-center gap-2 hover:text-white transition">
                                <ArrowLeft size={18} /> Previous
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!data.workMode}
                                className="bg-indigo-600 px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-indigo-500 transition disabled:opacity-50"
                            >
                                Almost there <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
                        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-400 ring-4 ring-indigo-500/10 animate-pulse">
                            <Sparkles size={40} />
                        </div>
                        <h1 className="text-4xl font-black mb-4">You're all set!</h1>
                        <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto">
                            Our AI is already analyzing top companies matching your profile. Ready to see your matches?
                        </p>

                        <button
                            onClick={handleComplete}
                            className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 group"
                        >
                            Enter Dashboard <ArrowRight className="group-hover:translate-x-1 transition" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
