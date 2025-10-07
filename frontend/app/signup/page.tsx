'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile, getIdToken } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // ✅ Update profile to include name (so it appears in ID token)
      await updateProfile(userCredential.user, { displayName: name });
      
      // ✅ Get a fresh ID token that includes the name
      const idToken = await getIdToken(userCredential.user, true); // true = force refresh
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync user with backend');
      }

      // ✅ Redirect after successful Firebase signup + backend sync
      router.push('/builder')
    } catch (error) {
      console.error('Signup error:', error)
      let message = 'Signup failed. Please try again.'
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email.'
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.'
      } else if (error.message === 'Failed to sync user with backend') {
        message = 'Account created, but server error. Please log in.'
      }
      alert(message)
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
          <h2 className="text-xl font-semibold text-gray-800">Sign Up</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Create Your Account
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  
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
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 font-medium hover:text-blue-800 transition">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="relative">
                <img 
                  src="/images/resumesignup image.png" 
                  alt="Resume Signup Illustration"
                  className="max-w-md h-auto object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 text-center">
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          <span className="font-semibold text-blue-600">Craft your perfect resume</span> with our AI-powered builder. 
          Stand out from the crowd and land your dream job with professionally designed, ATS-friendly resumes that 
          showcase your unique skills and experience.
        </p>
      </footer>
    </div>
  )
}