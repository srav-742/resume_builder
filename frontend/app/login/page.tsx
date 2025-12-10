'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Eye, EyeOff } from 'lucide-react'

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
      // ✅ Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      const idToken = await user.getIdToken(); // ✅ Correct way

      // ✅ Sync user profile (optional)
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!profileResponse.ok) {
        console.error('Failed to sync user profile');
      }

      // ✅ CORRECT: Fetch resumes from /api/resume (NOT /api/user/resumes)
      const resumeResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resume`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (resumeResponse.ok) {
        const { resumes } = await resumeResponse.json();
        if (resumes?.length > 0) {
          localStorage.setItem('resumeData', JSON.stringify(resumes[0]));
        }
      }

      router.push('/builder');
    } catch (error: any) {
      console.error('Firebase login error:', error);
      let message = 'Login failed. Please check your credentials.';

      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken(); // ✅ Correct way

      // Sync profile
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // ✅ Fetch resumes from /api/resume
      const resumeResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resume`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (resumeResponse.ok) {
        const { resumes } = await resumeResponse.json();
        if (resumes?.length > 0) {
          localStorage.setItem('resumeData', JSON.stringify(resumes[0]));
        }
      }

      router.push('/builder');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      let message = 'Google sign-in failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup closed.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'Only one popup allowed at a time.';
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Resume Builder</h1>
          <h2 className="text-xl font-semibold text-gray-800">Login</h2>
        </div>
      </header>

      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="relative p-6">
                <img
                  src="/images/resume login.jpg"
                  alt="Resume Login Illustration"
                  className="max-w-md h-auto object-contain"
                />
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Login to Your Account
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                    {password && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <div className="mt-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    New user?{' '}
                    <Link href="/signup" className="text-blue-600 font-medium hover:text-blue-800 transition">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 py-6 text-center">
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          <span className="font-semibold text-blue-600">Unlock your career potential</span> with our professional resume
          builder. Create ATS-optimized resumes that get noticed by recruiters and help you land your dream job faster.
        </p>
      </footer>
    </div>
  )
}