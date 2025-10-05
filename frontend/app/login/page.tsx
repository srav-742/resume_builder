// app/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Use the environment variable for backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Use the full backend URL instead of relative path
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/builder')
      } else {
        const data = await res.json()
        alert(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Resume Builder</h1>
          <h2 className="text-xl font-semibold text-gray-800">Login</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Image */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="relative p-6">
                {/* Fixed filename - use underscore instead of space */}
                <img 
                  src="/images/resume login.jpg" 
                  alt="Resume Login Illustration" 
                  className="max-w-md h-auto object-contain"
                />
              </div>
            </div>

            {/* Right Side - Form */}
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
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
                
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

      {/* Footer */}
      <footer className="mt-8 py-6 text-center">
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          <span className="font-semibold text-blue-600">Unlock your career potential</span> with our professional resume builder. 
          Create ATS-optimized resumes that get noticed by recruiters and help you land your dream job faster.
        </p>
      </footer>
    </div>
  )
}