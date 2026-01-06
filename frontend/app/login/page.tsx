'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        const role = profile.role || 'seeker';
        router.push(role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter');
      } else {
        router.push('/builder');
      }
    } catch (error: any) {
      console.error('Firebase login error:', error)
      alert('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        const role = profile.role || 'seeker';
        router.push(role === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter');
      } else {
        router.push('/builder');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error)
      alert('Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 z-10">
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center gap-2 mb-8 animate-in fade-in duration-700">
              <Sparkles className="text-indigo-500 w-8 h-8" />
              <h1 className="text-2xl font-bold text-white tracking-tight">DreamPath</h1>
            </div>

            <div className="space-y-2 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <h2 className="text-4xl font-black text-white">Welcome Back</h2>
              <p className="text-slate-400 font-medium">Log in to manage your professional path.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="group">
                <label className="block text-sm font-bold text-slate-400 mb-2 group-focus-within:text-indigo-400 transition-colors">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="group relative">
                <label className="block text-sm font-bold text-slate-400 mb-2 group-focus-within:text-indigo-400 transition-colors">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition pr-14"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-[46px] text-slate-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl font-black text-lg text-white transition-all transform active:scale-95 shadow-xl bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? 'Processing...' : 'Sign In'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="mt-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-100 transition active:scale-95 shadow-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-10 text-center text-slate-500 font-medium">
              Don't have an account? <Link href="/signup" className="text-indigo-400 font-black hover:underline underline-offset-4">Create one</Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center p-16 relative overflow-hidden bg-indigo-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-sm">
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
              <img
                src="/images/resume login.jpg"
                alt="Professional Portal"
                className="w-full h-auto object-cover rounded-3xl shadow-2xl relative z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-700"
              />
            </div>
            <h3 className="text-4xl font-black text-white mb-6 leading-tight">
              Unlock Your Potential.
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Access AI-powered career tools, resume building, and smarter job opportunities.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
        </div>
      </div>
    </div>
  )
}
